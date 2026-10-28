const Product = require("../models/Product");
const Order = require("../models/Order");

// ==========================================
// ADMIN STATISTICS
// ==========================================

const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: {
            $ne: "Cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$total",
          },
        },
      },
    ]);

    const revenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      revenue,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);

    res.status(500).json({
      message: "Failed to load admin statistics",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - GET ALL ORDERS
// ==========================================

const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      orders,
    });
  } catch (error) {
    console.error("Get Admin Orders Error:", error);

    res.status(500).json({
      message: "Failed to load orders",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getAdminOrders,
  updateOrderStatus,
};