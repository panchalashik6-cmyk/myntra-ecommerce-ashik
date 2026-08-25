import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);
  }, []);


  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(newCart)
    );
  };


  const updateQuantity = (index, quantity) => {
    const newCart = [...cart];

    newCart[index].quantity = quantity;

    saveCart(newCart);
  };


  const removeItem = (index) => {
    const newCart = cart.filter(
      (_, i) => i !== index
    );

    saveCart(newCart);
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 50 : 0;

  const total = subtotal + shipping;


  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">

        <h2 className="fw-bold">
          Your Bag is Empty
        </h2>

        <p className="text-muted">
          Product page se product add karo.
        </p>

        <Link
          to="/products"
          className="btn btn-dark"
        >
          SHOP NOW
        </Link>

      </div>
    );
  }


  return (
    <div className="container py-5">

      <h2 className="fw-bold mb-4">
        MY BAG
      </h2>


      <div className="row g-4">

        <div className="col-lg-8">

          {cart.map((item, index) => (

            <div
              className="card border-0 shadow-sm mb-3"
              key={`${item.productId}-${item.size}`}
            >

              <div className="card-body">

                <div className="row align-items-center g-3">

                  <div className="col-3 col-md-2">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded cart-image"
                    />

                  </div>

                  <div className="col-9 col-md-6">

                    <h6 className="fw-bold">
                      {item.brand}
                    </h6>

                    <p className="small text-muted mb-1">
                      {item.name}
                    </p>

                    <p className="small mb-0">
                      Size:{" "}
                      <strong>
                        {item.size}
                      </strong>
                    </p>

                  </div>


                  <div className="col-6 col-md-2">

                    <select
                      className="form-select"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          index,
                          Number(e.target.value)
                        )
                      }
                    >

                      {[1, 2, 3, 4, 5].map(
                        (number) => (
                          <option
                            key={number}
                            value={number}
                          >
                            Qty {number}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="col-6 col-md-2 text-md-end">

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>

                    <button
                      className="btn btn-link text-danger d-block ms-auto p-0"
                      onClick={() =>
                        removeItem(index)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>


        <div className="col-lg-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <h5 className="fw-bold mb-4">
                PRICE DETAILS
              </h5>

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

              <Link
                to="/checkout"
                className="btn btn-danger w-100 mt-3"
              >
                PLACE ORDER
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;