import React from "react";

const Order = ({
  productName,
  productId,
  quantity,
  price,
  userId,
  isPaymentCompleted,
  orderId,
  handleBuy,
  handleCancelation
}) => {
  return (
    <div className="card my-2 shadow">
      <div className="card-body">
        <h5>
          <i className="fa fa-arrow-right"></i>
          {productName}
        </h5>
        {!isPaymentCompleted && (
          <div className="float-right">
            <button className="btn btn-sm btn-info m-2" onClick={() => handleBuy(orderId, userId, productId, quantity)}>
              <i className="fa fa-truck"></i>Buy Now
            </button>
            <button className="btn btn-sm btn-danger m-2" onClick={() => handleCancelation(orderId)}>
              <i className="fa fa-trash-0"></i>Cancel Order
            </button>
          </div>
        )}
      </div>

      <table className="table table-lg table-borderless mt-1">
        <tbody>
          <tr>
            <td style={{ width: "100px" }}>Quantity: {quantity}</td>
          </tr>
          <tr>
            <td style={{ width: "100px" }}>Price: $ {price}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Order);