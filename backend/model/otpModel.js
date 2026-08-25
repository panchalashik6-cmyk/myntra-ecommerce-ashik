const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: false
        },

        email: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: false
        },

        otp: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const otpModel = mongoose.model("OTP", otpSchema);

module.exports = otpModel;