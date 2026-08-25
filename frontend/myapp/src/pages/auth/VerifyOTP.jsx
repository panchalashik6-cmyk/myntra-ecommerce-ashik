import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

function VerifyOTP() {

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVerifyOTP = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!otp) {
            setError("Please enter OTP");
            return;
        }

        try {

            setLoading(true);

            const response = await API.post(
                "/user/verify-otp",
                {
                    email,
                    otp
                }
            );

            if (response.data.success) {

                setSuccess("Signup successful! Please login.");

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Invalid OTP"
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">

            <div
                className="card shadow p-4"
                style={{
                    width: "100%",
                    maxWidth: "450px"
                }}
            >

                <div className="text-center mb-4">

                    <h1 className="fw-bold">
                        MYNTRA
                    </h1>

                    <h3>Verify Email</h3>

                    <p className="text-muted">
                        OTP sent to
                    </p>

                    <strong>
                        {email}
                    </strong>

                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleVerifyOTP}>

                    <div className="mb-3">

                        <label className="form-label">
                            Enter OTP
                        </label>

                        <input
                            type="text"
                            className="form-control text-center"
                            placeholder="Enter 6 digit OTP"
                            maxLength="6"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, ""))
                            }
                        />

                    </div>

                    <button
                        type="submit"
                        className="btn btn-dark w-100"
                        disabled={loading}
                    >

                        {loading
                            ? "Verifying..."
                            : "VERIFY OTP"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default VerifyOTP;