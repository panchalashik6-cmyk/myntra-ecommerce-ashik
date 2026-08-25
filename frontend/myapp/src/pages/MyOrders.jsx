import React, { useEffect, useState } from "react";
import API from "../services/api";


// Order status ke according CSS class
const getStatusClass = (status) => {

  if (status?.toLowerCase() === "delivered") {
    return "done";
  }

  if (status?.toLowerCase() === "cancelled") {
    return "cancelled";
  }

  return "progress";
};


function MyOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  // Orders API se lana
  const loadOrders = async () => {

    try {

      const response = await API.get("/orders");

      setOrders(
        response.data.orders || []
      );

    } catch (error) {

      console.log(
        "Orders load error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadOrders();
  }, []);


  return (
    <div className="container orders-page">


      {/* Page Header */}
      <div className="page-title">

        <div>

          <span>
            ACCOUNT
          </span>

          <h1>
            My Orders
          </h1>

        </div>

        <small>
          {orders.length} orders
        </small>

      </div>


      {/* Loading */}
      {loading && (
        <div className="loader">
          Loading orders…
        </div>
      )}


      {/* No Orders */}
      {!loading && orders.length === 0 && (

        <div className="empty-state">

          <h2>
            No orders yet
          </h2>

          <p>
            Your placed orders will appear here.
          </p>

        </div>

      )}


      {/* Orders List */}
      {!loading && orders.length > 0 && (

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order._id}
            >


              {/* Order Header */}
              <div className="order-top">

                <div>

                  <b>
                    Order #
                    {String(order._id)
                      .slice(-8)
                      .toUpperCase()}
                  </b>

                  <span>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </span>

                </div>


                <strong
                  className={getStatusClass(
                    order.status
                  )}
                >
                  {order.status}
                </strong>

              </div>


              {/* Products */}
              <div className="order-items">

                {order.items.map(
                  (item, index) => (

                    <div key={index}>

                      <img
                        src={item.image}
                        alt={item.name}
                      />


                      <div>

                        <b>
                          {item.brand}
                        </b>

                        <p>
                          {item.name}
                        </p>

                        <small>
                          Size:{" "}
                          {item.size || "—"}
                          {" · "}
                          Qty: {item.quantity}
                        </small>

                      </div>


                      <strong>
                        ₹
                        {item.price *
                          item.quantity}
                      </strong>

                    </div>

                  )
                )}

              </div>


              {/* Order Bottom */}
              <div className="order-bottom">

                <span>
                  {order.paymentMethod}
                  {" · "}
                  {order.items.length}
                  {" item(s)"}
                </span>


                <strong>
                  Total ₹{order.total}
                </strong>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}


export default MyOrders;