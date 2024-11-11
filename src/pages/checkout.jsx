// src/pages/checkout.jsx
import React, { useContext, useState } from 'react';
import { ShopContext } from '../components/shopcontext';
import pay from '../assets/images/pay/pay.png'; // Ensure this path is correct
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';

const Checkout = () => {
  const { getTotalCartProducts, getTotalCartAmount, resetCart, cartItems } = useContext(ShopContext);
  const totalAmountBeforeDiscount = parseFloat(getTotalCartAmount());
  const totalProducts = getTotalCartProducts();

  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    email: currentUser ? currentUser.email : '',
    password: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paypalEmail: '',
  });

  const [errors, setErrors] = useState({});

  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  // New State Variables for Coupon Code
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0); // Discount percentage
  const [discountError, setDiscountError] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Define Valid Coupon Codes
  const validCoupons = {
    SAVE10: 10,
    SAVE20: 20,
    DIWALI24: 50,
    WELCOME5: 5,
    HOLIDAY15: 15,
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function to Handle Applying Coupon Code
  const handleApplyCoupon = () => {
    const enteredCode = couponCode.trim().toUpperCase();
    if (enteredCode === '') {
      setDiscountError('Please enter a coupon code.');
      return;
    }

    if (isCouponApplied) {
      setDiscountError('A coupon has already been applied.');
      return;
    }

    if (validCoupons.hasOwnProperty(enteredCode)) {
      setDiscount(validCoupons[enteredCode]);
      setIsCouponApplied(true);
      setDiscountError('');
      window.alert(`Coupon "${enteredCode}" applied! You received a ${validCoupons[enteredCode]}% discount.`);
    } else {
      setDiscount(0);
      setDiscountError('Invalid coupon code. Please try again.');
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip) newErrors.zip = 'Zip code is required';

    if (paymentMethod === 'creditCard') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card Number is required';
      } else if (!/^\d{13,19}$/.test(formData.cardNumber.replace(/\s+/g, ''))) {
        newErrors.cardNumber = 'Card Number must be 13 to 19 digits';
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry Date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Expiry Date must be in MM/YY format';
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    } else if (paymentMethod === 'paypal') {
      if (!formData.paypalEmail) {
        newErrors.paypalEmail = 'PayPal email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.paypalEmail)) {
        newErrors.paypalEmail = 'Enter a valid email address';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Filter out items with quantity 0
        const filteredCartItems = Object.fromEntries(
          Object.entries(cartItems).filter(([productId, quantity]) => quantity > 0)
        );

        // Calculate Discount Amount
        const discountAmount = (totalAmountBeforeDiscount * discount) / 100;
        const totalAmountAfterDiscount = totalAmountBeforeDiscount - discountAmount;

        // Prepare order data
        const orderData = {
          userId: currentUser.uid, // Must match the Firestore query in Profile
          email: formData.email,
          shippingAddress: {
            address: formData.address,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          },
          paymentMethod: paymentMethod,
          totalAmount: parseFloat(totalAmountAfterDiscount.toFixed(2)), // Final Amount after Discount
          totalProducts: parseInt(totalProducts, 10),
          cartItems: filteredCartItems, // Only purchased items
          orderDate: Timestamp.now(),
          discountApplied: isCouponApplied ? discount : 0, // Percentage Discount
          discountAmount: isCouponApplied ? parseFloat(discountAmount.toFixed(2)) : 0, // Monetary Discount
          couponCode: isCouponApplied ? couponCode.trim().toUpperCase() : '', // Applied Coupon Code
        };

        // Log the order data for debugging
        console.log('Attempting to save order:', orderData);

        // Save order to Firestore
        const ordersCollection = collection(db, 'orders');
        const docRef = await addDoc(ordersCollection, orderData);

        console.log('Order successfully written with ID: ', docRef.id);

        window.alert(
          `Thank you for your purchase of ${totalProducts} products for a total of $${totalAmountAfterDiscount.toFixed(
            2
          )}. Your request has been received and is being processed.`
        );
        resetCart();
        // Optionally, reset coupon code state
        setCouponCode('');
        setDiscount(0);
        setIsCouponApplied(false);
      } catch (error) {
        console.error('Error saving order:', error);
        window.alert('An error occurred while processing your order. Please try again.');
      }
    } else {
      window.alert('Please fill in all required fields correctly.');
    }
  };

  return (
    <>
      <section className="checkout p-5">
        <div className="container-xxl">
          <div className="row">
            {/* Payment Method Section */}
            <div className="col-md-6 mb-4">
              <h1 className="mb-4 fs-3">Payment Method</h1>
              <div className="accordion" id="accordionExample">
                {/* PayPal Option */}
                <div className="card">
                  <div className="card-header p-0" id="headingTwo">
                    <button
                      className="btn col-12 btn-light btn-block text-start collapsed p-3 rounded-0 border-bottom-custom"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="col-6">
                          <span>PayPal</span>
                        </div>
                        <div className="col-6">
                          <img src={pay} alt="PayPal Logo" className="img-fluid" />
                        </div>
                      </div>
                    </button>
                  </div>
                  <div
                    id="collapseTwo"
                    className={`collapse ${paymentMethod === 'paypal' ? 'show' : ''}`}
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="PayPal email"
                        id="paypalEmail"
                        value={formData.paypalEmail}
                        onChange={handleInputChange}
                        required={paymentMethod === 'paypal'}
                      />
                      {errors.paypalEmail && (
                        <div className="text-danger">{errors.paypalEmail}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Credit Card Option */}
                <div className="card">
                  <div className="card-header p-0" id="headingOne">
                    <button
                      className="btn col-12 btn-light btn-block text-start p-3 rounded-0"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded={paymentMethod === 'creditCard' ? 'true' : 'false'}
                      aria-controls="collapseOne"
                      onClick={() => setPaymentMethod('creditCard')}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="col-6">
                          <span>Credit Card</span>
                        </div>
                        <div className="icons col-6">
                          <img src={pay} alt="Credit Card Logos" className="img-fluid" />
                        </div>
                      </div>
                    </button>
                  </div>
                  <div
                    id="collapseOne"
                    className={`collapse ${paymentMethod === 'creditCard' ? 'show' : ''}`}
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="card-body payment-card-body">
                      <span className="font-weight-normal card-text">Card Number</span>
                      <div className="input mb-4">
                        <i className="fa fa-credit-card"></i>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9\s]{13,19}"
                          maxLength="19"
                          className="form-control"
                          placeholder="0000 0000 0000 0000"
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required={paymentMethod === 'creditCard'}
                        />
                        {errors.cardNumber && (
                          <div className="text-danger">{errors.cardNumber}</div>
                        )}
                      </div>

                      <div className="row mt-3 mb-3">
                        <div className="col-md-6">
                          <span className="font-weight-normal card-text">Expiry Date</span>
                          <div className="input">
                            <i className="fa fa-calendar"></i>
                            <input
                              type="text"
                              pattern="\d{2}/\d{2}"
                              className="form-control"
                              placeholder="MM/YY"
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              required={paymentMethod === 'creditCard'}
                            />
                            {errors.expiryDate && (
                              <div className="text-danger">{errors.expiryDate}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <span className="font-weight-normal card-text">CVC/CVV</span>
                          <div className="input mb-4">
                            <i className="fa fa-lock"></i>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="\d{3,4}"
                              maxLength="4"
                              className="form-control"
                              placeholder="000"
                              id="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              required={paymentMethod === 'creditCard'}
                            />
                            {errors.cvv && <div className="text-danger">{errors.cvv}</div>}
                          </div>
                        </div>
                      </div>

                      <span className="text-muted certificate-text">
                        <i className="fa fa-lock"></i> Your transaction is secured with SSL
                        certificate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Details Form */}
            <div className="col-md-6">
              <h1 className="mt-3 mb-3 fs-3">Fill the following details for shipping.</h1>
              <form className="row g-3 mb-3" onSubmit={handlePay}>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>

                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="1234 Main St"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.address && <div className="text-danger">{errors.address}</div>}
                </div>

                {/* <div className="col-12">
                  <label htmlFor="address2" className="form-label">
                    Address 2
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address2"
                    placeholder="Apartment, studio, or floor"
                    value={formData.address2}
                    onChange={handleInputChange}
                  />
                </div> */}

                <div className="col-md-6">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.city && <div className="text-danger">{errors.city}</div>}
                </div>

                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <select
                    id="state"
                    className="form-select"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose...</option>
                    <option value="New Delhi">New Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    {/* Add more options as needed */}
                  </select>
                  {errors.state && <div className="text-danger">{errors.state}</div>}
                </div>

                <div className="col-md-2">
                  <label htmlFor="zip" className="form-label">
                    Zip
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.zip && <div className="text-danger">{errors.zip}</div>}
                </div>

                {/* Coupon Code Section */}
                <div className="col-12">
                  <label htmlFor="couponCode" className="form-label">
                    Coupon Code
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="couponCode"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={isCouponApplied}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleApplyCoupon}
                      disabled={isCouponApplied}
                    >
                      Apply
                    </button>
                  </div>
                  {discountError && <div className="text-danger mt-2">{discountError}</div>}
                </div>

                {/* Display Discount and Total */}
                {isCouponApplied && (
                  <div className="col-12 mt-3">
                    <p className="text-success">
                      Coupon Applied: {couponCode.trim().toUpperCase()} (-{discount}%)
                    </p>
                    <p>
                      <strong>Discount Amount:</strong> ${((totalAmountBeforeDiscount * discount) / 100).toFixed(2)}
                    </p>
                    <p>
                      <strong>Total After Discount:</strong> ${(totalAmountBeforeDiscount - (totalAmountBeforeDiscount * discount) / 100).toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="col-12 mt-5">
                  <button id="button-linker" type="submit" className="btn btn-primary w-100">
                    Proceed To Pay
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
