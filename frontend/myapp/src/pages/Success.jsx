import React from "react";
import { Link } from "react-router-dom";

function Success() {
    const order = JSON.parse(
        localStorage.getItem("lastOrder") || "null"
    );

    const paymentMethod = order?.paymentMethod || "COD";
    const total = order?.total;

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "75vh" }}
        >
            <div
                className="card border-0 shadow text-center p-5"
                style={{ maxWidth: "600px", width: "100%" }}
            >
                <div
                    className="mx-auto mb-4 d-flex justify-content-center align-items-center"
                    style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "#28a745",
                        color: "white",
                        fontSize: "40px",
                        fontWeight: "bold"
                    }}
                >
                    ✓
                </div>

                <h1 className="fw-bold mb-3">
                    Order Placed Successfully!
                </h1>

                <p className="text-muted mb-4">
                    Thank you for shopping with MYNTRA.
                    Your order has been placed successfully.
                </p>

                {order && (
                    <div className="bg-light rounded p-3 mb-4">
                        <p className="mb-1 text-muted">
                            Order ID
                        </p>

                        <h6 className="fw-bold mb-0">
                            {order._id || "Order Placed"}
                        </h6>
                    </div>
                )}

                <div className="mb-4">
                    <p className="mb-1">
                        <strong>Payment Method:</strong>{" "}
                        {paymentMethod === "Razorpay"
                            ? "Online Payment (Razorpay)"
                            : "Cash on Delivery"}
                    </p>

                    {typeof total === "number" && (
                        <p className="mb-0">
                            <strong>Total:</strong> ₹{total}
                        </p>
                    )}

                    {order?.razorpayPaymentId && (
                        <p className="mb-0 mt-2 small text-muted">
                            Payment ID: {order.razorpayPaymentId}
                        </p>
                    )}
                </div>

                <div className="d-flex gap-3 justify-content-center">
                    <Link
                        to="/products"
                        className="btn btn-dark px-4"
                    >
                        Continue Shopping
                    </Link>

                    <Link
                        to="/"
                        className="btn btn-outline-dark px-4"
                    >
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Success;
