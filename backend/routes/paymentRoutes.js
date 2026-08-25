const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createRazorpayOrder, verifyRazorpayPayment } = require("../controller/paymentController");

const router = express.Router();

router.post("/razorpay/order", authMiddleware, createRazorpayOrder);
router.post("/razorpay/verify", authMiddleware, verifyRazorpayPayment);

module.exports = router;
