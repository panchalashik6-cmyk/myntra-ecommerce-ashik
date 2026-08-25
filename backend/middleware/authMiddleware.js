const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "myntra-secret-key";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Bearer token required" });
        }
        const token = authHeader.split(" ")[1];
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
