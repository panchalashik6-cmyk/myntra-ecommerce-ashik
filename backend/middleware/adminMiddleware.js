const User = require("../model/UserModel");

const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: "Login required" });
        }

        const user = await User.findById(req.user.id).select("role username email");
        if (!user || user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin access required" });
        }

        req.admin = user;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = adminMiddleware;
