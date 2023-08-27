import React, { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import { Order } from "../components/index";
import { OrdersService, ProductsService } from "../utils/functions";

const Dashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [showOrderDeletedAlert, setShowOrderDeletedAlert] = useState(false);
  const [showOrderPlacedAlert, setShowOrderPlacedAlert] = useState(false);
  const { payedOrders, notPayedOrders, fetchOrdersByUserId, updateOrder, cancelOrder } = OrdersService;
  const { getProductById, fetchProducts } = ProductsService;

  const getDataFromDataBase = useCallback(async () => {
    const ordersResponse = await fetchOrdersByUserId(currentUser.id);

    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json();
      const productsResponse = await fetchProducts();

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();

        const ordersWithProduct = ordersData.map((order) => ({
          ...order,
          product: getProductById(productsData, order.productId),
        }));

        setOrders(ordersWithProduct);
      }
    }
  }, []);

  useEffect(() => {
    getDataFromDataBase();
  }, []);

  const handleBuy = async(orderId, userId, productId, quantity) => {
    if(window.confirm("Do you want to place an order for this product?")){
      const orderToUpdate = {
        id: orderId,
        userId,
        productId,
        quantity,
        isPaymentCompleted: true
      };

      const response = await updateOrder(orderId, orderToUpdate);
      
      if(response.ok){
        setShowOrderPlacedAlert(true);
        getDataFromDataBase();
      }
    }
  };

   const handleCancelation = async(orderId) => {
      if(window.confirm("Are you sure you want to cancel this product?")){
        const response = await cancelOrder(orderId);

        if(response.ok){
          setShowOrderDeletedAlert(true);
          getDataFromDataBase();
        }
      }
   };

  return (
    <div className="row">
      <div className="col-12 py-3 header">
        <h4>
          <i className="fa fa-dashboard"></i>Dasboard{" "}
          <button
            className="btn btn-sm btn-info"
            onClick={() => getDataFromDataBase()}
          >
            <i className="fa fa-refresh">Refresh</i>
          </button>
        </h4>
      </div>

      <div className="col-12">
        <div className="row">
          <div className="col-lg-6">
            <h4 className="py-2 my-2 text-info border-bottom border-info">
              <i className="fa fa-history"></i>Previous Orders
              <span className="badge bg-primary m-2">
                {" "}
                {payedOrders(orders).length}
              </span>
            </h4>

            {!payedOrders(orders).length && (
              <div className="text-danger">No previous orders</div>
            )}
            {payedOrders(orders).map((order) => (
              <Order
                key={order.id}
                productName={order.product.name}
                productId={order.product.id}
                quantity={order.quantity}
                price={order.product.price}
                userId={order.userId}
                isPaymentCompleted={order.isPaymentCompleted}
                orderId={order.id}
              />
            ))}
          </div>
          <div className="col-lg-6">
            <h4 className="py-2 my-2 text-primary border-bottom border-info">
              <i className="fa fa-shopping-cart"></i>Cart
              <span className="badge bg-primary m-2">
                {" "}
                {notPayedOrders(orders).length}
              </span>
            </h4>

            {showOrderPlacedAlert && (
              <div className="col-12">
                <div
                  className="alert alert-success alert-dismissible fade show mt-1"
                  role="alert"
                >
                  You're order has been placed successfully
                  <button className="btn-close" type="button" data-bs-dismiss="alert">
                    <span></span>
                  </button>
                </div>
              </div>
            )}

            {showOrderDeletedAlert && (
              <div className="col-12">
                <div
                  className="alert alert-danger alert-dismissible fade show mt-1"
                  role="alert"
                >
                  You're order has been canceled
                  <button className="btn-close" type="button" data-bs-dismiss="alert">
                    <span></span>
                  </button>
                </div>
              </div>
            )}

            {!notPayedOrders(orders).length && (
              <div className="text-danger">No orders in your cart</div>
            )}
            {notPayedOrders(orders).map((order) => (
              <Order
                key={order.id}
                productName={order.product.name}
                productId={order.product.id}
                quantity={order.quantity}
                price={order.product.price}
                userId={order.userId}
                isPaymentCompleted={order.isPaymentCompleted}
                orderId={order.id}
                handleBuy={handleBuy}
                handleCancelation={handleCancelation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
