import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// ================= AUTH PAGES =================
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyForgotOTP from "./pages/auth/VerifyForgotOTP";
import ResetPassword from "./pages/auth/ResetPassword";

// ================= MAIN PAGES =================
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";

// ================= ADMIN =================
import Admin from "./pages/admin/Admin";

// ================= COMPONENTS =================
import Navbar from "./components/Navbar/Navbar";
import PrivateRoute from "./components/PrivateRoute";


// ======================================================
// STORE LAYOUT
// ======================================================

function StoreLayout() {
    return (
        <>
            {/* NAVBAR */}
            <Navbar />

            {/* PAGE CONTENT */}
            <main className="site-main">
                <Outlet />
            </main>

            {/* FOOTER */}
            <footer className="site-footer">

                <div className="container py-5">

                    <div className="row g-4">

                        {/* ================= BRAND ================= */}

                        <div className="col-md-4">

                            <div className="footer-brand">
                                MYNTRA
                            </div>

                            <p>
                                Fashion, beauty and lifestyle for every mood.
                            </p>

                        </div>


                        {/* ================= ONLINE SHOPPING ================= */}

                        <div className="col-6 col-md-2">

                            <h6>
                                ONLINE SHOPPING
                            </h6>

                            <a href="/men">
                                Men
                            </a>

                            <a href="/women">
                                Women
                            </a>

                            <a href="/kids">
                                Kids
                            </a>

                            <a href="/beauty">
                                Beauty
                            </a>

                        </div>


                        {/* ================= USEFUL LINKS ================= */}

                        <div className="col-6 col-md-2">

                            <h6>
                                USEFUL LINKS
                            </h6>

                            <a href="/profile">
                                Profile
                            </a>

                            <a href="/orders">
                                Orders
                            </a>

                            <a href="/wishlist">
                                Wishlist
                            </a>

                            <a href="/cart">
                                Bag
                            </a>

                        </div>


                        {/* ================= SECURITY ================= */}

                        <div className="col-md-4">

                            <h6>
                                100% SECURE SHOPPING
                            </h6>

                            <p>
                                Easy returns · Secure payments · Genuine products
                            </p>

                        </div>

                    </div>


                    {/* ================= FOOTER BOTTOM ================= */}

                    <div className="footer-bottom">

                        © 2026 MYNTRA INSPIRED STORE · Built with React,
                        Node.js & MongoDB

                    </div>

                </div>

            </footer>
        </>
    );
}


// ======================================================
// APP
// ======================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ==================================================
                    AUTH ROUTES
                ================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                {/* SIGNUP OTP */}
                <Route
                    path="/verify-otp"
                    element={<VerifyOTP />}
                />

                {/* FORGOT PASSWORD */}
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                {/* FORGOT PASSWORD OTP */}
                <Route
                    path="/verify-forgot-otp"
                    element={<VerifyForgotOTP />}
                />

                {/* RESET PASSWORD */}
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* ==================================================
                    PRIVATE STORE ROUTES
                ================================================== */}

                <Route
                    element={
                        <PrivateRoute>
                            <StoreLayout />
                        </PrivateRoute>
                    }
                >

                    {/* ================= HOME ================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />


                    {/* ================= PRODUCTS ================= */}

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/men"
                        element={<Products />}
                    />

                    <Route
                        path="/women"
                        element={<Products />}
                    />

                    <Route
                        path="/kids"
                        element={<Products />}
                    />

                    <Route
                        path="/home-living"
                        element={<Products />}
                    />

                    <Route
                        path="/beauty"
                        element={<Products />}
                    />


                    {/* ================= PRODUCT DETAILS ================= */}

                    <Route
                        path="/product/:id"
                        element={<ProductDetails />}
                    />


                    {/* ================= CART ================= */}

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />


                    {/* ================= CHECKOUT ================= */}

                    <Route
                        path="/checkout"
                        element={<Checkout />}
                    />


                    {/* ================= SUCCESS ================= */}

                    <Route
                        path="/success"
                        element={<Success />}
                    />


                    {/* ================= WISHLIST ================= */}

                    <Route
                        path="/wishlist"
                        element={<Wishlist />}
                    />


                    {/* ================= PROFILE ================= */}

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />


                    {/* ================= ORDERS ================= */}

                    <Route
                        path="/orders"
                        element={<MyOrders />}
                    />


                    {/* ================= ADMIN ================= */}

                    <Route
                        path="/admin"
                        element={<Admin />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}


export default App;