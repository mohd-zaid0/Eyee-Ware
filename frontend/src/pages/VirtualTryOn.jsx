
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import API from "../services/api";

function VirtualTryOn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const productId = searchParams.get("product");

  // =========================================================
  // REFS
  // =========================================================

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const streamRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const glassesImageRef = useRef(null);

  // =========================================================
  // STATE
  // =========================================================

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [cameraStarted, setCameraStarted] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(false);

  const [faceDetected, setFaceDetected] = useState(false);

  const [error, setError] = useState("");

  const [isLandmarkerReady, setIsLandmarkerReady] =
    useState(false);

  const [glassesReady, setGlassesReady] =
    useState(false);

  // =========================================================
  // TRY-ON CALIBRATION
  // =========================================================
  //
  // These values control how glasses sit on the face.
  //
  // GLASSES_SCALE:
  // Increase = bigger glasses
  // Decrease = smaller glasses
  //
  // For most transparent glasses PNGs, 2.15 - 2.35
  // works better than the old 2.55.
  //

  const GLASSES_SCALE = 2.25;
  

  // Vertical position:
  // positive = move down
  // negative = move up
  const VERTICAL_OFFSET = 0.08;

  // Small horizontal adjustment
  const HORIZONTAL_OFFSET = 0;

  // =========================================================
  // LOAD PRODUCT
  // =========================================================

  useEffect(() => {
    if (!productId) {
      setLoadingProduct(false);
      return;
    }

    getProduct();
  }, [productId]);

  const getProduct = async () => {
    try {
      setLoadingProduct(true);
      setError("");
      setGlassesReady(false);

      const response = await API.get(
        `/products/${productId}`
      );

      const productData = response.data;

      setProduct(productData);

      if (!productData?.image) {
        setError(
          "This product does not have a glasses image."
        );

        return;
      }

      const image = new Image();

      image.onload = () => {
        console.log(
          "Glasses image loaded:",
          image.width,
          image.height
        );

        glassesImageRef.current = image;

        setGlassesReady(true);
      };

      image.onerror = (err) => {
        console.error(
          "Glasses image loading failed:",
          err
        );

        setGlassesReady(false);

        setError(
          "Unable to load the glasses image for this product."
        );
      };

      image.src = productData.image;
    } catch (err) {
      console.error(
        "Product Load Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load this product."
      );
    } finally {
      setLoadingProduct(false);
    }
  };

  // =========================================================
  // INITIALIZE MEDIAPIPE
  // =========================================================

  const initializeFaceLandmarker = async () => {
    try {
      setError("");

      console.log(
        "Initializing MediaPipe Face Landmarker..."
      );

      const vision =
        await FilesetResolver.forVisionTasks(
          "/wasm"
        );

      console.log(
        "MediaPipe WASM loaded successfully."
      );

      const faceLandmarker =
        await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",

              delegate: "GPU",
            },

            runningMode: "VIDEO",

            numFaces: 1,

            minFaceDetectionConfidence: 0.5,

            minFacePresenceConfidence: 0.5,

            minTrackingConfidence: 0.5,

            outputFaceBlendshapes: false,

            outputFacialTransformationMatrixes: false,
          }
        );

      faceLandmarkerRef.current =
        faceLandmarker;

      setIsLandmarkerReady(true);

      console.log(
        "Face Landmarker ready."
      );

      return faceLandmarker;
    } catch (err) {
      console.error(
        "Face Landmarker Error:",
        err
      );

      setIsLandmarkerReady(false);

      setError(
        "Face detection could not be initialized. Please refresh the page and try again."
      );

      return null;
    }
  };

  // =========================================================
  // INITIALIZE ON PAGE LOAD
  // =========================================================

  useEffect(() => {
    initializeFaceLandmarker();

    return () => {
      stopCamera();

      if (faceLandmarkerRef.current) {
        try {
          faceLandmarkerRef.current.close();
        } catch (err) {
          console.error(
            "Face Landmarker close error:",
            err
          );
        }

        faceLandmarkerRef.current = null;
      }
    };
  }, []);

  // =========================================================
  // START CAMERA
  // =========================================================

  const startCamera = async () => {
    try {
      setLoadingCamera(true);
      setError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera is not supported by this browser."
        );
      }

      if (!faceLandmarkerRef.current) {
        const landmarker =
          await initializeFaceLandmarker();

        if (!landmarker) {
          throw new Error(
            "Face detection could not be initialized."
          );
        }
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "user",
            },

            width: {
              ideal: 1280,
            },

            height: {
              ideal: 720,
            },

            frameRate: {
              ideal: 30,
              max: 60,
            },
          },

          audio: false,
        });

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        throw new Error(
          "Camera video element is unavailable."
        );
      }

      video.srcObject = stream;

      await video.play();

      setCameraStarted(true);

      animationFrameRef.current =
        requestAnimationFrame(
          detectFace
        );
    } catch (err) {
      console.error(
        "Camera Error:",
        err
      );

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError(
          "Camera permission was denied. Please allow camera access in your browser."
        );
      } else if (
        err.name === "NotReadableError"
      ) {
        setError(
          "Camera is already being used by another application or browser tab."
        );
      } else {
        setError(
          err.message ||
            "Unable to start camera."
        );
      }
    } finally {
      setLoadingCamera(false);
    }
  };

  // =========================================================
  // STOP CAMERA
  // =========================================================

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(
        animationFrameRef.current
      );

      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          try {
            track.stop();
          } catch (err) {}
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (err) {}

      videoRef.current.srcObject = null;
    }

    setCameraStarted(false);
    setFaceDetected(false);

    clearCanvas();
  };

  // =========================================================
  // CLEAR CANVAS
  // =========================================================

  const clearCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  // =========================================================
  // FACE DETECTION LOOP
  // =========================================================

  const detectFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const landmarker =
      faceLandmarkerRef.current;

    if (
      !video ||
      !canvas ||
      !landmarker ||
      video.readyState < 2
    ) {
      animationFrameRef.current =
        requestAnimationFrame(
          detectFace
        );

      return;
    }

    const width =
      video.videoWidth;

    const height =
      video.videoHeight;

    if (!width || !height) {
      animationFrameRef.current =
        requestAnimationFrame(
          detectFace
        );

      return;
    }

    if (
      canvas.width !== width ||
      canvas.height !== height
    ) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      animationFrameRef.current =
        requestAnimationFrame(
          detectFace
        );

      return;
    }

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    try {
      const timestamp =
        performance.now();

      const result =
        landmarker.detectForVideo(
          video,
          timestamp
        );

      if (
        result.faceLandmarks &&
        result.faceLandmarks.length > 0
      ) {
        setFaceDetected(true);

        const landmarks =
          result.faceLandmarks[0];

        drawGlasses(
          ctx,
          landmarks,
          width,
          height
        );
      } else {
        setFaceDetected(false);
      }
    } catch (err) {
      console.error(
        "Face Detection Error:",
        err
      );
    }

    animationFrameRef.current =
      requestAnimationFrame(
        detectFace
      );
  };

