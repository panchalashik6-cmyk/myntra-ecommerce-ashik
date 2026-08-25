import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);

    if (savedCart.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);

  // Razorpay SDK loader. It is loaded once and can also be retried when the
  // user clicks the payment button, so a slow first page load does not leave
  // checkout stuck on "loading" forever.
  const loadRazorpay = () => {
    if (window.Razorpay) {
      setRazorpayReady(true);
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        const onLoad = () => {
          if (window.Razorpay) {
            setRazorpayReady(true);
            resolve(true);
          } else {
            reject(new Error("Razorpay SDK load hua, lekin checkout available nahi hai."));
          }
        };
        const onError = () => reject(
          new Error("Razorpay checkout load nahi hua. Internet, browser extension ya network block check karo.")
        );

        existingScript.addEventListener("load", onLoad, { once: true });
        existingScript.addEventListener("error", onError, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.dataset.razorpay = "true";

      script.onload = () => {
        if (window.Razorpay) {
          setRazorpayReady(true);
          resolve(true);
        } else {
          reject(new Error("Razorpay SDK load hua, lekin checkout available nahi hai."));
        }
      };
      script.onerror = () => reject(
        new Error("Razorpay checkout load nahi hua. Internet, browser extension ya network block check karo.")
      );

      document.body.appendChild(script);

      // Prevent an ad-blocker/network failure from waiting forever.
      window.setTimeout(() => {
        if (!window.Razorpay) {
          reject(new Error("Razorpay checkout load hone me timeout hua. Ad-blocker/extension disable karke try karo."));
        }
      }, 10000);
    });
  };

  useEffect(() => {
    loadRazorpay().catch(() => {
      // Do not show an error immediately on page load. The payment button will
      // retry the SDK load and show the exact error if it still fails.
      setRazorpayReady(false);
    });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setError("");
  };



  const handlePhone = (e) => {
    const value = e.target.value
      .replace(/\D/g, "");

    setFormData({
      ...formData,
      phone: value
    });

    setError("");
  };


  const handlePincode = (e) => {
    const value = e.target.value
      .replace(/\D/g, "");

    setFormData({
      ...formData,
      pincode: value
    });

    setError("");
  };


  
  const changePayment = (method) => {
    setPaymentMethod(method);
    setError("");
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
      Number(item.quantity || 1),
    0
  );

  const shipping = subtotal > 0 ? 50 : 0;

  const total = subtotal + shipping;


  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
      setError("Please fill all address details.");
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter valid 10 digit phone number.");
      return;
    }
    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      setError("Please enter valid 6 digit pincode.");
      return;
    }

    const items = cart.map((item) => ({
      productId: item.productId,
      size: item.size,
      quantity: Number(item.quantity)
    }));

    const shippingAddress = {
      name: formData.name.trim(), phone: formData.phone.trim(), address: formData.address.trim(),
      city: formData.city.trim(), state: formData.state.trim(), pincode: formData.pincode.trim()
    };

    try {
      setLoading(true);

      if (paymentMethod === "COD") {
        const response = await API.post("/orders", { items, shippingAddress, paymentMethod: "COD" });
        if (!response.data.success) throw new Error(response.data.message || "Order place nahi ho raha.");
        localStorage.removeItem("cart");
        localStorage.setItem("lastOrder", JSON.stringify(response.data.order));
        window.dispatchEvent(new Event("cart-updated"));
        navigate("/success");
        return;
      }

      // Always ensure the SDK is available at click time. This fixes the
      // common case where checkout page opens before Razorpay's script loads.
      await loadRazorpay();

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout available nahi hai. Please retry karo.");
      }

      const response = await API.post(
        "/payments/razorpay/order",
        { items, shippingAddress }
      );

      const paymentOrder = response.data;

      if (!paymentOrder.success || !paymentOrder.razorpayOrderId) {
        throw new Error(
          paymentOrder.message || "Razorpay order create nahi hua."
        );
      }

      const user = JSON.parse(localStorage.getItem("user") || "null");
      const razorpay = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency || "INR",
        name: "MYNTRA",
        description: "Myntra Ecommerce Order",
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: formData.name.trim(),
          email: user?.email || "",
          contact: `+91${formData.phone.trim()}`
        },
        theme: { color: "#ff3f6c" },
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await API.post("/payments/razorpay/verify", paymentResponse);
            if (!verifyResponse.data.success) throw new Error(verifyResponse.data.message || "Payment verification failed");
            localStorage.removeItem("cart");
            localStorage.setItem("lastOrder", JSON.stringify(verifyResponse.data.order));
            window.dispatchEvent(new Event("cart-updated"));
            navigate("/success");
          } catch (verifyError) {
            setError(verifyError.response?.data?.message || verifyError.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      });
      razorpay.on("payment.failed", (paymentError) => {
        setError(paymentError.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Order place nahi ho raha.");
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid container-lg py-4 py-md-5">

      <h2 className="fw-bold mb-4">
        CHECKOUT
      </h2>


      <div className="row g-4">

      

        <div className="col-12 col-lg-7">

          <div className="card border-0 shadow-sm">

            <div className="card-body p-3 p-md-4">

              <h5 className="fw-bold mb-4">
                DELIVERY ADDRESS
              </h5>
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}


              <form onSubmit={placeOrder}>

                <div className="mb-3">

                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>
                <div className="mb-3">

                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    maxLength="10"
                    className="form-control"
                    placeholder="Enter 10 digit mobile number"
                    value={formData.phone}
                    onChange={handlePhone}
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Address
                  </label>

                  <textarea
                    name="address"
                    rows="3"
                    className="form-control"
                    placeholder="House no, street, area"
                    value={formData.address}
                    onChange={handleChange}
                  />

                </div>


                <div className="row">

                  <div className="col-12 col-md-6 mb-3">

                    <label className="form-label">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="col-12 col-md-6 mb-3">

                    <label className="form-label">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="mb-4">

                  <label className="form-label">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    maxLength="6"
                    className="form-control"
                    placeholder="6 digit pincode"
                    value={formData.pincode}
                    onChange={handlePincode}
                  />

                </div>

                <h5 className="fw-bold mb-3">
                  PAYMENT METHOD
                </h5>

                <div className="border rounded p-3 mb-3">

                  <div className="form-check">

                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "COD"}
                      onChange={() =>
                        changePayment("COD")
                      }
                    />

                    <label className="form-check-label fw-semibold">
                      💵 Cash on Delivery
                    </label>

                  </div>

                  <small className="text-muted ms-4">
                    Pay when your order is delivered.
                  </small>

                </div>


                {/* RAZORPAY */}
                <div className="border rounded p-3 mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "Razorpay"}
                      onChange={() => changePayment("Razorpay")}
                    />
                    <label className="form-check-label fw-semibold">
                      💳 Online Payment (Razorpay)
                    </label>
                  </div>
                  <small className="text-muted ms-4">
                    UPI, cards, net banking and supported wallets. Secure Razorpay checkout.
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-danger btn-lg w-100"
                  disabled={loading}
                >

                  {loading
                    ? "PROCESSING..."
                    : paymentMethod === "Razorpay"
                    ? `PAY ₹${total} WITH RAZORPAY`
                    : `PLACE ORDER • ₹${total}`}

                </button>

              </form>

            </div>

          </div>

        </div>


        <div className="col-12 col-lg-5">

          <div className="card border-0 shadow-sm">

            <div className="card-body p-3 p-md-4">

              <h5 className="fw-bold mb-4">
                ORDER SUMMARY
              </h5>

              {cart.map((item, index) => (

                <div
                  key={`${item.productId}-${item.size}-${index}`}
                  className="d-flex gap-3 mb-3"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded"
                    style={{
                      width: "70px",
                      height: "90px",
                      objectFit: "cover"
                    }}
                  />


                  <div className="flex-grow-1">

                    <h6 className="fw-bold mb-1">
                      {item.brand}
                    </h6>

                    <p className="small text-muted mb-1">
                      {item.name}
                    </p>

                    <p className="small mb-1">
                      Size: {item.size}
                    </p>

                    <p className="small mb-0">
                      Qty: {item.quantity}
                    </p>

                  </div>


                  <strong className="text-nowrap">
                    ₹
                    {Number(item.price) *
                      Number(item.quantity)}
                  </strong>

                </div>

              ))}


              <hr />
              <div className="d-flex justify-content-between mb-3">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₹{subtotal}
                </strong>

              </div>

              <div className="d-flex justify-content-between mb-3">

                <span>
                  Shipping
                </span>

                <strong>
                  ₹{shipping}
                </strong>

              </div>


              <hr />

              <div className="d-flex justify-content-between fs-5">

                <strong>
                  Total
                </strong>

                <strong>
                  ₹{total}
                </strong>

              </div>

              <div className="d-flex justify-content-between mt-3 p-3 bg-light rounded">

                <span>
                  Payment
                </span>

                <strong>
                  {paymentMethod === "COD" ? "COD" : "RAZORPAY"}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;