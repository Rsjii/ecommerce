// src/pages/forgotpassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <section className="login-wrapper p-5">
      <div className="container-xxl">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-8 col-sm-10">
            <div className="card">
              <div className="card-body p-5">
                <h2 className="text-center">Forgot Password</h2>
                <p className="text-center mb-4">
                  Enter your email address to receive a reset confirmation
                </p>
                {/* Display Success or Error Messages */}
                {message && (
                  <div className="alert alert-success">{message}</div>
                )}
                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}
                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label mb-3"
                    >
                      Enter Your Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  {/* Submit Button */}
                  <div className='col-12 text-center gap-2'>
                    <button id='button-link' type="submit">Submit</button>
                  </div>
                </form>
                {/* Link to Login Page */}
                <div className="d-flex justify-content-center mt-3">
                  <Link to="/login" className="form-link">
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
