const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");

const getRazorpay = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error(
            "Razorpay keys missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env"
        );
    }

    return {
        keyId,
        keySecret,
        client: new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        })
    };
};

const validateAddress = (shippingAddress) => {
    const fields = ["name", "phone", "address", "city", "state", "pincode"];

    return fields.every((field) =>
        String(shippingAddress?.[field] || "").trim()
    );
};

const buildOrderItems = async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Cart is empty");
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await Product.findById(item.productId);

        if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
        }

        const quantity = Math.max(1, Number(item.quantity) || 1);

        if (product.stock < quantity) {
            throw new Error(
                `${product.name} has only ${product.stock} items left`
            );
        }

        subtotal += Number(product.price) * quantity;

        orderItems.push({
            productId: product._id,
            name: product.name,
            brand: product.brand,
            image: product.image,
            price: product.price,
            size: item.size || "",
            quantity
        });
    }

    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;

    return {
        orderItems,
        subtotal,
        shipping,
        total
    };
};

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================
const createRazorpayOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;

        if (!validateAddress(shippingAddress)) {
            return res.status(400).json({
                success: false,
                message: "Complete shipping address is required"
            });
        }

        const totals = await buildOrderItems(items);
        const { keyId, client } = getRazorpay();

        const receipt = `myntra_${Date.now()}_${String(req.user.id).slice(-6)}`;

        const razorpayOrder = await client.orders.create({
            amount: Math.round(totals.total * 100),
            currency: "INR",
            receipt,
            notes: {
                userId: String(req.user.id)
            }
        });

        // Order MongoDB me payment pending state me save hoga.
        // Stock payment verify hone ke baad hi reduce hoga.
        const order = await Order.create({
            userId: req.user.id,
            items: totals.orderItems,
            shippingAddress,
            subtotal: totals.subtotal,
            shipping: totals.shipping,
            total: totals.total,
            paymentMethod: "Razorpay",
            paymentStatus: "pending",
            razorpayOrderId: razorpayOrder.id,
            status: "Payment Pending"
        });

        return res.status(201).json({
            success: true,
            keyId,
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            order
        });
    } catch (error) {
        console.error("RAZORPAY CREATE ERROR:", error);

        return res.status(400).json({
            success: false,
            message: error.error?.description || error.message
        });
    }
};

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================
const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Incomplete Razorpay payment response"
            });
        }

        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id,
            userId: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Payment order not found"
            });
        }

        if (order.paymentStatus === "paid") {
            return res.json({
                success: true,
                message: "Payment already verified",
                order
            });
        }

        const { keySecret } = getRazorpay();

        const payload =
            `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(payload)
            .digest("hex");

        const valid =
            expectedSignature.length === razorpay_signature.length &&
            crypto.timingSafeEqual(
                Buffer.from(expectedSignature),
                Buffer.from(razorpay_signature)
            );

        if (!valid) {
            return res.status(400).json({
                success: false,
                message: "Payment signature verification failed"
            });
        }

        // Payment verified.
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.paymentStatus = "paid";
        order.status = "Placed";

        await order.save();

        // IMPORTANT:
        // Stock payment verification ke baad hi reduce hota hai.
        for (const item of order.items) {
            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: item.productId,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: {
                        stock: -item.quantity
                    }
                },
                {
                    new: true
                }
            );

            if (!updatedProduct) {
                console.error(
                    `Stock update failed for product ${item.productId}`
                );
            }
        }

        return res.json({
            success: true,
            message: "Payment verified and order placed",
            order
        });
    } catch (error) {
        console.error("RAZORPAY VERIFY ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment
};
