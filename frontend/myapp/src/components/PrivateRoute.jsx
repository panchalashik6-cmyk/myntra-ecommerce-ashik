import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

    const token = localStorage.getItem("token");
    const isLogin = localStorage.getItem("isLogin");

    if (!token || isLogin !== "true") {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;