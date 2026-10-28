import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  return (
    <main className="min-h-[80vh] bg-gray-50 px-6 py-16">

      <div className="mx-auto max-w-2xl">

        {/* SUCCESS CARD */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

          {/* TOP */}
          <div className="bg-blue-600 px-6 py-12 text-center sm:px-10">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl shadow-lg">
              ✓
            </div>

            <h1 className="mt-7 text-3xl font-black text-white sm:text-4xl">
              Order Placed Successfully!
            </h1>

            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Thank you for shopping with EyeeWear.
              Your order has been received successfully.
            </p>

          </div>

          {/* ORDER DETAILS */}
          <div className="p-6 sm:p-10">

            {order ? (
              <>

                <div className="mb-6">

                  <h2 className="text-xl font-black">
                    Order Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Keep your order ID for future reference.
                  </p>

                </div>

                <div className="space-y-4">

                  {/* ORDER ID */}
                  <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                    <span className="text-sm text-gray-500">
                      Order ID
                    </span>

                    <span className="break-all font-bold text-gray-900">
                      {order._id}
                    </span>

                  </div>

                  {/* TOTAL */}
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">

                    <span className="text-sm text-gray-500">
                      Total Amount
                    </span>

                    <span className="text-lg font-black">
                      ₹{order.total}
                    </span>

                  </div>

                  {/* PAYMENT */}
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">

                    <span className="text-sm text-gray-500">
                      Payment Method
                    </span>

                    <span className="font-bold">
                      Cash on Delivery
                    </span>

                  </div>

                  {/* STATUS */}
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">

                    <span className="text-sm text-gray-500">
                      Order Status
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold uppercase text-green-600">
                      {order.status}
                    </span>

                  </div>

                </div>

                {/* MESSAGE */}
                <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                  <p className="font-bold text-blue-900">
                    What's next?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-700">
                    We will prepare your order and deliver it to
                    your provided address. Please keep your phone
                    available for delivery updates.
                  </p>

                </div>

              </>
            ) : (
              <div className="text-center">

                <h2 className="text-2xl font-black">
                  Order placed successfully
                </h2>

                <p className="mt-3 text-gray-500">
                  Your order has been received.
                </p>

              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() => navigate("/products")}
                className="flex-1 rounded-xl bg-gray-900 py-3.5 font-bold text-white transition hover:bg-blue-600"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => navigate("/")}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3.5 font-bold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
              >
                Go Home
              </button>

            </div>

          </div>
        </div>

      </div>
    </main>
  );
}

export default OrderSuccess;