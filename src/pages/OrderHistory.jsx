// src/pages/OrderHistory.jsx

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { Navigate } from 'react-router-dom';

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchOrders = async () => {
        try {
          const ordersRef = collection(db, 'orders');
          const q = query(ordersRef, where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);

          const ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setOrders(ordersData);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <section className="order-history p-5">
        <div className="container-xxl">
          <h2>Loading your orders...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="order-history p-5">
      <div className="container-xxl">
        <h2 className="mb-4">My Order History</h2>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Order ID: {order.id}</h5>
                <p><strong>Date:</strong> {order.createdAt.toDate().toLocaleString()}</p>
                <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                <h6>Items:</h6>
                <ul>
                  {Object.entries(order.items).map(([productId, quantity]) => (
                    quantity > 0 && (
                      <li key={productId}>
                        Product ID: {productId}, Quantity: {quantity}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p>You have no orders.</p>
        )}
      </div>
    </section>
  );
};

export default OrderHistory;
