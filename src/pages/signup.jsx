// src/pages/signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';

const Signup = () => {
  const [displayName, setDisplayName] = useState(''); // Added displayName state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSignup = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's display name
      await updateProfile(userCredential.user, { displayName });
      navigate('/'); // Redirect to home or dashboard after signup
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="login-wrapper p-5">
      <div className="container-xxl">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-8 col-sm-10">
            <div className="card">
              <div className="card-body p-5">
                <h2 className="text-center">Sign Up</h2>
                <p className="text-center mb-3">Join us in shopping!!</p>
                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}
                <form onSubmit={handleEmailSignup}>
                  {/* Display Name Field */}
                  <div className="mb-3">
                    <label htmlFor="displayName" className="form-label mb-3">
                      Enter Your Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="displayName"
                      placeholder="Enter your name..."
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      required
                    />
                  </div>
                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label mb-3">
                      Enter Your Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="enter email here ..."
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label mb-3">
                      Enter Your Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="enter password here..."
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                  {/* Confirm Password Field */}
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label mb-3">
                      Confirm Your Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="rewrite password here..."
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                    />
                  </div>
                  {/* Submit Button */}
                  <div className="d-grid gap-2 mb-3">
                    <button type="submit">Sign Up</button>
                  </div>
                </form>
                {/* OAuth Signup Option */}
                <div className="d-flex justify-content-between align-items-center">
                  <p>Have an account?</p>
                  <Link to="/login" className="form-link">
                    Log In
                  </Link>
                </div>
                <div className="text-center mt-3">
                  <button className="oauth-button" onClick={handleGoogleSignup}>
                    Sign Up with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
