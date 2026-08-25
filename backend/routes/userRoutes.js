const express = require("express");

const {
    register,
    sendOTP,
    verifyOTP,
    login,
    verifytoken,

    forgotPassword,
    verifyForgotOTP,
    resetPassword,

    getProfile,
    updateProfile,
    getWishlist,
    addWishlist,
    removeWishlist,
    createAdmin

} = require("../controller/userControler");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/send-otp", sendOTP);

router.post("/verify-otp", verifyOTP);

router.post("/register", register);


router.post("/login", login);

router.get(
    "/home",
    verifytoken,
    (req, res) =>
        res.json({
            success: true,
            message: "Welcome to Home Page",
            user: req.user
        })
);


router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/verify-forgot-otp",
    verifyForgotOTP
);

router.post(
    "/reset-password/:token",
    resetPassword
);


router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


router.get(
    "/wishlist",
    authMiddleware,
    getWishlist
);

router.post(
    "/wishlist",
    authMiddleware,
    addWishlist
);

router.delete(
    "/wishlist/:productId",
    authMiddleware,
    removeWishlist
);


router.post(
    "/create-admin",
    createAdmin
);


module.exports = router;