import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, isLoggedIn, logout } = useAuth();

  const { cartCount, clearCart } = useCart();

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    // Clear cart immediately
    clearCart();

    // Logout user
    logout();

    // Go home
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          className="text-2xl font-extrabold"
        >
          Eye<span className="text-blue-600">eWear</span>
        </Link>

        {/* ================= NAVIGATION ================= */}
        <div className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Eyeglasses
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Sunglasses
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Computer Glasses
          </Link>

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3">

          {isLoggedIn ? (
            <>
              {/* ================= USER ================= */}
              <div className="hidden items-center gap-2 sm:flex">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <span className="max-w-[120px] truncate text-sm font-semibold text-gray-700">
                  Hi, {user?.name}
                </span>

              </div>

              {/* ================= MY ORDERS - USER ONLY ================= */}
              {!isAdmin && (
                <Link
                  to="/orders"
                  className="hidden text-sm font-semibold text-gray-700 transition hover:text-blue-600 sm:block"
                >
                  My Orders
                </Link>
              )}

              {/* ================= LOGOUT ================= */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* ================= LOGIN ================= */}
              <Link
                to="/login"
                className="hidden text-sm font-semibold text-gray-700 transition hover:text-blue-600 sm:block"
              >
                Login
              </Link>

              {/* ================= REGISTER ================= */}
              <Link
                to="/register"
                className="hidden rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600 sm:block"
              >
                Register
              </Link>
            </>
          )}

          {/* ================= CART - NON ADMIN ONLY ================= */}
          {!isAdmin && (
            <Link
              to="/cart"
              className="relative rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              🛒 Cart

              {/* CART COUNT */}
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;