import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;
    const resetToken = location.state?.resetToken;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!resetToken) {
            setError(
                "Reset session expired. Please request a new OTP."
            );
            return;
        }

        if (!password) {
            setError("Please enter your new password");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters"
            );
            return;
        }

        if (!confirmPassword) {
            setError(
                "Please confirm your password"
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match"
            );
            return;
        }

        try {
            setLoading(true);

            console.log("RESET PASSWORD REQUEST");
            console.log("EMAIL:", email);

            const response = await API.post(
                `/user/reset-password/${resetToken}`,
                {
                    password: password
                }
            );

            console.log(
                "RESET PASSWORD RESPONSE:",
                response.data
            );

            if (response.data.success) {

                setSuccess(
                    "Password reset successfully!"
                );

                setPassword("");
                setConfirmPassword("");



                setTimeout(() => {
                    navigate("/login");
                }, 1500);

            } else {

                setError(
                    response.data.message ||
                    "Unable to reset password"
                );
            }

        } catch (error) {

            console.error(
                "RESET PASSWORD ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Password reset failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f5f5",
                padding: "20px"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "440px",
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow:
                        "0 5px 20px rgba(0,0,0,0.15)"
                }}
            >

                {/* HEADER */}

                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "10px"
                    }}
                >
                    Reset Password
                </h2>

                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: "25px"
                    }}
                >
                    Create a new password
                </p>


                {email && (
                    <p
                        style={{
                            textAlign: "center",
                            fontWeight: "600",
                            marginBottom: "20px"
                        }}
                    >
                        {email}
                    </p>
                )}


                {error && (
                    <div
                        style={{
                            color: "#dc3545",
                            background: "#f8d7da",
                            padding: "10px",
                            borderRadius: "6px",
                            marginBottom: "15px",
                            textAlign: "center"
                        }}
                    >
                        {error}
                    </div>
                )}


                {success && (
                    <div
                        style={{
                            color: "#198754",
                            background: "#d1e7dd",
                            padding: "10px",
                            borderRadius: "6px",
                            marginBottom: "15px",
                            textAlign: "center"
                        }}
                    >
                        {success}
                    </div>
                )}


                <form onSubmit={handleResetPassword}>

                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontWeight: "600"
                            }}
                        >
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            autoComplete="new-password"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                boxSizing: "border-box",
                                fontSize: "15px"
                            }}
                        />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                marginBottom: "7px",
                                fontWeight: "600"
                            }}
                        >
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(
                                    e.target.value
                                );
                                setError("");
                            }}
                            autoComplete="new-password"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                boxSizing: "border-box",
                                fontSize: "15px"
                            }}
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading || !resetToken}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#ff3f6c",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor:
                                loading || !resetToken
                                    ? "not-allowed"
                                    : "pointer",
                            fontSize: "16px",
                            fontWeight: "600",
                            opacity:
                                loading || !resetToken
                                    ? 0.6
                                    : 1
                        }}
                    >
                        {loading
                            ? "RESETTING..."
                            : "RESET PASSWORD"
                        }
                    </button>

                </form>


                {/* LOGIN */}

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        style={{
                            border: "none",
                            background: "transparent",
                            color: "#dc3545",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        ← Back to Login
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;