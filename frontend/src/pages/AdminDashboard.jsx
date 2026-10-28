import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const { user, isLoggedIn, logout } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  // ================= FETCH ADMIN STATS =================

  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      getAdminStats();
    }
  }, [isLoggedIn, user]);

  const getAdminStats = async () => {
    try {
      setLoadingStats(true);

      const response = await API.get("/admin/stats");

      console.log("Admin Stats:", response.data);

      setStats({
        totalProducts: response.data.totalProducts || 0,
        totalOrders: response.data.totalOrders || 0,
        pendingOrders: response.data.pendingOrders || 0,
        revenue: response.data.revenue || 0,
      });
    } catch (error) {
      console.error("Admin Stats Error:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }
    } finally {
      setLoadingStats(false);
    }
  };

  // ================= ADMIN PROTECTION =================

  if (!isLoggedIn || user?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">

          <div className="text-6xl">
            🔒
          </div>

          <h1 className="mt-5 text-2xl font-black text-gray-900">
            Access Denied
          </h1>

          <p className="mt-2 text-gray-500">
            Admin access is required.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Go Home
          </button>

        </div>
      </div>
    );
  }

  // ================= LOGOUT =================

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <main className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-left"
          >
            <h1 className="text-xl font-black text-gray-900">
              Eye
              <span className="text-blue-600">
                eWear
              </span>

              <span className="ml-2 text-sm font-medium text-gray-400">
                Admin
              </span>
            </h1>
          </button>

          <div className="flex items-center gap-4">

            <div className="hidden items-center gap-2 sm:flex">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <span className="max-w-[160px] truncate text-sm font-semibold text-gray-700">
                Hi, {user?.name}
              </span>

            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* TITLE */}

        <div>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Admin Panel
          </p>

          <h2 className="mt-2 text-3xl font-black text-gray-900">
            Dashboard
          </h2>

          <p className="mt-2 text-gray-500">
            Manage your EyeeWear store from one place.
          </p>

        </div>

        {/* ================= STATS ================= */}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL PRODUCTS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                👓
              </div>

            </div>

            <p className="mt-4 text-3xl font-black text-gray-900">

              {loadingStats ? "..." : stats.totalProducts}

            </p>

            <p className="mt-1 text-xs text-gray-400">
              Products in your store
            </p>

          </div>

          {/* TOTAL ORDERS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Total Orders
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl">
                📦
              </div>

            </div>

            <p className="mt-4 text-3xl font-black text-gray-900">

              {loadingStats ? "..." : stats.totalOrders}

            </p>

            <p className="mt-1 text-xs text-gray-400">
              Customer orders
            </p>

          </div>

          {/* PENDING ORDERS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Pending Orders
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-xl">
                ⏳
              </div>

            </div>

            <p className="mt-4 text-3xl font-black text-gray-900">

              {loadingStats ? "..." : stats.pendingOrders}

            </p>

            <p className="mt-1 text-xs text-gray-400">
              Orders waiting for action
            </p>

          </div>

          {/* REVENUE */}

          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-gray-500">
                Revenue
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-xl">
                ₹
              </div>

            </div>

            <p className="mt-4 text-3xl font-black text-gray-900">

              {loadingStats
                ? "..."
                : `₹${stats.revenue.toLocaleString("en-IN")}`}

            </p>

            <p className="mt-1 text-xs text-gray-400">
              Total store revenue
            </p>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-8">

          <h3 className="text-xl font-black text-gray-900">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store operations.
          </p>

        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-2">

          {/* PRODUCTS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                👓
              </div>

              <div>

                <h3 className="font-bold text-gray-900">
                  Products
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add and manage eyewear products.
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/admin/products")}
              className="mt-6 w-full rounded-xl bg-gray-900 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Manage Products →
            </button>

          </div>

          {/* ORDERS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl">
                📦
              </div>

              <div>

                <h3 className="font-bold text-gray-900">
                  Orders
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  View and manage customer orders.
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/admin/orders")}
              className="mt-6 w-full rounded-xl bg-gray-900 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Manage Orders →
            </button>

          </div>

        </div>

        {/* STORE INFO */}

        <div className="mt-8 rounded-2xl bg-gray-900 p-6 text-white">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>

              <p className="text-sm font-semibold text-blue-400">
                EYEeWEAR ADMIN
              </p>

              <h3 className="mt-1 text-xl font-black">
                Welcome to your store dashboard.
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Manage products and customer orders from here.
              </p>

            </div>

            <button
             onClick={() => navigate("/products")}
             className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-blue-500 hover:text-white"
            >
              View Store →
            </button>
              

          </div>

        </div>

      </div>

    </main>
  );
}

export default AdminDashboard;