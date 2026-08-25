const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const razorpayKeysConfigured =
    Boolean(process.env.RAZORPAY_KEY_ID) &&
    Boolean(process.env.RAZORPAY_KEY_SECRET);

if (!razorpayKeysConfigured) {
    console.warn(
        "WARNING: Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env"
    );
} else {
    console.log("Razorpay keys loaded successfully");
}

const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const orderRouter = require("./routes/orderRoutes");
const adminRouter = require("./routes/adminRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const paymentRouter = require("./routes/paymentRoutes");

const app = express();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Myntra Backend Server is Running"
    });
});


app.use("/user", userRouter);


app.use("/products", productRouter);

app.use("/orders", orderRouter);
app.use("/admin", adminRouter);
app.use("/categories", categoryRouter);
app.use("/payments", paymentRouter);


connectDB()
    .then(() => {

        app.listen(process.env.PORT || 8080, () => {

            console.log(
                "yehh server start"
            );

        });

    })
    .catch((error) => {

        console.error(
            "Database connection failed:",
            error.message
        );

    });