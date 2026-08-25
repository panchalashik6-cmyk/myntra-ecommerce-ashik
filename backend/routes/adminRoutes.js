const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getStats } = require("../controller/adminController");
const { getMyOrders } = require("../controller/orderController");
const Order = require("../model/OrderModel");

const router = express.Router();
router.use(authMiddleware, adminMiddleware);
router.get("/stats", getStats);
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
        res.json({ success: true, count: orders.length, orders });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});
router.patch("/orders/:id/status", async (req, res) => {
    try {
        const allowed = ["Payment Pending", "Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
        if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid status" });
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, message: "Order status updated", order });
    } catch (error) { res.status(400).json({ success: false, message: error.message }); }
});
module.exports = router;
