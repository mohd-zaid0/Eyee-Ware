import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const navigate = useNavigate();

  const { cart, cartTotal, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // AUTH PROTECTION
  // ==========================================

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // ==========================================
  // ADMIN PROTECTION
  // ==========================================

  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  // ==========================================
  // AUTO FILL USER NAME
  // ==========================================

  useEffect(() => {
    if (user && user.role !== "admin") {
      setFormData((currentData) => ({
        ...currentData,
        name: user.name || "",
      }));
    }
  }, [user]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Please enter your full name.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!formData.address.trim()) {
      return "Please enter your complete address.";
    }

    if (!formData.city.trim()) {
      return "Please enter your city.";
    }

    if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      return "Please enter a valid 6-digit pincode.";
    }

    return "";
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setError("");

    // Login check
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Admin check
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    // Cart check
    if (!cart || cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // Form validation
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },

        items: cart.map((item) => ({
          productId: item._id,
          quantity: Number(item.quantity),
        })),

        paymentMethod: "COD",
      };

      // Token is automatically added by services/api.js interceptor
      const response = await API.post("/orders", orderData);

      console.log("Order placed successfully:", response.data);

      // Clear cart only after successful order
      clearCart();

      // Go to success page
      navigate("/order-success", {
        replace: true,
        state: {
          order: response.data.order,
        },
      });
    } catch (error) {
      console.error("Order Error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">

          <div className="text-7xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-black text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some stylish eyewear before checkout.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-7 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">

      <div className="mx-auto max-w-6xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Secure Checkout
          </p>

          <h1 className="mt-2 text-3xl font-black text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your details to place your order.
          </p>

        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ==========================================
              CUSTOMER DETAILS
          ========================================== */}

          <div className="lg:col-span-2">

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              <h2 className="text-xl font-bold text-gray-900">
                Delivery Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Where should we deliver your eyewear?
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                {/* NAME */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    maxLength="10"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* ADDRESS */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Complete Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House no., street, area..."
                    required
                    rows="4"
                    disabled={loading}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* CITY + PINCODE */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                </div>

                {/* ==========================================
                    PAYMENT
                ========================================== */}

                <div className="border-t border-gray-100 pt-6">

                  <h2 className="text-xl font-bold text-gray-900">
                    Payment Method
                  </h2>

                  <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">

                    <div className="flex items-center gap-3">

                      <div className="text-2xl">
                        💵
                      </div>

                      <div>
                        <p className="font-bold text-gray-900">
                          Cash on Delivery
                        </p>

                        <p className="text-sm text-gray-500">
                          Pay when your order arrives.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                {/* MOBILE PLACE ORDER */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gray-900 py-3.5 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400 lg:hidden"
                >
                  {loading
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

              </form>

            </div>

          </div>

          {/* ==========================================
              ORDER SUMMARY
          ========================================== */}

          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            {/* PRODUCTS */}

            <div className="mt-6 space-y-5">

              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4"
                >

                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xl">
                        👓
                      </div>
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate font-semibold text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>

                  </div>

                  <p className="shrink-0 font-semibold text-gray-900">
                    ₹{Number(item.price) * Number(item.quantity)}
                  </p>

                </div>
              ))}

            </div>

            <hr className="my-6" />

            {/* PRICE DETAILS */}

            <div className="space-y-3 text-gray-600">

              <div className="flex justify-between">
                <span>
                  Subtotal
                </span>

                <span>
                  ₹{cartTotal}
                </span>
              </div>

              <div className="flex justify-between">

                <span>
                  Delivery
                </span>

                <span className="font-semibold text-green-600">
                  FREE
                </span>

              </div>

            </div>

            <hr className="my-6" />

            {/* TOTAL */}

            <div className="flex justify-between text-xl font-black text-gray-900">

              <span>
                Total
              </span>

              <span>
                ₹{cartTotal}
              </span>

            </div>

            {/* DESKTOP PLACE ORDER */}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 hidden w-full rounded-xl bg-gray-900 py-3.5 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400 lg:block"
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              🔒 Your order details are securely processed.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Checkout;