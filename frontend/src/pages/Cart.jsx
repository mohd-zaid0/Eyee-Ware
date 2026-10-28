import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
    const navigate = useNavigate();

const { user } = useAuth();

if (user?.role === "admin") {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="text-center">

        <div className="text-6xl">
          🔒
        </div>

        <h1 className="mt-5 text-2xl font-black">
          Admin Shopping Disabled
        </h1>

        <p className="mt-2 text-gray-500">
          Admin accounts cannot place customer orders.
        </p>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
        >
          Back to Admin Dashboard
        </button>

      </div>
    </div>
  );
}

  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="text-7xl">🛒</div>

        <h1 className="mt-6 text-3xl font-bold">
          Your cart is empty
        </h1>

        <p className="mt-3 text-gray-500">
          Add some stylish eyewear to your cart.
        </p>

        <Link
          to="/products"
          className="mt-7 inline-block rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

      <h1 className="mb-8 text-3xl font-bold">
        Shopping Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="space-y-4 lg:col-span-2">

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-5 rounded-2xl bg-white p-5 shadow-sm"
            >

              <img
                src={item.image}
                alt={item.name}
                className="h-28 w-28 rounded-xl bg-gray-100 object-contain p-2"
              />

              <div className="flex-1">

                <p className="text-sm text-gray-400">
                  {item.category}
                </p>

                <h2 className="font-bold">
                  {item.name}
                </h2>

                <p className="mt-2 font-semibold">
                  ₹{item.price}
                </p>

                <div className="mt-3 flex items-center gap-3">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.quantity - 1
                      )
                    }
                    className="h-8 w-8 rounded-lg bg-gray-200"
                  >
                    −
                  </button>

                  <span className="font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.quantity + 1
                      )
                    }
                    className="h-8 w-8 rounded-lg bg-gray-200"
                  >
                    +
                  </button>

                </div>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-sm font-semibold text-red-500"
              >
                Remove
              </button>

            </div>
          ))}

        </div>

        {/* SUMMARY */}
        <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            Order Summary
          </h2>

          <div className="mt-6 flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>

          <div className="mt-3 flex justify-between text-gray-600">
            <span>Delivery</span>
            <span>FREE</span>
          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹{cartTotal}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block rounded-xl bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            Proceed to Checkout
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Cart;