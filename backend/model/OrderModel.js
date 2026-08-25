const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                name: String,
                brand: String,
                image: String,
                price: Number,
                size: String,
                quantity: Number
            }
        ],

        shippingAddress: {
            name: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            },

            pincode: {
                type: String,
                required: true
            }
        },

        subtotal: {
            type: Number,
            required: true
        },

        shipping: {
            type: Number,
            default: 0
        },

        total: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Razorpay", "UPI"],
            default: "COD"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending"
        },

        razorpayOrderId: { type: String, default: "", index: true },
        razorpayPaymentId: { type: String, default: "" },
        razorpaySignature: { type: String, default: "" },

        status: {
            type: String,
            enum: [
                "Payment Pending",
                "Placed",
                "Confirmed",
                "Packed",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],
            default: "Placed"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);