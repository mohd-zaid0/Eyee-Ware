const express = require("express");

const {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminProductController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// GET ALL PRODUCTS
// ========================================

router.get(
  "/",
  protect,
  adminOnly,
  getAdminProducts
);

// ========================================
// ADD PRODUCT
// ========================================

router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

// ========================================
// UPDATE PRODUCT
// ========================================

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

// ========================================
// DELETE PRODUCT
// ========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

module.exports = router;