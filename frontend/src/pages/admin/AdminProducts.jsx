import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    category: "Eyeglasses",
    image: "",
    stock: "",
    frameType: "",
    color: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // ========================================
  // GET PRODUCTS
  // ========================================

  const getProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data);
    } catch (error) {
      console.error("Products Error:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        navigate("/admin/login");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load products."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ========================================
  // OPEN ADD FORM
  // ========================================

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowForm(true);

    setError("");
    setSuccess("");
  };

  // ========================================
  // OPEN EDIT FORM
  // ========================================

  const openEditForm = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "Eyeglasses",
      image: product.image || "",
      stock: product.stock ?? "",
      frameType: product.frameType || "",
      color: product.color || "",
    });

    setShowForm(true);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // CLOSE FORM
  // ========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData(emptyForm);

    setError("");
  };

  // ========================================
  // ADD / UPDATE PRODUCT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      let response;

      if (editingProduct) {
        response = await API.put(
          `/admin/products/${editingProduct._id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await API.post(
          "/admin/products",
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setSuccess(
        response.data.message ||
          "Product saved successfully."
      );

      closeForm();

      await getProducts();
    } catch (error) {
      console.error("Product Save Error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while saving the product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================
  // DELETE PRODUCT
  // ========================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product._id);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await API.delete(
        `/admin/products/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        response.data.message ||
          "Product deleted successfully."
      );

      await getProducts();
    } catch (error) {
      console.error("Delete Product Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>

            <button
              onClick={() =>
                navigate("/admin/dashboard")
              }
              className="mb-3 text-sm font-semibold text-gray-500 transition hover:text-blue-600"
            >
              ← Back to Dashboard
            </button>

            <h1 className="text-3xl font-black text-gray-900">
              Products
            </h1>

            <p className="mt-2 text-gray-500">
              Add and manage your eyewear products.
            </p>

          </div>

          <button
            onClick={
              showForm ? closeForm : openAddForm
            }
            className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            {showForm
              ? "Close Form"
              : "+ Add Product"}
          </button>

        </div>

        {/* ========================================
            SUCCESS
        ======================================== */}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            ✓ {success}
          </div>
        )}

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* ========================================
            ADD / EDIT FORM
        ======================================== */}

        {showForm && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7">

              <h2 className="text-2xl font-black text-gray-900">
                {editingProduct
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingProduct
                  ? "Update the product information."
                  : "Enter the details of the new eyewear product."}
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* NAME + CATEGORY */}

              <div className="grid gap-6 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Classic Black Frame"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="Eyeglasses">
                      Eyeglasses
                    </option>

                    <option value="Sunglasses">
                      Sunglasses
                    </option>

                    <option value="Computer Glasses">
                      Computer Glasses
                    </option>
                  </select>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product..."
                  rows="4"
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

              </div>

              {/* PRICE + STOCK */}

              <div className="grid gap-6 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1299"
                    min="1"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="20"
                    min="0"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

              {/* IMAGE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Product Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

              </div>

              {/* FRAME + COLOR */}

              <div className="grid gap-6 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Frame Type
                  </label>

                  <input
                    type="text"
                    name="frameType"
                    value={formData.frameType}
                    onChange={handleChange}
                    placeholder="Full Rim"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Color
                  </label>

                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Black"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-gray-900 px-7 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {submitting
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ========================================
            PRODUCT LIST
        ======================================== */}

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="border-b border-gray-100 px-6 py-5">

            <h2 className="text-xl font-black text-gray-900">
              All Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {products.length} product
              {products.length !== 1 ? "s" : ""} in store
            </p>

          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">

              <div className="text-6xl">
                👓
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                No Products Yet
              </h3>

              <p className="mt-2 text-gray-500">
                Add your first eyewear product.
              </p>

            </div>
          ) : (
            <div className="divide-y">

              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col gap-5 p-6 transition hover:bg-gray-50 md:flex-row md:items-center"
                >

                  {/* IMAGE */}

                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-2"
                    />

                  </div>

                  {/* DETAILS */}

                  <div className="flex-1">

                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      {product.category}
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-gray-900">
                      {product.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {product.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm">

                      <span className="font-bold text-gray-900">
                        ₹{product.price}
                      </span>

                      <span className="text-gray-500">
                        Stock: {product.stock}
                      </span>

                      {product.color && (
                        <span className="text-gray-500">
                          Color: {product.color}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        openEditForm(product)
                      }
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(product)
                      }
                      disabled={
                        deletingId === product._id
                      }
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === product._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}

export default AdminProducts;