import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSlidersH, FaChevronDown } from "react-icons/fa";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
    const location = useLocation();
    const navigate = useNavigate();

    // URL query parameters
    const params = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );

    // Category
    const category =
        location.pathname === "/men"
            ? "men"
            : location.pathname === "/women"
            ? "women"
            : location.pathname === "/kids"
            ? "kids"
            : location.pathname === "/home-living"
            ? "home-living"
            : location.pathname === "/beauty"
            ? "beauty"
            : params.get("category") || "";

    // Search
    const search = params.get("search") || "";

    // States
    const [products, setProducts] = useState([]);
    const [wish, setWish] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState(
        params.get("sort") || "newest"
    );
    const [maxPrice, setMaxPrice] = useState(10000);
    const [error, setError] = useState("");


    // =====================================================
    // UPDATE SORT WHEN URL CHANGES
    // =====================================================

    useEffect(() => {
        setSort(params.get("sort") || "newest");
    }, [params]);


    // =====================================================
    // LOAD PRODUCTS + WISHLIST
    // =====================================================

    useEffect(() => {
        setLoading(true);
        setError("");

        API.get("/products", {
            params: {
                category: category || undefined,
                search: search || undefined,
                sort,
                maxPrice
            }
        })
            .then((response) => {
                setProducts(
                    response.data.products || []
                );
            })
            .catch(() => {
                setError(
                    "Products load nahi ho rahe. Backend aur MongoDB check karo."
                );
            })
            .finally(() => {
                setLoading(false);
            });


        // Wishlist
        API.get("/user/wishlist")
            .then((response) => {
                setWish(
                    (response.data.products || [])
                        .map((product) => product._id)
                );
            })
            .catch(() => {
                setWish([]);
            });

    }, [category, search, sort, maxPrice]);


    // =====================================================
    // SORTING
    // =====================================================

    const setSorting = (value) => {
        setSort(value);

        const query = new URLSearchParams(
            location.search
        );

        if (value === "newest") {
            query.delete("sort");
        } else {
            query.set("sort", value);
        }

        navigate(
            `${location.pathname}${
                query.toString()
                    ? `?${query.toString()}`
                    : ""
            }`
        );
    };


    // =====================================================
    // PAGE TITLE
    // =====================================================

    const title = search
        ? `Search results for “${search}”`
        : category
        ? category
              .replace(
                  "home-living",
                  "Home & Living"
              )
              .replace("-", " ")
              .toUpperCase()
        : "ALL PRODUCTS";


    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="products-page container">

            {/* BREADCRUMBS */}

            <div className="breadcrumbs">
                Home / {title}
            </div>


            {/* HEADER */}

            <div className="products-head">

                <div>

                    <h1>
                        {title}
                    </h1>

                    <p>
                        {products.length} products
                    </p>

                </div>


                {/* SORT */}

                <div className="sort-select">

                    <span>
                        SORT BY
                    </span>

                    <select
                        value={sort}
                        onChange={(e) =>
                            setSorting(e.target.value)
                        }
                    >

                        <option value="newest">
                            What's New
                        </option>

                        <option value="popularity">
                            Popularity
                        </option>

                        <option value="rating">
                            Customer Rating
                        </option>

                        <option value="discount">
                            Better Discount
                        </option>

                        <option value="price_asc">
                            Price: Low to High
                        </option>

                        <option value="price_desc">
                            Price: High to Low
                        </option>

                    </select>

                    <FaChevronDown />

                </div>

            </div>


            {/* FILTER */}

            <div className="filter-row">

                <span>
                    <FaSlidersH />
                    {" "}FILTERS
                </span>


                <div className="price-filter">

                    <label>
                        MAX PRICE ₹
                        {maxPrice.toLocaleString()}
                    </label>

                    <input
                        type="range"
                        min="299"
                        max="10000"
                        step="100"
                        value={maxPrice}
                        onChange={(e) =>
                            setMaxPrice(
                                Number(e.target.value)
                            )
                        }
                    />

                </div>

            </div>


            {/* LOADING */}

            {loading && (
                <div className="loader">
                    Loading styles…
                </div>
            )}


            {/* ERROR */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}


            {/* NO PRODUCTS */}

            {!loading &&
                !error &&
                !products.length && (
                    <div className="empty-state">

                        <h2>
                            No products found
                        </h2>

                        <p>
                            Try another search or
                            remove some filters.
                        </p>

                    </div>
                )}


            {/* PRODUCTS */}

            <div className="product-grid">

                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        wishlistIds={wish}
                    />
                ))}

            </div>

        </div>
    );
}

export default Products;