const Product = require("../models/Product");

// ========================================
// GET ALL PRODUCTS
// ========================================

const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
};

// ========================================
// ADD PRODUCT
// ========================================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      frameType,
      color,
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !image ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      image,
      stock: Number(stock),
      frameType,
      color,
    });

    res.status(201).json({
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product.",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      frameType,
      color,
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !image ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price: Number(price),
        category,
        image,
        stock: Number(stock),
        frameType,
        color,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product.",
      error: error.message,
    });
  }
};

// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product.",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};