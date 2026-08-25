import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaShoppingBag
} from "react-icons/fa";
import API from "../services/api";

function ProductCard({ product, wishlistIds = [] }) {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(
    wishlistIds.includes(product._id)
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLiked(wishlistIds.includes(product._id));
  }, [wishlistIds, product._id]);


  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setSaving(true);

    try {
      if (liked) {
        await API.delete(`/user/wishlist/${product._id}`);
        setLiked(false);
      } else {
        await API.post("/user/wishlist", {
          productId: product._id
        });

        setLiked(true);
      }

      window.dispatchEvent(
        new Event("wishlist-updated")
      );

    } catch (error) {

      if (error.response?.status === 401) {
        navigate("/login");
      }

    } finally {
      setSaving(false);
    }
  };


  const openProduct = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <article className="product-card-new">


      <Link
        to={`/product/${product._id}`}
        className="product-link"
      >

        <div className="product-image-wrap">

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
          />

          <span className="discount-pill">
            {product.discount}% OFF
          </span>

          <button
            className={`wish-btn ${liked ? "liked" : ""}`}
            disabled={saving}
            onClick={toggleWishlist}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>

        </div>

        <div className="product-info">

          <h3>{product.brand}</h3>

          <p>{product.name}</p>

          <div className="price-row">

            <strong>
              ₹{product.price}
            </strong>

            <del>
              ₹{product.oldPrice}
            </del>

            <span>
              {product.discount}% OFF
            </span>

          </div>

          <div className="rating-row">

            <span>
              <FaStar /> {product.rating}
            </span>

            <small>
              {product.ratingCount.toLocaleString()} ratings
            </small>

          </div>

        </div>

      </Link>

      <button
        className="quick-bag"
        onClick={openProduct}
      >
        <FaShoppingBag />
        VIEW PRODUCT
      </button>

    </article>
  );
}

export default ProductCard;