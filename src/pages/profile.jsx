// src/pages/profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { updateProfile } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { PRODUCTS, PRODUCTS1 } from '../components/products';

const Profile = () => {
  const { currentUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser) {
        try {
          const ordersCollection = collection(db, 'orders');
          const q = query(
            ordersCollection,
            where('userId', '==', currentUser.uid),
            orderBy('orderDate', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const ordersData = [];
          querySnapshot.forEach((doc) => {
            ordersData.push({ id: doc.id, ...doc.data() });
          });
          console.log('Fetched Orders:', ordersData); // Debugging
          setOrders(ordersData);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setError('Failed to fetch orders. Please try again later.');
        }
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (!currentUser) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  const handleSave = async () => {
    try {
      await updateProfile(currentUser, {
        displayName,
        photoURL,
      });
      setMessage('Profile updated successfully.');
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to get product details by ID
  const getProductById = (id) => {
    return [...PRODUCTS, ...PRODUCTS1].find((product) => product.id === parseInt(id));
  };

  return (
    <section className="profile p-5">
      <div className="container-xxl">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10 col-sm-12">
            <div className="card p-5">
              <h2 className="text-center mb-4">My Profile</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}
              {editMode ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <p>{currentUser.email}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Photo URL:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="User Avatar"
                        className="img-fluid rounded-circle mb-3"
                        style={{ width: '150px', height: '150px' }}
                      />
                    ) : (
                      <div className="user-initials-profile">
                        {currentUser.displayName
                          ? currentUser.displayName.charAt(0).toUpperCase()
                          : currentUser.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h4>{currentUser.displayName || currentUser.email}</h4>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <p>{currentUser.email}</p>
                  </div>
                  {currentUser.displayName && (
                    <div className="mb-3">
                      <label className="form-label">Name:</label>
                      <p>{currentUser.displayName}</p>
                    </div>
                  )}
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </button>
                  </div>
                </>
              )}

              {/* Order History */}
              <div className="mt-5">
                <h3>Order History</h3>
                {orders.length > 0 ? (
                  <ul className="list-group">
                    {orders.map((order) => (
                      <li key={order.id} className="list-group-item">
                        <p>
                          <strong>Order ID:</strong> {order.id}
                        </p>
                        <p>
                          <strong>Date:</strong>{' '}
                          {order.orderDate instanceof Date
                            ? order.orderDate.toLocaleString()
                            : order.orderDate.toDate().toLocaleString()}
                        </p>
                        <p>
                          <strong>Total Amount:</strong> ${order.totalAmount}
                        </p>
                        <p>
                          <strong>Total Products:</strong> {order.totalProducts}
                        </p>
                        {/* Optionally display more order details */}
                        <button
                          className="btn btn-link"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#orderDetails${order.id}`}
                          aria-expanded="false"
                          aria-controls={`orderDetails${order.id}`}
                        >
                          View Details
                        </button>
                        <div className="collapse" id={`orderDetails${order.id}`}>
                          <div className="mt-3">
                            {Object.entries(order.cartItems)
                              .filter(([productId, quantity]) => quantity > 0) // Exclude Quantity: 0
                              .map(([productId, quantity]) => {
                                const product = getProductById(productId);
                                if (!product) {
                                  return (
                                    <p key={productId}>
                                      <strong>Product:</strong> Unknown Product -{' '}
                                      <strong>Quantity:</strong> {quantity}
                                    </p>
                                  );
                                }
                                return (
                                  <div key={productId} className="d-flex align-items-center mb-3">
                                    {/* Product Image */}
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="img-thumbnail me-3"
                                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                    {/* Product Details */}
                                    <div>
                                      <p>
                                        <strong>Product:</strong> {product.name}
                                      </p>
                                      <p>
                                        <strong>Quantity:</strong> {quantity}
                                      </p>
                                      <p>
                                        <strong>Price:</strong> ${product.price}
                                      </p>
                                      <p>
                                        <strong>Subtotal:</strong> $
                                        {(product.price * quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            {/* Optional: Display total per order or other details */}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>You have no orders yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
