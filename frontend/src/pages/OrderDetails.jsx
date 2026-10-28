import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isLoggedIn, user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statuses = [
    {
      name: "Pending",
      title: "Order Placed",
      description: "Your order has been received.",
      icon: "🕐",
    },
    {
      name: "Confirmed",
      title: "Order Confirmed",
      description: "Your order has been confirmed.",
      icon: "✓",
    },
    {
      name: "Shipped",
      title: "Order Shipped",
      description: "Your order is on the way.",
      icon: "🚚",
    },
    {
      name: "Delivered",
      title: "Order Delivered",
      description: "Your order has been delivered.",
      icon: "📦",
    },
  ];

  // ==========================================
  // AUTH + LOAD ORDER
  // ==========================================

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    getOrder();
  }, [isLoggedIn, user, id]);

  // ==========================================
  // GET SINGLE ORDER
  // ==========================================

  const getOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/orders/my-orders/${id}`
      );

      setOrder(response.data);
    } catch (error) {
      console.error("Order Details Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STATUS INDEX
  // ==========================================

  const getStatusIndex = (status) => {
    return statuses.findIndex(
      (item) => item.name === status
    );
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "Confirmed":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Shipped":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "Delivered":
        return "border-green-200 bg-green-50 text-green-700";

      case "Cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">

        <div className="mx-auto max-w-6xl">

          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-5 text-sm font-medium text-gray-500">
              Loading order details...
            </p>

          </div>

        </div>

      </main>
    );
  }

  // ==========================================
  // ERROR / NOT FOUND
  // ==========================================

  if (error || !order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">

        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-sm">

          <div className="text-6xl">
            📦
          </div>

          <h1 className="mt-5 text-2xl font-black text-gray-900">
            Order Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            {error || "We couldn't find this order."}
          </p>

          <button
            onClick={() => navigate("/my-orders")}
            className="mt-7 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Back to My Orders
          </button>

        </div>

      </main>
    );
  }

  const currentStatusIndex = getStatusIndex(
    order.status
  );

  const isCancelled = order.status === "Cancelled";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        {/* ==========================================
            BACK
        ========================================== */}

        <button
          onClick={() => navigate("/my-orders")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
        >
          ← Back to My Orders
        </button>

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Order Details
              </p>

              <h1 className="mt-2 break-all text-2xl font-black text-gray-900 sm:text-3xl">
                #{order._id}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Placed on {formatDate(order.createdAt)}
              </p>

            </div>

            <div
              className={`w-fit rounded-full border px-5 py-2.5 text-sm font-bold ${getStatusStyle(
                order.status
              )}`}
            >
              {order.status}
            </div>

          </div>

        </div>

        {/* ==========================================
            ORDER TRACKING
        ========================================== */}

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-black text-gray-900">
                Order Tracking
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track the progress of your order.
              </p>

            </div>

            <div className="hidden text-3xl sm:block">
              🚚
            </div>

          </div>

          {isCancelled ? (

            <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5">

              <div className="flex items-start gap-4">

                <div className="text-2xl">
                  ❌
                </div>

                <div>

                  <h3 className="font-black text-red-700">
                    Order Cancelled
                  </h3>

                  <p className="mt-1 text-sm text-red-600">
                    This order has been cancelled and will not
                    be delivered.
                  </p>

                </div>

              </div>

            </div>

          ) : (

            <div className="mt-8">

              {statuses.map((status, index) => {

                const completed =
                  index <= currentStatusIndex;

                const active =
                  index === currentStatusIndex;

                return (
                  <div
                    key={status.name}
                    className="relative flex gap-4"
                  >

                    {/* CONNECTING LINE */}

                    {index < statuses.length - 1 && (
                      <div
                        className={`absolute left-5 top-11 h-full w-0.5 ${
                          index < currentStatusIndex
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}

                    {/* ICON */}

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                        completed
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-200 bg-white text-gray-400"
                      } ${
                        active
                          ? "ring-4 ring-blue-100"
                          : ""
                      }`}
                    >
                      {completed
                        ? "✓"
                        : status.icon}
                    </div>

                    {/* TEXT */}

                    <div className="pb-9">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3
                          className={`font-bold ${
                            completed
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {status.title}
                        </h3>

                        {active && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                            Current
                          </span>
                        )}

                      </div>

                      <p
                        className={`mt-1 text-sm ${
                          completed
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        {status.description}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* ==========================================
            PRODUCTS + SUMMARY
        ========================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* PRODUCTS */}

          <div className="lg:col-span-2">

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              <h2 className="text-xl font-black text-gray-900">
                Ordered Products
              </h2>

              <div className="mt-6 divide-y">

                {order.items.map((item, index) => (

                  <div
                    key={`${item.productId || item._id}-${index}`}
                    className="flex gap-4 py-5 first:pt-0 last:pb-0"
                  >

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl">
                          👓
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="font-bold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-black text-gray-900">
                        ₹{item.price * item.quantity}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* SUMMARY */}

          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm sm:p-8">

            <h2 className="text-xl font-black text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ₹{order.subtotal}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">

                <span>Delivery</span>

                <span className="font-semibold text-green-600">
                  {order.delivery === 0
                    ? "FREE"
                    : `₹${order.delivery}`}
                </span>

              </div>

              <hr />

              <div className="flex justify-between text-xl font-black text-gray-900">
                <span>Total</span>
                <span>
                  ₹{order.total}
                </span>
              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-4">

              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Payment Method
              </p>

              <p className="mt-2 font-bold text-gray-900">
                💵 Cash on Delivery
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Pay when your order arrives.
              </p>

            </div>

          </div>

        </div>

        {/* ==========================================
            DELIVERY ADDRESS
        ========================================== */}

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
              📍
            </div>

            <div>

              <h2 className="text-xl font-black text-gray-900">
                Delivery Address
              </h2>

              <p className="text-sm text-gray-500">
                Your order will be delivered here.
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5">

            <p className="font-bold text-gray-900">
              {order.customer.name}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              📞 {order.customer.phone}
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {order.customer.address}
              <br />
              {order.customer.city},{" "}
              {order.customer.pincode}
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default OrderDetails;