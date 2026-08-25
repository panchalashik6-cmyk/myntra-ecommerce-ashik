import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

const VerifyForgotOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!email) {
            setError(
                "Email not found. Please try Forgot Password again."
            );
            return;
        }

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);

            console.log("================================");
            console.log("VERIFY FORGOT OTP");
            console.log("EMAIL:", email);
            console.log("OTP:", otp);

            const response = await API.post(
                "/user/verify-forgot-otp",
                {
                    email: email.trim().toLowerCase(),
                    otp: otp.trim()
                }
            );

            console.log(
                "VERIFY OTP RESPONSE:",
                response.data
            );

            if (response.data.success) {

                setMessage(
                    "OTP verified successfully!"
                );


                navigate("/reset-password", {
                    state: {
                        email: email.trim().toLowerCase(),
                        resetToken: response.data.resetToken
                    }
                });

            } else {

                setError(
                    response.data.message ||
                    "Invalid OTP"
                );
            }

        } catch (err) {

            console.error(
                "VERIFY FORGOT OTP ERROR:",
                err
            );

            console.error(
                "SERVER RESPONSE:",
                err.response?.data
            );

            setError(
                err.response?.data?.message ||
                "OTP verification failed. Please try again."
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


                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "10px"
                    }}
                >
                    Verify OTP
                </h2>


                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: "5px"
                    }}
                >
                    OTP sent to
                </p>


                <p
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        marginBottom: "25px"
                    }}
                >
                    {email || "Email not found"}
                </p>


                {!email && (
                    <p
                        style={{
                            color: "red",
                            textAlign: "center"
                        }}
                    >
                        Please go back and request OTP again.
                    </p>
                )}


                <form onSubmit={handleVerifyOTP}>

                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter 6 digit OTP"
                        value={otp}
                        onChange={(e) => {
                            const value =
                                e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6);

                            setOtp(value);
                            setError("");
                            setMessage("");
                        }}
                        maxLength="6"
                        autoComplete="one-time-code"
                        style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "18px",
                            textAlign: "center",
                            letterSpacing: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            boxSizing: "border-box",
                            outline: "none"
                        }}
                    />


                    <button
                        type="submit"
                        disabled={
                            loading ||
                            !email ||
                            otp.length !== 6
                        }
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "20px",
                            background: "#ff4141",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor:
                                loading ||
                                !email ||
                                otp.length !== 6
                                    ? "not-allowed"
                                    : "pointer",
                            fontSize: "16px",
                            fontWeight: "600",
                            opacity:
                                loading ||
                                !email ||
                                otp.length !== 6
                                    ? 0.6
                                    : 1
                        }}
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>

                </form>


                {message && (
                    <p
                        style={{
                            color: "green",
                            textAlign: "center",
                            marginTop: "15px"
                        }}
                    >
                        {message}
                    </p>
                )}


                {error && (
                    <p
                        style={{
                            color: "red",
                            textAlign: "center",
                            marginTop: "15px"
                        }}
                    >
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/forgot-password")
                    }
                    style={{
                        width: "100%",
                        marginTop: "15px",
                        padding: "10px",
                        background: "transparent",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "15px"
                    }}
                >
                    Back to Forgot Password
                </button>

            </div>

        </div>
    );
};

export default VerifyForgotOTP;