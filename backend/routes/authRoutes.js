const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ================= REGISTER =================

router.post("/register", registerUser);

// ================= LOGIN =================

router.post("/login", loginUser);

// ================= ADMIN DASHBOARD TEST =================

router.get(
  "/dashboard",
  protect,
  adminOnly,
  (req, res) => {
    res.json({
      message: "Welcome to EyeeWear Admin Dashboard",
      admin: req.user,
    });
  }
);

module.exports = router;