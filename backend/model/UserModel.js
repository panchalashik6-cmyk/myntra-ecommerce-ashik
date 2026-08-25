const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        phone: { type: String, default: "" },
        gender: { type: String, default: "" },
        city: { type: String, default: "" },
        bio: { type: String, default: "" },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
