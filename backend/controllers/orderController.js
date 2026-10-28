const Order = require("../models/Order");
const Product = require("../models/Product");

// ==========================================
// CREATE ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      paymentMethod = "COD",
    } = req.body;

    if (!req.user) {
      return res.status(401).json({
        message: "Please login before placing an order.",
      });
    }

    if (!customer) {
      return res.status(400).json({
        message: "Customer details are required.",
      });
    }

    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.pincode
    ) {
      return res.status(400).json({
        message: "All customer details are required.",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty.",
      });
    }

    if (paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Only Cash on Delivery is available.",
      });
    }

    const orderItems = [];
    let subtotal = 0;

    // ==========================================
    // CHECK PRODUCTS + STOCK
    // ==========================================

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          message: "Invalid product quantity.",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock.`,
        });
      }

      const price = Number(product.price);

      subtotal += price * quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price,
        quantity,
        image: product.image,
      });
    }

    const delivery = 0;
    const total = subtotal + delivery;

    // ==========================================
    // CREATE ORDER
    // ==========================================

    const order = await Order.create({
      user: req.user.id,

      customer,

      items: orderItems,

      subtotal,

      delivery,

      total,

      paymentMethod,

      status: "Pending",
    });

    // ==========================================
    // REDUCE STOCK
    // ==========================================

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -Number(item.quantity),
          },
        }
      );
    }

    res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      message: "Failed to place order.",
      error: error.message,
    });
  }
};

// ==========================================
// GET LOGGED-IN USER ORDERS
// ==========================================

const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Please login to view your orders.",
      });
    }

    const orders = await Order.find({
      user: req.user.id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    res.json(orders);
  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(500).json({
      message: "Failed to load your orders.",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE USER ORDER
// ==========================================

const getMyOrderById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Please login to view this order.",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      message: "Failed to load order.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - GET ALL ORDERS
// ==========================================

const getAdminOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Please login.",
      });
    }

    const orders = await Order.find({})
      .sort({
        createdAt: -1,
      })
      .lean();

    res.json({
      orders,
    });
  } catch (error) {
    console.error("Get Admin Orders Error:", error);

    res.status(500).json({
      message: "Failed to load orders.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        message: "Order status is required.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    order.status = status;

    await order.save();

    res.json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      message: "Failed to update order status.",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAdminOrders,
  updateOrderStatus,
};