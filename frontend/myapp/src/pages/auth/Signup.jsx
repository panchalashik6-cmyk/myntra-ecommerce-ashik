import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

function Signup() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async (e) => {

        e.preventDefault();

        setError("");

        if (!username || !email || !password) {
            setError("All fields are required");
            return;
        }

        try {

            setLoading(true);

            const response = await API.post(
                "/user/send-otp",
                {
                    username,
                    email,
                    password
                }
            );

            if (response.data.success) {

                navigate("/verify-otp", {
                    state: {
                        email
                    }
                });

            }

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Something went wrong"
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

                    <h3>Create Account</h3>

                    <p className="text-muted">
                        Create your account to continue
                    </p>

                </div>


                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSignup}>

                    <div className="mb-3">

                        <label className="form-label">
                            Username
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        />

                    </div>


                    <div className="mb-3">

                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>


                    <div className="mb-3">

                        <label className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>


                    <button
                        type="submit"
                        className="btn btn-dark w-100"
                        disabled={loading}
                    >

                        {loading
                            ? "Sending OTP..."
                            : "SIGN UP"
                        }

                    </button>

                </form>


                <div className="text-center mt-4">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-danger fw-bold"
                    >
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Signup;