import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminOrders() {
  const navigate = useNavigate();

  const { user, isLoggedIn } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // ==========================================
  // CHECK ADMIN + LOAD ORDERS
  // ==========================================

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }

    fetchOrders();
  }, [isLoggedIn, user]);

  // ==========================================
  // GET ALL ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // api.js already sends JWT token automatically
      const response = await API.get("/orders/admin");

      console.log("Admin Orders Response:", response.data);

      const receivedOrders = Array.isArray(response.data)
        ? response.data
        : response.data?.orders || [];

      setOrders(receivedOrders);
    } catch (error) {
      console.error("Admin Orders Error:", error);

      setOrders([]);

      setError(
        error.response?.data?.message ||
          "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);
      setError("");

      const response = await API.put(
        `/orders/admin/${orderId}/status`,
        {
          status,
        }
      );

      console.log("Status Update Response:", response.data);

      const updatedOrder = response.data?.order;

      if (updatedOrder) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId
              ? updatedOrder
              : order
          )
        );
      } else {
        // If backend doesn't return updated order,
        // reload the orders.
        await fetchOrders();
      }
    } catch (error) {
      console.error("Status Update Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // ==========================================
  // ACCESS DENIED
  // ==========================================

  if (!isLoggedIn || user?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl">
            🔒
          </div>

          <h1 className="mt-6 text-2xl font-black text-gray-900">
            Access Denied
          </h1>

          <p className="mt-2 text-gray-500">
            Admin access is required to manage orders.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Go Home
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Admin Panel
            </p>

            <h1 className="mt-1 text-3xl font-black text-gray-900">
              Manage Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View customer orders and manage their delivery status.
            </p>

          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "↻ Refresh Orders"}
          </button>

        </div>

      </div>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="font-bold text-red-700">
                Unable to load orders
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (
          <div className="space-y-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >

                <div className="animate-pulse border-b p-6">

                  <div className="h-4 w-32 rounded bg-gray-200" />

                  <div className="mt-3 h-5 w-64 rounded bg-gray-200" />

                  <div className="mt-3 h-4 w-40 rounded bg-gray-100" />

                </div>

                <div className="grid gap-8 p-6 lg:grid-cols-3">

                  <div className="space-y-3">
                    <div className="h-3 w-24 rounded bg-gray-100" />
                    <div className="h-5 w-36 rounded bg-gray-200" />
                    <div className="h-4 w-40 rounded bg-gray-100" />
                    <div className="h-10 w-full rounded bg-gray-100" />
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 w-24 rounded bg-gray-100" />
                    <div className="h-14 rounded bg-gray-100" />
                    <div className="h-14 rounded bg-gray-100" />
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 w-24 rounded bg-gray-100" />
                    <div className="h-5 w-full rounded bg-gray-100" />
                    <div className="h-5 w-full rounded bg-gray-100" />
                    <div className="h-8 w-full rounded bg-gray-200" />
                  </div>

                </div>

              </div>
            ))}

          </div>
        ) : orders.length === 0 ? (

          /* ==========================================
              NO ORDERS
          ========================================== */

          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
              📦
            </div>

            <h2 className="mt-6 text-2xl font-black text-gray-900">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Customer orders will appear here once users place an order.
            </p>

            <button
              onClick={fetchOrders}
              className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-bold text-white transition hover:bg-blue-600"
            >
              Refresh
            </button>

          </div>

        ) : (

          /* ==========================================
              ORDERS
          ========================================== */

          <div className="space-y-6">

            {orders.map((order) => {

              const customer = order.customer || {};
              const items = order.items || [];

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >

                  {/* ==========================================
                      ORDER HEADER
                  ========================================== */}

                  <div className="flex flex-col gap-5 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Order ID
                      </p>

                      <p className="mt-1 break-all font-black text-gray-900">
                        #{order._id}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>

                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                      {/* CURRENT STATUS */}

                      <span
                        className={`rounded-full border px-4 py-2 text-center text-sm font-bold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>

                      {/* STATUS SELECT */}

                      <select
                        value={order.status || "Pending"}
                        disabled={
                          updatingOrder === order._id
                        }
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </div>

                  </div>

                  {/* ==========================================
                      ORDER BODY
                  ========================================== */}

                  <div className="grid gap-8 p-6 lg:grid-cols-3">

                    {/* ==========================================
                        CUSTOMER
                    ========================================== */}

                    <div>

                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Customer Details
                      </h3>

                      <div className="mt-4 rounded-2xl bg-gray-50 p-4">

                        <p className="font-black text-gray-900">
                          {customer.name || "Customer"}
                        </p>

                        {customer.phone && (
                          <p className="mt-2 text-sm text-gray-600">
                            📞 {customer.phone}
                          </p>
                        )}

                        <div className="mt-3 text-sm leading-6 text-gray-600">

                          {customer.address && (
                            <p>
                              📍 {customer.address}
                            </p>
                          )}

                          {(customer.city ||
                            customer.pincode) && (
                            <p>
                              {customer.city || ""}
                              {customer.city &&
                              customer.pincode
                                ? ", "
                                : ""}
                              {customer.pincode || ""}
                            </p>
                          )}

                        </div>

                      </div>

                    </div>

                    {/* ==========================================
                        PRODUCTS
                    ========================================== */}

                    <div>

                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Ordered Products
                      </h3>

                      <div className="mt-4 space-y-4">

                        {items.length === 0 ? (

                          <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                            No product details available.
                          </p>

                        ) : (

                          items.map((item, index) => (

                            <div
                              key={`${order._id}-${index}`}
                              className="flex items-center gap-3"
                            >

                              {/* IMAGE */}

                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name || "Product"}
                                    className="h-full w-full object-contain p-1"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-xl">
                                    👓
                                  </div>
                                )}

                              </div>

                              {/* INFO */}

                              <div className="min-w-0 flex-1">

                                <p className="truncate text-sm font-bold text-gray-900">
                                  {item.name ||
                                    "Product"}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  ₹{item.price || 0} ×{" "}
                                  {item.quantity || 0}
                                </p>

                              </div>

                              {/* ITEM TOTAL */}

                              <p className="shrink-0 text-sm font-black text-gray-900">
                                ₹
                                {(item.price || 0) *
                                  (item.quantity || 0)}
                              </p>

                            </div>

                          ))

                        )}

                      </div>

                    </div>

                    {/* ==========================================
                        ORDER SUMMARY
                    ========================================== */}

                    <div>

                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Order Summary
                      </h3>

                      <div className="mt-4 rounded-2xl bg-gray-50 p-4">

                        <div className="space-y-3">

                          <div className="flex justify-between text-sm text-gray-600">

                            <span>
                              Subtotal
                            </span>

                            <span className="font-semibold text-gray-900">
                              ₹{order.subtotal || 0}
                            </span>

                          </div>

                          <div className="flex justify-between text-sm text-gray-600">

                            <span>
                              Delivery
                            </span>

                            <span className="font-semibold text-green-600">
                              {order.delivery === 0 ||
                              order.delivery ===
                                undefined
                                ? "FREE"
                                : `₹${order.delivery}`}
                            </span>

                          </div>

                          <div className="border-t border-gray-200 pt-3">

                            <div className="flex justify-between">

                              <span className="text-base font-black text-gray-900">
                                Total
                              </span>

                              <span className="text-xl font-black text-gray-900">
                                ₹{order.total || 0}
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* PAYMENT */}

                        <div className="mt-5 border-t border-gray-200 pt-4">

                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            Payment Method
                          </p>

                          <p className="mt-2 font-bold text-gray-700">
                            💵{" "}
                            {order.paymentMethod ===
                            "COD"
                              ? "Cash on Delivery"
                              : order.paymentMethod ||
                                "Cash on Delivery"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </main>
  );
}

export default AdminOrders;