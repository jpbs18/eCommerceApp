import React from "react";

const Product = ({ product, handleAddToCart }) => {
  const { name, price, brand, category, rating, isOrdered } = product;

  return (
    <div className="col-lg-6">
      <div className="card m-1">
        <h5>
          <i className="fa fa-arrow-right"></i>
          {name}
        </h5>
        <div>${price.toFixed(2)}</div>
        <div className="mt-2 text-muted">
          #{brand.name} #{category.name}
        </div>

        <div>
          {[...Array(rating).keys()].map((n) => (
            <i key={n} className="fa fa-star text-warning"></i>
          ))}
          {[...Array(5 - rating).keys()].map((n) => (
            <i key={n} className="fa fa-star-o text-warning"></i>
          ))}
        </div>

        <div className="float-right">
          {isOrdered ? (
            <span className="text-primary">Added to Cart!</span>
          ) : (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleAddToCart(product)}
            >
              <i className="fa fa-cart-plus"></i>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Product);
