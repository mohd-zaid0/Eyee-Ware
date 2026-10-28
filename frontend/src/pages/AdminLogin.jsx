import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/login",
        formData
      );

      const loggedInUser = response.data.user;

      // IMPORTANT:
      // Only admin can enter admin panel
      if (loggedInUser.role !== "admin") {
        setError(
          "Access denied. Admin account required."
        );

        return;
      }

      login(
        loggedInUser,
        response.data.token
      );

      navigate("/admin/dashboard");

    } catch (error) {
      console.error("Admin Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Invalid admin email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">

      <div className="mx-auto flex min-h-[85vh] max-w-md items-center">

        <div className="w-full">

          {/* BRAND */}
          <div className="mb-8 text-center">

            <Link
              to="/"
              className="text-3xl font-black text-white"
            >
              Eye<span className="text-blue-500">eWear</span>
            </Link>

            <p className="mt-3 text-sm text-gray-400">
              Admin Control Panel
            </p>

          </div>

          {/* CARD */}
          <div className="rounded-3xl bg-white p-7 shadow-2xl sm:p-9">

            {/* ICON */}
            <div className="mb-6 flex justify-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                🔐
              </div>

            </div>

            <div className="text-center">

              <h1 className="text-2xl font-black text-gray-900">
                Admin Login
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to manage your EyeeWear store.
              </p>

            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >

              {/* EMAIL */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Admin Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@eyeewear.com"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gray-900 py-3.5 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "Signing In..."
                  : "Login to Admin Panel"}
              </button>

            </form>

            {/* BACK */}
            <div className="mt-7 border-t border-gray-100 pt-6 text-center">

              <Link
                to="/"
                className="text-sm font-semibold text-gray-500 transition hover:text-blue-600"
              >
                ← Back to EyeeWear
              </Link>

            </div>

          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            EyeeWear Admin Panel • Secure Access
          </p>

        </div>

      </div>

    </main>
  );
}

export default AdminLogin;