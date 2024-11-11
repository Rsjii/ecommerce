// src/App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/layout';
import Home from './pages/home';
import About from './pages/about';
import Shop from './pages/shop';
import Contact from './pages/contact';
import Login from './pages/login';
import Signup from './pages/signup';
import ForgotPassword from './pages/forgotpasword'; // Corrected spelling
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import Details from './pages/details';
import './App.css';
import ShopContextProvider from './components/shopcontext'; // Renamed to ShopContextProvider
import AuthProvider from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/profile'; 

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <ShopContextProvider> {/* Use ShopContextProvider instead of ShopContext */}
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='shop' element={<Shop />} />
              <Route path='about' element={<About />} />
              <Route path='contact' element={<Contact />} />
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<Signup />} />
              <Route path='forgotpasword' element={<ForgotPassword />} /> {/* Corrected path */}
              <Route path='cart' element={<Cart />} />
              <Route 
                path='checkout' 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route path='details' element={<Details />} />
              <Route 
                path='profile' 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ShopContextProvider>
    </AuthProvider>
  );
}

export default App;
