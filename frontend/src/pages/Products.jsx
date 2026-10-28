import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const { addToCart } = useCart();
  const { user } = useAuth();

  // Check if current user is admin
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/products");

      setProducts(response.data);
    } catch (error) {
      console.error("Products Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    "Eyeglasses",
    "Sunglasses",
    "Computer Glasses",
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH
    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchText) ||
          product.category?.toLowerCase().includes(searchText) ||
          product.description?.toLowerCase().includes(searchText)
      );
    }

    // CATEGORY
    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    // SORT
    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [products, search, category, sort]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12">
            <div className="h-10 w-56 animate-pulse rounded-lg bg-gray-200" />

            <div className="mt-4 h-5 w-80 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-60 animate-pulse bg-gray-100" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />

                  <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

                  <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />

                  <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-6">

        <div className="max-w-md text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-black text-red-500">
            !
          </div>

          <h1 className="mt-5 text-2xl font-black text-gray-900">
            Something went wrong
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <button
            onClick={getProducts}
            className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ================= MAIN =================

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================= ADMIN MODE ================= */}

      {isAdmin && (
        <div className="border-b border-blue-100 bg-blue-50">

          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">

            <div>
              <p className="text-sm font-bold text-blue-600">
                ADMIN MODE
              </p>

              <p className="mt-1 text-sm text-gray-600">
                You are viewing the customer store as an administrator.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              ← Back to Admin Dashboard
            </button>

          </div>
        </div>
      )}

      {/* ================= PAGE HEADER ================= */}

      <section className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Our Collection
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Find Your Perfect Frame
          </h1>

          <p className="mt-4 max-w-2xl text-gray-500">
            Explore our collection of stylish and comfortable
            eyewear designed for every occasion.
          </p>

        </div>
      </section>

      {/* ================= FILTERS ================= */}

      <section className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search eyewear..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* SORT */}

            <div className="flex flex-col gap-3 sm:flex-row">

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
              >
                <option value="default">
                  Sort: Default
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>

                <option value="name">
                  Name: A to Z
                </option>
              </select>

              {(search ||
                category !== "All" ||
                sort !== "default") && (
                <button
                  onClick={resetFilters}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                  Reset
                </button>
              )}

            </div>

          </div>

          {/* CATEGORIES */}

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">

            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  category === item
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

        </div>
      </section>

      {/* ================= PRODUCTS ================= */}

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* RESULT COUNT */}

        <div className="mb-6 flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </p>

        </div>

        {/* NO PRODUCTS */}

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              🔍
            </div>

            <h2 className="mt-5 text-2xl font-black text-gray-900">
              No products found
            </h2>

            <p className="mt-3 text-gray-500">
              Try another search or category.
            </p>

            <button
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Clear Filters
            </button>

          </div>
        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map((product) => {

              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* IMAGE */}

                  <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-100">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                    {/* STOCK BADGE */}

                    <div className="absolute left-3 top-3">

                      {isOutOfStock ? (
                        <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600">
                          Out of Stock
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-600">
                          Only {product.stock} left
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-600">
                          In Stock
                        </span>
                      )}

                    </div>

                  </div>

                  {/* INFO */}

                  <div className="p-5">

                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                      {product.category}
                    </p>

                    <h2 className="mt-2 line-clamp-1 text-lg font-black text-gray-900">
                      {product.name}
                    </h2>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                      {product.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">

                      <p className="text-xl font-black text-gray-900">
                        ₹{product.price}
                      </p>

                      {product.stock > 0 && (
                        <span className="text-xs font-medium text-gray-400">
                          {product.stock} available
                        </span>
                      )}

                    </div>

                    {/* ================= ADMIN ================= */}

                    {isAdmin ? (

                      <button
                        onClick={() =>
                          navigate("/admin/products")
                        }
                        className="mt-5 w-full rounded-xl border border-blue-200 bg-blue-50 py-3 font-bold text-blue-600 transition hover:bg-blue-100"
                      >
                        Manage Product
                      </button>

                    ) : (

                      /* ================= USER ================= */

                      <div className="mt-5 grid grid-cols-2 gap-3">

  <button
    onClick={() =>
      navigate(`/try-on?product=${product._id}`)
    }
    className="rounded-xl border border-blue-200 bg-blue-50 py-3 font-bold text-blue-600 transition hover:bg-blue-100"
  >
    👓 Try On
  </button>

  <button
    onClick={() => addToCart(product)}
    disabled={isOutOfStock}
    className={`rounded-xl py-3 font-bold transition ${
      isOutOfStock
        ? "cursor-not-allowed bg-gray-100 text-gray-400"
        : "bg-gray-900 text-white hover:bg-blue-600"
    }`}
  >
    {isOutOfStock
      ? "Out of Stock"
      : "Add to Cart"}
  </button>

</div>

                    )}

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </section>
    </main>
  );
}

export default Products;