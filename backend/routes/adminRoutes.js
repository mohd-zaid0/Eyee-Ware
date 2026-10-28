const express = require("express");

const {
  getAdminStats,
  getAdminOrders,
  updateOrderStatus,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// ADMIN STATISTICS
// ==========================================

router.get(
  "/stats",
  protect,
  adminOnly,
  getAdminStats
);

// ==========================================
// ADMIN - GET ALL ORDERS
// ==========================================

router.get(
  "/orders",
  protect,
  adminOnly,
  getAdminOrders
);

// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================

router.put(
  "/orders/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

module.exports = router;