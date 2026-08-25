import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
    FaStar,
    FaShoppingBag,
    FaHeart,
    FaRegHeart,
    FaTruck,
    FaUndo
} from "react-icons/fa";

import API from "../services/api";

function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [size, setSize] = useState("");
    const [qty, setQty] = useState(1);

    const [liked, setLiked] = useState(false);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // =====================================================
    // LOAD PRODUCT
    // =====================================================

    useEffect(() => {

        const loadProduct = async () => {

            setLoading(true);
            setMessage("");

            try {

                // Product API
                const productResponse = await API.get(
                    `/products/${id}`
                );

                console.log(
                    "PRODUCT RESPONSE:",
                    productResponse.data
                );

                if (
                    !productResponse.data.success ||
                    !productResponse.data.product
                ) {
                    setMessage("Product nahi mila.");
                    setProduct(null);
                    return;
                }

                const productData =
                    productResponse.data.product;

                setProduct(productData);

                // Main image
                setSelectedImage(
                    productData.image || ""
                );

                // First size
                setSize(
                    productData.sizes?.[0] || ""
                );

            } catch (error) {

                console.error(
                    "PRODUCT LOAD ERROR:",
                    error
                );

                setProduct(null);

                setMessage(
                    error.response?.data?.message ||
                    "Product nahi mila."
                );

            } finally {

                setLoading(false);

            }
        };

        loadProduct();

    }, [id]);


    // =====================================================
    // LOAD WISHLIST SEPARATELY
    // =====================================================

    useEffect(() => {

        const loadWishlist = async () => {

            try {

                const response = await API.get(
                    "/user/wishlist"
                );

                const wishlistProducts =
                    response.data.products || [];

                const exists =
                    wishlistProducts.some(
                        (item) =>
                            item._id === id
                    );

                setLiked(exists);

            } catch (error) {

                // Wishlist fail hone par
                // product page ko block nahi karna

                console.log(
                    "Wishlist load skipped:",
                    error.response?.data?.message ||
                    error.message
                );

                setLiked(false);
            }
        };

        loadWishlist();

    }, [id]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="loader page-loader">
                Loading product…
            </div>
        );

    }


    // =====================================================
    // PRODUCT NOT FOUND
    // =====================================================

    if (!product) {

        return (
            <div className="container py-5">

                <div className="alert alert-danger">
                    {message || "Product nahi mila."}
                </div>

                <Link
                    to="/products"
                    className="btn btn-dark"
                >
                    ← Back to Products
                </Link>

            </div>
        );

    }


    // =====================================================
    // GALLERY
    // =====================================================

    const gallery =
        product.images?.length
            ? product.images
            : [product.image];


    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = () => {

        if (!size) {

            setMessage(
                "Please select a size."
            );

            return;
        }

        const cart = JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

        const existingItem = cart.find(
            (item) =>
                item.productId === product._id &&
                item.size === size
        );

        if (existingItem) {

            existingItem.quantity = Math.min(
                product.stock,
                existingItem.quantity + qty
            );

        } else {

            cart.push({
                productId: product._id,
                name: product.name,
                brand: product.brand,
                image: product.image,
                price: product.price,
                size: size,
                quantity: qty
            });

        }

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        window.dispatchEvent(
            new Event("cart-updated")
        );

        navigate("/cart");

    };


    // =====================================================
    // WISHLIST
    // =====================================================

    const toggleWish = async () => {

        try {

            if (liked) {

                await API.delete(
                    `/user/wishlist/${id}`
                );

                setLiked(false);

            } else {

                await API.post(
                    "/user/wishlist",
                    {
                        productId: id
                    }
                );

                setLiked(true);
            }

            window.dispatchEvent(
                new Event("wishlist-updated")
            );

        } catch (error) {

            console.error(
                "WISHLIST ERROR:",
                error
            );

            if (
                error.response?.status === 401
            ) {
                navigate("/login");
            } else {

                setMessage(
                    error.response?.data?.message ||
                    "Wishlist update failed."
                );

            }

        }

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="container product-detail-page">

            {/* BREADCRUMB */}

            <div className="breadcrumbs">

                Home / {product.category} /{" "}
                {product.name}

            </div>


            <div className="row g-4 g-lg-5">


                {/* =========================
                    PRODUCT IMAGES
                ========================== */}

                <div className="col-12 col-lg-7">

                    <div className="gallery">

                        <div className="thumb-list">

                            {gallery.map(
                                (img, index) => (

                                    <button
                                        key={`${img}-${index}`}
                                        className={
                                            selectedImage === img
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedImage(
                                                img
                                            )
                                        }
                                    >

                                        <img
                                            src={img}
                                            alt=""
                                        />

                                    </button>

                                )
                            )}

                        </div>


                        <div className="main-product-image">

                            <img
                                src={selectedImage}
                                alt={product.name}
                            />

                        </div>

                    </div>

                </div>


                {/* =========================
                    PRODUCT DETAILS
                ========================== */}

                <div className="col-12 col-lg-5 detail-info">


                    {/* BRAND + WISHLIST */}

                    <div className="brand-line">

                        <span>
                            {product.brand}
                        </span>

                        <button
                            onClick={toggleWish}
                        >

                            {liked
                                ? <FaHeart />
                                : <FaRegHeart />
                            }

                            {" "}

                            {liked
                                ? "WISHLISTED"
                                : "WISHLIST"
                            }

                        </button>

                    </div>


                    {/* NAME */}

                    <h1>
                        {product.name}
                    </h1>


                    {/* DESCRIPTION */}

                    <p className="detail-description">

                        {product.description}

                    </p>


                    {/* RATING */}

                    <div className="rating-box">

                        <b>

                            {product.rating}

                            {" "}

                            <FaStar />

                        </b>

                        <span>

                            {Number(
                                product.ratingCount || 0
                            ).toLocaleString()}

                            {" "}
                            Ratings & Reviews

                        </span>

                    </div>


                    {/* PRICE */}

                    <div className="detail-price">

                        <strong>
                            ₹{product.price}
                        </strong>

                        <del>
                            ₹{product.oldPrice}
                        </del>

                        <span>
                            ({product.discount}% OFF)
                        </span>

                    </div>


                    <p className="tax-note">
                        inclusive of all taxes
                    </p>

                    <hr />


                    {/* SIZE */}

                    <h6>

                        SELECT SIZE

                        <span>
                            SIZE CHART
                        </span>

                    </h6>


                    <div className="size-options">

                        {(product.sizes || []).map(
                            (itemSize) => (

                                <button
                                    key={itemSize}
                                    className={
                                        size === itemSize
                                            ? "selected"
                                            : ""
                                    }
                                    onClick={() =>
                                        setSize(
                                            itemSize
                                        )
                                    }
                                >

                                    {itemSize}

                                </button>

                            )
                        )}

                    </div>


                    {/* QUANTITY */}

                    <div className="qty-row">

                        <strong>
                            QUANTITY
                        </strong>

                        <button
                            onClick={() =>
                                setQty(
                                    Math.max(
                                        1,
                                        qty - 1
                                    )
                                )
                            }
                        >
                            −
                        </button>

                        <b>
                            {qty}
                        </b>

                        <button
                            onClick={() =>
                                setQty(
                                    Math.min(
                                        product.stock,
                                        qty + 1
                                    )
                                )
                            }
                        >
                            +
                        </button>

                        <small>
                            {product.stock} left
                        </small>

                    </div>


                    {/* MESSAGE */}

                    {message && (

                        <div className="alert alert-warning py-2">

                            {message}

                        </div>

                    )}


                    {/* ADD TO BAG */}

                    <button
                        className="add-bag"
                        onClick={addToCart}
                        disabled={
                            product.stock <= 0
                        }
                    >

                        <FaShoppingBag />

                        {" "}

                        {product.stock <= 0
                            ? "OUT OF STOCK"
                            : "ADD TO BAG"
                        }

                    </button>


                    {/* DELIVERY */}

                    <div className="delivery-cards">

                        <div>

                            <FaTruck />

                            <div>

                                <b>
                                    FREE DELIVERY
                                </b>

                                <span>
                                    On orders above ₹999
                                </span>

                            </div>

                        </div>


                        <div>

                            <FaUndo />

                            <div>

                                <b>
                                    7 DAY RETURNS
                                </b>

                                <span>
                                    Easy returns on eligible items
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* PRODUCT DETAILS */}

                    <div className="detail-section">

                        <h5>
                            PRODUCT DETAILS
                        </h5>

                        <p>
                            {product.description}
                        </p>

                        <div>

                            <b>
                                Colours:
                            </b>{" "}

                            {product.colors?.join(", ") || "—"}

                        </div>

                        <div>

                            <b>
                                Category:
                            </b>{" "}

                            {product.category}

                        </div>

                        <div>

                            <b>
                                Availability:
                            </b>{" "}

                            {product.stock > 0
                                ? "In Stock"
                                : "Out of Stock"
                            }

                        </div>

                    </div>

                </div>

            </div>


            {/* BACK */}

            <div className="back-products">

                <Link
                    to={`/products?category=${product.category}`}
                >
                    ← More from this category
                </Link>

            </div>

        </div>
    );
}

export default ProductDetails;