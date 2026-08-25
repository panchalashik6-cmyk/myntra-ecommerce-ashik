import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../services/api";
import ProductCard from "../components/ProductCard";


function Wishlist() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  const loadWishlist = async () => {

    try {

      const response = await API.get(
        "/user/wishlist"
      );

      setProducts(
        response.data.products || []
      );

    } catch (error) {

      setProducts([]);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadWishlist();
  }, []);


  const wishlistIds = products.map(
    (product) => product._id
  );


  return (
    <div className="container wishlist-page">


      <div className="page-title">

        <div>

          <span>
            YOUR FAVOURITES
          </span>

          <h1>
            My Wishlist
          </h1>

        </div>

        <small>
          {products.length} items
        </small>

      </div>

      {loading && (
        <div className="loader">
          Loading wishlist…
        </div>
      )}

      {!loading && products.length === 0 && (

        <div className="empty-state">

          <div className="empty-icon">
            ♡
          </div>

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Save the styles you love
            and find them here.
          </p>

          <Link
            to="/products"
            className="primary-btn"
          >
            EXPLORE PRODUCTS
          </Link>

        </div>

      )}

      {!loading && products.length > 0 && (

        <div className="product-grid">

          {products.map((product) => (

            <ProductCard
              key={product._id}
              product={product}
              wishlistIds={wishlistIds}
            />

          ))}

        </div>

      )}

    </div>
  );
}


export default Wishlist;