import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            setError("Please enter your email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);

            console.log("FORGOT PASSWORD REQUEST");
            console.log("EMAIL:", cleanEmail);

            const response = await API.post(
                "/user/forgot-password",
                {
                    email: cleanEmail
                }
            );

            console.log("FORGOT PASSWORD RESPONSE:", response.data);

            if (response.data.success) {
                setSuccess(
                    response.data.message ||
                    "OTP sent successfully to your email"
                );

                navigate("/verify-forgot-otp", {
                    state: {
                        email: cleanEmail
                    }
                });

            } else {
                setError(
                    response.data.message ||
                    "Unable to send OTP"
                );
            }

        } catch (error) {
            console.error(
                "FORGOT PASSWORD ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light"
        >

            <div
                className="card shadow border-0 p-4"
                style={{
                    width: "100%",
                    maxWidth: "450px"
                }}
            >

                <div className="text-center mb-4">

                    <h1
                        className="fw-bold"
                        style={{
                            color: "#ff3f6c"
                        }}
                    >
                        MYNTRA
                    </h1>

                    <h3 className="mt-3">
                        Forgot Password?
                    </h3>

                    <p className="text-muted">
                        Enter your registered email address
                    </p>

                </div>

                {error && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className="alert alert-success"
                        role="alert"
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={handleForgotPassword}>

                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Email Address
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                                setSuccess("");
                            }}
                            autoComplete="email"
                            disabled={loading}
                        />

                    </div>

                    <button
                        type="submit"
                        className="btn w-100 py-2"
                        disabled={loading}
                        style={{
                            backgroundColor: "#ff3f6c",
                            color: "#fff",
                            border: "none",
                            fontWeight: "600"
                        }}
                    >

                        {loading
                            ? "SENDING OTP..."
                            : "SEND OTP"
                        }

                    </button>

                </form>

                <div className="text-center mt-4">

                    <span className="text-muted">
                        Remember your password?
                    </span>

                    {" "}

                    <Link
                        to="/login"
                        className="text-danger fw-bold text-decoration-none"
                    >
                        Login
                    </Link>

                </div>

                <div className="text-center mt-3">

                    <Link
                        to="/login"
                        className="text-secondary text-decoration-none"
                    >
                        ← Back to Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;