// =========================================================
// DRAW GLASSES
// =========================================================

const drawGlasses = (
  ctx,
  landmarks,
  width,
  height
) => {
  const glassesImage = glassesImageRef.current;

  if (!glassesImage || !glassesReady) {
    return;
  }

  // =======================================================
  // FACE LANDMARKS
  // =======================================================

  const leftOuter = landmarks[33];
  const rightOuter = landmarks[263];

  const leftInner = landmarks[133];
  const rightInner = landmarks[362];

  const noseBridge = landmarks[168];

  if (
    !leftOuter ||
    !rightOuter ||
    !leftInner ||
    !rightInner ||
    !noseBridge
  ) {
    return;
  }

  // =======================================================
  // CONVERT TO PIXELS
  // =======================================================

  const leftX = leftOuter.x * width;
  const leftY = leftOuter.y * height;

  const rightX = rightOuter.x * width;
  const rightY = rightOuter.y * height;

  const leftInnerX = leftInner.x * width;
  const leftInnerY = leftInner.y * height;

  const rightInnerX = rightInner.x * width;
  const rightInnerY = rightInner.y * height;

  const noseX = noseBridge.x * width;
  const noseY = noseBridge.y * height;

  // =======================================================
  // EYE CENTERS
  // =======================================================

  const leftEyeCenterX =
    (leftX + leftInnerX) / 2;

  const leftEyeCenterY =
    (leftY + leftInnerY) / 2;

  const rightEyeCenterX =
    (rightX + rightInnerX) / 2;

  const rightEyeCenterY =
    (rightY + rightInnerY) / 2;

  // =======================================================
  // FACE CENTER
  // =======================================================

  const centerX =
    (leftEyeCenterX + rightEyeCenterX) / 2;

  const eyeCenterY =
    (leftEyeCenterY + rightEyeCenterY) / 2;

  /*
    Mix eye position + nose bridge position
    so glasses sit naturally on the nose.
  */

  const centerY =
    eyeCenterY * 0.72 +
    noseY * 0.28;

  // =======================================================
  // EYE DISTANCE
  // =======================================================

  const eyeDistance = Math.sqrt(
    Math.pow(rightX - leftX, 2) +
    Math.pow(rightY - leftY, 2)
  );

  if (eyeDistance < 20) {
    return;
  }

  // =======================================================
  // GLASSES SIZE
  // =======================================================

  /*
    IMPORTANT:

    2.55 = smaller
    2.8  = medium
    3.0  = recommended
    3.2  = larger

    Tumhare case me 3.0 use kar rahe hain.
  */

  const glassesWidth =
    eyeDistance * 1.8;

  if (
    !glassesImage.width ||
    !glassesImage.height
  ) {
    return;
  }

  const imageAspectRatio =
    glassesImage.height /
    glassesImage.width;

  const glassesHeight =
    glassesWidth * imageAspectRatio;

  // =======================================================
  // FACE ROTATION
  // =======================================================

  const angle = Math.atan2(
    rightY - leftY,
    rightX - leftX
  );

  // =======================================================
  // VERTICAL POSITION
  // =======================================================

  /*
    Positive value = move glasses DOWN
    Negative value = move glasses UP
  */

  const verticalOffset =
    eyeDistance * 0.08;

  const finalCenterY =
    centerY + verticalOffset;

  // =======================================================
  // DRAW
  // =======================================================

  ctx.save();

  ctx.translate(
    centerX,
    finalCenterY
  );

  ctx.rotate(angle);

  ctx.globalAlpha = 1;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    glassesImage,
    -glassesWidth / 2,
    -glassesHeight / 2,
    glassesWidth,
    glassesHeight
  );

  ctx.restore();
};

  // =========================================================
  // TAKE SCREENSHOT
  // =========================================================

  const takeScreenshot = () => {
    const video =
      videoRef.current;

    const glassesCanvas =
      canvasRef.current;

    if (
      !video ||
      !glassesCanvas ||
      !cameraStarted
    ) {
      return;
    }

    const width =
      video.videoWidth;

    const height =
      video.videoHeight;

    if (!width || !height) {
      return;
    }

    const screenshotCanvas =
      document.createElement(
        "canvas"
      );

    screenshotCanvas.width =
      width;

    screenshotCanvas.height =
      height;

    const ctx =
      screenshotCanvas.getContext(
        "2d"
      );

    if (!ctx) return;

    /*
      Mirror both camera and glasses
      together so screenshot matches
      what user sees.
    */

    ctx.save();

    ctx.translate(
      width,
      0
    );

    ctx.scale(
      -1,
      1
    );

    ctx.drawImage(
      video,
      0,
      0,
      width,
      height
    );

    ctx.drawImage(
      glassesCanvas,
      0,
      0,
      width,
      height
    );

    ctx.restore();

    const link =
      document.createElement(
        "a"
      );

    link.download =
      `eyee-wear-try-on-${Date.now()}.png`;

    link.href =
      screenshotCanvas.toDataURL(
        "image/png"
      );

    link.click();
  };

  // =========================================================
  // NO PRODUCT
  // =========================================================

  if (!productId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-sm">

          <div className="text-6xl">
            👓
          </div>

          <h1 className="mt-5 text-2xl font-black text-gray-900">
            No Glasses Selected
          </h1>

          <p className="mt-3 text-gray-500">
            Please select a pair of glasses first
            to use Virtual Try-On.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
            className="mt-7 rounded-xl bg-gray-900 px-6 py-3 font-bold text-white transition hover:bg-blue-600"
          >
            Browse Glasses
          </button>

        </div>
      </main>
    );
  }

  // =========================================================
  // PRODUCT LOADING
  // =========================================================

  if (loadingProduct) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-5 text-sm font-semibold text-gray-500">
            Loading Virtual Try-On...
          </p>

        </div>

      </main>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-6 sm:px-6">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <button
              onClick={() =>
                navigate("/products")
              }
              className="mb-3 text-sm font-semibold text-gray-400 transition hover:text-white"
            >
              ← Back to Products
            </button>

            <h1 className="text-3xl font-black text-white sm:text-4xl">
              Virtual Try-On
            </h1>

            <p className="mt-2 text-gray-400">
              See how these glasses look on your face.
            </p>

          </div>

          {product && (
            <div className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-3">

              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-14 w-14 rounded-xl bg-white object-contain p-1"
                />
              )}

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                  Trying On
                </p>

                <p className="mt-1 font-bold text-white">
                  {product.name}
                </p>

              </div>

            </div>
          )}

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-900 bg-red-950/50 px-5 py-4 text-sm font-semibold text-red-300">
            {error}
          </div>
        )}

        {/* IMAGE STATUS */}

        {!glassesReady && product?.image && (
          <div className="mb-5 rounded-2xl border border-yellow-900 bg-yellow-950/40 px-5 py-4 text-sm font-semibold text-yellow-300">
            Loading glasses image...
          </div>
        )}

        {/* TRY ON */}

        <div className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 shadow-2xl">

          <div className="relative mx-auto aspect-[4/3] w-full max-w-4xl overflow-hidden bg-black">

            {/* CAMERA */}

            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              className={`absolute inset-0 h-full w-full object-cover ${
                cameraStarted
                  ? "block"
                  : "hidden"
              }`}
              style={{
                transform:
                  "scaleX(-1)",
              }}
            />

            {/* GLASSES CANVAS */}

            <canvas
              ref={canvasRef}
              className={`absolute inset-0 h-full w-full object-cover ${
                cameraStarted
                  ? "block"
                  : "hidden"
              }`}
              style={{
                transform:
                  "scaleX(-1)",
              }}
            />

            {/* START SCREEN */}

            {!cameraStarted && (
              <div className="absolute inset-0 flex items-center justify-center px-6">

                <div className="max-w-md text-center">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/20 text-4xl">
                    👓
                  </div>

                  <h2 className="mt-6 text-2xl font-black text-white sm:text-3xl">
                    Try These Glasses On
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Allow camera access and position
                    your face inside the camera.
                    The glasses will automatically
                    resize and follow your face.
                  </p>

                  <button
                    onClick={
                      startCamera
                    }
                    disabled={
                      loadingCamera ||
                      !isLandmarkerReady ||
                      !glassesReady
                    }
                    className="mt-7 rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingCamera
                      ? "Starting Camera..."
                      : !isLandmarkerReady
                      ? "Preparing Face Detection..."
                      : !glassesReady
                      ? "Loading Glasses..."
                      : "Start Virtual Try-On"}
                  </button>

                </div>

              </div>
            )}

            {/* FACE STATUS */}

            {cameraStarted && (
              <div className="absolute left-4 top-4">

                <div
                  className={`rounded-full px-4 py-2 text-xs font-bold backdrop-blur ${
                    faceDetected
                      ? "bg-green-500/90 text-white"
                      : "bg-black/70 text-gray-300"
                  }`}
                >
                  {faceDetected
                    ? "✓ Face Detected"
                    : "Position your face"}
                </div>

              </div>
            )}

          </div>

          {/* CONTROLS */}

          <div className="flex flex-col gap-3 border-t border-gray-800 bg-gray-900 p-5 sm:flex-row sm:items-center sm:justify-center">

            {!cameraStarted ? (
              <button
                onClick={
                  startCamera
                }
                disabled={
                  loadingCamera ||
                  !isLandmarkerReady ||
                  !glassesReady
                }
                className="rounded-xl bg-blue-600 px-7 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingCamera
                  ? "Starting..."
                  : !isLandmarkerReady
                  ? "Preparing Face Detection..."
                  : !glassesReady
                  ? "Loading Glasses..."
                  : "Start Camera"}
              </button>
            ) : (
              <>
                <button
                  onClick={
                    takeScreenshot
                  }
                  disabled={
                    !faceDetected
                  }
                  className="rounded-xl bg-white px-7 py-3 font-bold text-gray-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  📸 Capture
                </button>

                <button
                  onClick={
                    stopCamera
                  }
                  className="rounded-xl border border-gray-700 bg-gray-800 px-7 py-3 font-bold text-white transition hover:bg-gray-700"
                >
                  Stop Camera
                </button>
              </>
            )}

          </div>

        </div>

        {/* PRODUCT INFO */}

        {product && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Selected Frame
              </p>

              <h2 className="mt-2 text-xl font-black text-white">
                {product.name}
              </h2>

              {product.category && (
                <p className="mt-1 text-sm text-gray-400">
                  {product.category}
                </p>
              )}

            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                How It Works
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                MediaPipe detects your facial landmarks
                in real time and automatically resizes,
                rotates and positions the glasses
                according to your face.
              </p>

            </div>

          </div>
        )}

        {/* PRIVACY */}

        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/70 p-5 text-center">

          <p className="text-sm text-gray-400">
            🔒 Your camera is used directly in your
            browser for the virtual try-on experience.
          </p>

        </div>

      </div>

    </main>
  );
}

export default VirtualTryOn;

