const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");

// ===============================
// CREATE ORDER
// ===============================
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            items,
            shippingAddress,
            paymentMethod
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }

        // Check products and calculate price from DB
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} has only ${product.stock} items left`
                });
            }

            subtotal += product.price * item.quantity;

            orderItems.push({
                productId: product._id,
                name: product.name,
                brand: product.brand,
                image: product.image,
                price: product.price,
                size: item.size,
                quantity: item.quantity
            });
        }

        const shipping = subtotal > 0 ? 50 : 0;
        const total = subtotal + shipping;

        // Create order
        const order = await Order.create({
            userId,
            items: orderItems,
            shippingAddress,
            subtotal,
            shipping,
            total,
            paymentMethod: paymentMethod || "COD"
        });

        // Reduce product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// GET MY ORDERS
// ===============================
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.user.id
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// GET SINGLE ORDER
// ===============================
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid order id"
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
};