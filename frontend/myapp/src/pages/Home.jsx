import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaTags
} from "react-icons/fa";

import API from "../services/api";
import ProductCard from "../components/ProductCard";

import banner1 from "../assets/home/banner1.png";
import banner2 from "../assets/home/banner2.png";
import banner3 from "../assets/home/banner3.png";

import menImage from "../assets/home/men.jpg";
import womenImage from "../assets/home/women.jpg";
import kidsImage from "../assets/home/kids.jpg";


// Categories
const categories = [
  {
    name: "MEN",
    path: "/men",
    image: menImage
  },
  {
    name: "WOMEN",
    path: "/women",
    image: womenImage
  },
  {
    name: "KIDS",
    path: "/kids",
    image: kidsImage
  },
  {
    name: "HOME & LIVING",
    path: "/home-living",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "BEAUTY",
    path: "/beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"
  }
];


function Home() {

  const [products, setProducts] = useState([]);


  // Get trending products
  const getProducts = async () => {

    try {

      const response = await API.get("/products", {
        params: {
          sort: "popularity",
          limit: 12
        }
      });

      setProducts(
        response.data.products || []
      );

    } catch (error) {

      console.log(
        "Products load error",
        error
      );

    }
  };


  useEffect(() => {
    getProducts();
  }, []);


  return (
    <div className="home-page">


      {/* ================= HERO ================= */}

      <section className="hero-carousel">

        {[banner1, banner2, banner3].map(
          (banner, index) => (

            <div
              className={`hero-slide ${
                index === 0 ? "active" : ""
              }`}
              key={banner}
            >

              <img
                src={banner}
                alt="Fashion promotion"
              />


              <div className="hero-overlay">

                <span>
                  THE BIG FASHION EDIT
                </span>

                <h1>
                  Style it. Love it.
                  <br />
                  Live it.
                </h1>

                <Link to="/products">
                  SHOP NOW
                  <FaArrowRight />
                </Link>

              </div>

            </div>

          )
        )}

      </section>


      {/* ================= CATEGORY ================= */}

      <section className="container section-block">

        <div className="section-heading">

          <div>

            <span>
              SHOP BY CATEGORY
            </span>

            <h2>
              Everything you love
            </h2>

          </div>


          <Link to="/products">
            VIEW ALL
            <FaArrowRight />
          </Link>

        </div>


        <div className="category-grid">

          {categories.map((category) => (

            <Link
              to={category.path}
              className="category-card"
              key={category.path}
            >

              <img
                src={category.image}
                alt={category.name}
              />


              <div>

                <h3>
                  {category.name}
                </h3>

                <span>
                  EXPLORE
                  <FaArrowRight />
                </span>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* ================= PROMO ================= */}

      <section className="promo-strip">

        <div>

          <span>
            NEW SEASON
          </span>

          <h2>
            Fresh fits. Fresh mood.
          </h2>

          <p>
            Discover thousands of styles
            curated for you.
          </p>

        </div>


        <Link to="/products">
          EXPLORE NOW
          <FaArrowRight />
        </Link>

      </section>


      {/* ================= TRENDING PRODUCTS ================= */}

      <section className="container section-block">

        <div className="section-heading">

          <div>

            <span>
              TRENDING NOW
            </span>

            <h2>
              Most loved products
            </h2>

          </div>


          <Link to="/products?sort=popularity">
            VIEW ALL
            <FaArrowRight />
          </Link>

        </div>


        <div className="product-grid">

          {products.map((product) => (

            <ProductCard
              key={product._id}
              product={product}
            />

          ))}

        </div>

      </section>


      {/* ================= DEAL ================= */}

      <section className="container section-block">

        <div className="deal-banner">

          <div>

            <span>
              LIMITED TIME
            </span>

            <h2>
              Up to 70% off
            </h2>

            <p>
              Big brands. Better prices.
              Today only.
            </p>


            <Link to="/products?sort=discount">
              SHOP DEALS
              <FaArrowRight />
            </Link>

          </div>


          <div className="deal-circle">
            SALE
          </div>

        </div>

      </section>


      {/* ================= BENEFITS ================= */}

      <section className="benefits">

        <div>

          <FaTruck />

          <strong>
            FREE SHIPPING
          </strong>

          <span>
            On orders above ₹999
          </span>

        </div>


        <div>

          <FaUndo />

          <strong>
            EASY RETURNS
          </strong>

          <span>
            7-day hassle-free returns
          </span>

        </div>


        <div>

          <FaShieldAlt />

          <strong>
            SECURE PAYMENTS
          </strong>

          <span>
            100% protected checkout
          </span>

        </div>


        <div>

          <FaTags />

          <strong>
            GENUINE PRODUCTS
          </strong>

          <span>
            Authentic brands only
          </span>

        </div>

      </section>

    </div>
  );
}


export default Home;