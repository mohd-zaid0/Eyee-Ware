import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function MyOrders() {
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statuses = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    getOrders();
  }, [isLoggedIn, navigate]);

  const getOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/orders/my-orders");

      setOrders(response.data);
    } catch (error) {
      console.error("My Orders Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    return statuses.indexOf(status);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">

        <div className="mx-auto max-w-5xl">

          <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />

          <div className="mt-3 h-5 w-72 animate-pulse rounded bg-gray-100" />

          <div className="mt-8 space-y-6">

            {[1, 2].map((item) => (
              <div
                key={item}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >

                <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

                <div className="mt-5 h-20 animate-pulse rounded-xl bg-gray-100" />

                <div className="mt-6 h-16 animate-pulse rounded-xl bg-gray-100" />

              </div>
            ))}

          </div>

        </div>

      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">

        <div className="max-w-md text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
            !
          </div>

          <h1 className="mt-5 text-2xl font-black text-gray-900">
            Unable to Load Orders
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <button
            onClick={getOrders}
            className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  // =========================
  // EMPTY ORDERS
  // =========================

  if (orders.length === 0) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-6 py-20">

        <div className="mx-auto max-w-3xl text-center">

          <div className="text-7xl">
            📦
          </div>

          <h1 className="mt-6 text-3xl font-black text-gray-900">
            No Orders Yet
          </h1>

          <p className="mt-3 text-gray-500">
            You haven't placed any orders yet.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-7 rounded-xl bg-gray-900 px-7 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Start Shopping
          </button>

        </div>

      </main>
    );
  }

  // =========================
  // MAIN
  // =========================

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            My Account
          </p>

          <h1 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            Track and manage your eyewear orders.
          </p>

        </div>

        {/* ORDERS */}
        <div className="space-y-6">

          {orders.map((order) => {

            const currentStatusIndex =
              getStatusIndex(order.status);

            const isCancelled =
              order.status === "Cancelled";

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >

                {/* ORDER HEADER */}
                <div className="border-b border-gray-100 px-6 py-5">

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Order ID
                      </p>

                      <p className="mt-1 break-all font-bold text-gray-900">
                        #{order._id}
                      </p>

                    </div>

                    <div className="text-left sm:text-right">

                      <p className="text-xs text-gray-400">
                        Ordered on
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {formatDate(order.createdAt)}
                      </p>

                    </div>

                  </div>

                </div>

                {/* PRODUCTS */}
                <div className="px-6 py-5">

                  <div className="space-y-4">

                    {order.items.map((item, index) => (
                      <div
                        key={`${item.productId}-${index}`}
                        className="flex items-center gap-4"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-xl bg-gray-100 object-contain p-2"
                        />

                        <div className="min-w-0 flex-1">

                          <h3 className="truncate font-bold text-gray-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-700">
                            ₹{item.price} each
                          </p>

                        </div>

                        <p className="font-bold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>

                      </div>
                    ))}

                  </div>

                </div>

                {/* STATUS */}
                <div className="border-t border-gray-100 px-6 py-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm font-bold text-gray-900">
                        Order Status
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          isCancelled
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {order.status}
                      </p>

                    </div>

                    <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                      {order.paymentMethod}
                    </div>

                  </div>

                  {/* CANCELLED */}
                  {isCancelled ? (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                          ❌
                        </div>

                        <div>

                          <p className="font-bold text-red-700">
                            Order Cancelled
                          </p>

                          <p className="mt-1 text-sm text-red-600">
                            This order has been cancelled.
                          </p>

                        </div>

                      </div>

                    </div>
                  ) : (
                    /* STATUS TIMELINE */
                    <div className="mt-7">

                      <div className="flex items-start">

                        {statuses.map((status, index) => {

                          const completed =
                            index <= currentStatusIndex;

                          const active =
                            index === currentStatusIndex;

                          return (
                            <div
                              key={status}
                              className="flex flex-1 items-start"
                            >

                              <div className="flex flex-col items-center">

                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                                    completed
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 text-gray-400"
                                  } ${
                                    active
                                      ? "ring-4 ring-blue-100"
                                      : ""
                                  }`}
                                >
                                  {completed
                                    ? "✓"
                                    : index + 1}
                                </div>

                                <p
                                  className={`mt-2 text-center text-[11px] font-semibold sm:text-xs ${
                                    completed
                                      ? "text-gray-900"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {status}
                                </p>

                              </div>

                              {index <
                                statuses.length - 1 && (
                                <div
                                  className={`mt-4 h-1 flex-1 rounded-full ${
                                    index <
                                    currentStatusIndex
                                      ? "bg-blue-600"
                                      : "bg-gray-100"
                                  }`}
                                />
                              )}

                            </div>
                          );
                        })}

                      </div>

                    </div>
                  )}

                </div>

                {/* FOOTER */}
                <div className="flex flex-col justify-between gap-4 border-t border-gray-100 bg-gray-50 px-6 py-5 sm:flex-row sm:items-center">

                  <div>

                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>

                    <p className="text-xl font-black text-gray-900">
                      ₹{order.total}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      navigate(`/orders/${order._id}`)
                    }
                    className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                  >
                    View Order Details →
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </main>
  );
}

export default MyOrders;