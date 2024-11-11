// src/components/shopcontext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { PRODUCTS, PRODUCTS1 } from './products';
import { useAuth } from './AuthContext';

// Create Context
export const ShopContext = createContext(null);

// Function to get default cart
const getDefaultCart = () => {
  const cart = {};
  const allProducts = [...PRODUCTS, ...PRODUCTS1];
  allProducts.forEach((product) => {
    cart[product.id] = 0;
  });
  return cart;
};

// ShopContextProvider Component
const ShopContextProvider = (props) => {
  const { currentUser } = useAuth();

  // Initialize cartItems state
  const [cartItems, setCartItems] = useState(getDefaultCart());

  // Load cart from localStorage when user logs in
  useEffect(() => {
    if (currentUser) {
      const storedCart = localStorage.getItem(`cart_${currentUser.uid}`);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems(getDefaultCart());
      }
    } else {
      // Clear cart when user logs out
      setCartItems(getDefaultCart());
    }
  }, [currentUser]);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`cart_${currentUser.uid}`, JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser]);

  // Cart functions
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo =
          PRODUCTS.find((product) => product.id === Number(item)) ||
          PRODUCTS1.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += cartItems[item] * itemInfo.price;
        }
      }
    }
    return totalAmount.toFixed(2);
  };

  const getTotalCartProducts = () => {
    let totalProducts = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalProducts += cartItems[item];
      }
    }
    return totalProducts;
  };

  const addToCart = (productId) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: prev[productId] + 1,
    }));
  };

  const removeToCart = (productId) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: prev[productId] - 1 < 0 ? 0 : prev[productId] - 1,
    }));
  };

  const updateCartItemCount = (newAmount, productId) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: newAmount < 0 ? 0 : newAmount,
    }));
  };

  const clearCart = () => {
    const updatedCartItems = getDefaultCart();
    setCartItems(updatedCartItems);
  };

  const resetCart = () => {
    setCartItems(getDefaultCart());
  };

  const [selectedProduct, setSelectedProduct] = useState(null);

  const viewProductDetails = (productId) => {
    setSelectedProduct(productId);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeToCart,
    updateCartItemCount,
    getTotalCartAmount,
    getTotalCartProducts,
    clearCart,
    resetCart,
    viewProductDetails,
    closeProductDetails,
    selectedProduct,
  };

  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
