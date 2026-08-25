import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingBag,
  FaBars,
  FaTimes
} from "react-icons/fa";
import API from "../../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const updateCount = async () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const total = cart.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    setCartCount(total);

    try {
      const response = await API.get("/user/wishlist");
      setWishCount(response.data.count || 0);
    } catch {
      setWishCount(0);
    }
  };

  useEffect(() => {
    setMenu(false);
    updateCount();
  }, [location.pathname]);


  useEffect(() => {
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("wishlist-updated", updateCount);

    return () => {
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("wishlist-updated", updateCount);
    };
  }, []);


  const searchProduct = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
    }
  };

 
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");

    navigate("/login");
  };

  return (
    <header className="myntra-header">

    
      <div className="top-strip">
        BIG FASHION FESTIVAL · FREE SHIPPING ON ORDERS ABOVE ₹999 ·
        EASY 7-DAY RETURNS
      </div>

      <nav className="main-nav">
        <div className="nav-inner container-fluid">

        
          <button
            className="mobile-menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <FaTimes /> : <FaBars />}
          </button>

 
          <Link to="/" className="myntra-logo">
            MYNTRA
          </Link>

     
          <div className={`nav-links ${menu ? "show" : ""}`}>

            <Link
              className={location.pathname === "/men" ? "active" : ""}
              to="/men"
            >
              MEN
            </Link>

            <Link
              className={location.pathname === "/women" ? "active" : ""}
              to="/women"
            >
              WOMEN
            </Link>

            <Link
              className={location.pathname === "/kids" ? "active" : ""}
              to="/kids"
            >
              KIDS
            </Link>

            <Link
              className={
                location.pathname === "/home-living" ? "active" : ""
              }
              to="/home-living"
            >
              HOME & LIVING
            </Link>

            <Link
              className={location.pathname === "/beauty" ? "active" : ""}
              to="/beauty"
            >
              BEAUTY
            </Link>

          </div>

    
          <form className="search-box" onSubmit={searchProduct}>
            <FaSearch />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products, brands and more"
            />
          </form>

          <div className="nav-actions">

            <button onClick={() => navigate("/profile")}>
              <FaUser />
              <span>Profile</span>
            </button>

     
            <button onClick={() => navigate("/wishlist")}>
              <span className="icon-wrap">
                <FaHeart />

                {wishCount > 0 && (
                  <b>{wishCount}</b>
                )}
              </span>

              <span>Wishlist</span>
            </button>

            <button onClick={() => navigate("/cart")}>
              <span className="icon-wrap">
                <FaShoppingBag />

                {cartCount > 0 && (
                  <b>{cartCount}</b>
                )}
              </span>

              <span>Bag</span>
            </button>

          </div>

          {user?.role === "admin" && (
            <button
              className="admin-mini"
              onClick={() => navigate("/admin")}
            >
              ADMIN
            </button>
          )}
          <button
            className="logout-mini"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      </nav>
    </header>
  );
}

export default Navbar;