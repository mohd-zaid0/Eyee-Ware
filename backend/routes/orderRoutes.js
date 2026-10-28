const express = require("express");

const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAdminOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CUSTOMER
// ==========================================

// Create order
router.post(
  "/",
  protect,
  createOrder
);

// My orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Single my order
router.get(
  "/my-orders/:id",
  protect,
  getMyOrderById
);


// ==========================================
// ADMIN
// ==========================================

// Get all orders
router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminOrders
);

// Update order status
router.put(
  "/admin/:orderId/status",
  protect,
  adminOnly,
  updateOrderStatus
);

module.exports = router;