const User = require("../model/UserModel");
const Product = require("../model/ProductModel");
const Order = require("../model/OrderModel");

const getStats = async (req, res) => {
    try {
        const [users, products, orders, revenue] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([{ $match: { status: { $ne: "Cancelled" }, $or: [{ paymentMethod: "COD" }, { paymentStatus: "paid" }] } }, { $group: { _id: null, total: { $sum: "$total" } } }])
        ]);
        res.json({ success: true, stats: { users, products, orders, revenue: revenue[0]?.total || 0 } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getStats };
