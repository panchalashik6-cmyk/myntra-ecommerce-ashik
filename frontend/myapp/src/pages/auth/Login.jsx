import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../../services/api";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {

      setLoading(true);

      const response = await API.post(
        "/user/login",
        {
          email,
          password
        }
      );

      if (response.data.success) {

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        localStorage.setItem(
          "isLogin",
          "true"
        );

        // Home page
        navigate("/");

      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="auth-page">

      <div className="container">

        <div className="row justify-content-center align-items-center min-vh-100">

          <div className="col-12 col-sm-10 col-md-7 col-lg-5">

            <div className="card auth-card shadow border-0">

              <div className="card-body p-4 p-md-5">

                <div className="text-center mb-4">

                  <h1 className="brand-name">
                    MYNTRA
                  </h1>

                  <h4 className="mt-3">
                    Login
                  </h4>

                  <p className="text-muted">
                    Login to continue shopping
                  </p>

                </div>

              {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}


                <form onSubmit={handleLogin}>

                  {/* Email */}

                  <div className="mb-3">

                    <label className="form-label">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
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

                    <div className="input-group">

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >

                        {showPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}

                      </button>

                    </div>

                  </div>

                  <div className="text-end mb-3">

                    <Link
                      to="/forgot-password"
                      className="forgot-link"
                    >
                      Forgot Password?
                    </Link>

                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100 py-2"
                    disabled={loading}
                  >

                    {loading
                      ? "LOGGING IN..."
                      : "LOGIN"
                    }

                  </button>

                </form>


                <div className="text-center mt-4">

                  <span className="text-muted">
                    Don't have an account?
                  </span>

                  {" "}

                  <Link
                    to="/signup"
                    className="signup-link"
                  >
                    Create Account
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;