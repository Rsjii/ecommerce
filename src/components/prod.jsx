// src/components/prod.jsx
import React, { useContext } from 'react';
import { ShopContext } from './shopcontext';
import ReactStars from 'react-rating-stars-component';
import { Link } from 'react-router-dom';

const Prod = (props) => {
  const { id, name, price, image, brand } = props.data;
  const { addToCart, cartItems, viewProductDetails } = useContext(ShopContext);

  const cartItemAmount = cartItems[id] || 0;

  return (
    <div className="col mb-5">
      <div className="card h-100 m-auto d-flex flex-column">
        <img src={image} className="card-img-top img-fluid" alt={name} />
        <div className="card-body d-flex flex-column">
          <p className="card-text mb-2">{brand}</p>
          <h5 className="mb-3">{name}</h5>
          <ReactStars count={5} edit={false} value={4} size={24} activeColor="#EA9D5A" />
          <div className="mt-auto">
            <p className="price mb-2">
              <span className="red">${price}</span>&nbsp; <strike>${(price * 2).toFixed(2)}</strike>
            </p>
            <Link to="/details" onClick={() => viewProductDetails(id)}>
              <p className="text-center">
                <button className="fs-4" id="clear-cart">
                  View Details
                </button>
              </p>
            </Link>
            <div className="d-flex justify-content-center">
              <button
                onClick={() => {
                  addToCart(id);
                  event.target.classList.toggle('red');
                }}
                className="myButton"
              >
                Add To Cart {cartItemAmount > 0 && `(${cartItemAmount})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prod;
