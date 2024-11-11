// src/components/Header.jsx
import React, { useContext, useState } from 'react';
import { ShopContext } from '../components/shopcontext';
import { VscAccount } from 'react-icons/vsc';
import { CgShoppingCart, CgProductHunt } from 'react-icons/cg';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';

// Import authentication context and LogoutButton component
import { useAuth } from './AuthContext'; // Adjust the path if necessary
import LogoutButton from './LogoutButton'; // Adjust the path if necessary

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { getTotalCartProducts } = useContext(ShopContext);
  const totalProducts = getTotalCartProducts();
  const location = useLocation();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Retrieve currentUser from authentication context
  const { currentUser } = useAuth();

  // Helper function to get initials from display name
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0).toUpperCase());
    return initials.slice(0, 2).join('');
  };

  return (
    <>
      <header className='navbar-middle sticky-top p-2 p-md-2 p-lg-2'>
        <div className="container-xxl">
          <div className="row align-items-center m-0">
            <div className="col-md-2 d-flex justify-content-center">
              <button className="navbar-toggler d-md-none" type="button" onClick={toggleMenu}>
                <span className="navbar-toggler-icon">
                  {showMenu ? <AiOutlineClose /> : <AiOutlineMenu />}
                </span>
              </button>
              <Link to='/'>
                <img src={logo} alt="logo" className='img-fluid logo' />
              </Link>
            </div>

            <div className="col-md-10 row col-lg-10">
              {/* Removed the search bar from here */}
              <div className="col-md-9 m-auto">
                <div className='menu-links mt-2 d-none d-md-flex d-lg-flex'>
                  <div className='ms-auto gap-3'>
                    <NavLink to="/" className={location.pathname === '/' ? 'active' : 'not-active'} onClick={toggleMenu}>HOME</NavLink>
                  </div>
                  <div className='ms-auto gap-3'>
                    <NavLink to="/shop" className={location.pathname === '/shop' ? 'active' : 'not-active'} onClick={toggleMenu}>SHOP</NavLink>
                  </div>
                  <div className='ms-auto gap-3'>
                    <NavLink to="/about" className={location.pathname === '/about' ? 'active' : 'not-active'} onClick={toggleMenu}>ABOUT</NavLink>
                  </div>
                  <div className='ms-auto gap-3'>
                    <NavLink to="/contact" className={location.pathname === '/contact' ? 'active' : 'not-active'} onClick={toggleMenu}>CONTACT</NavLink>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="row d-flex justify-content-center">
                  <div className="col-12 col-md-2 d-none d-md-flex d-lg-flex m-auto">
                    {/* Conditionally render links based on authentication state */}
                    {currentUser ? (
                      <>
                        {/* User Initials Link */}
                        <div className='ms-auto gap-3 d-flex align-items-center'>
                          <NavLink to="/profile" className={location.pathname === '/profile' ? 'active' : 'not-active'} onClick={toggleMenu}>
                            <span className="user-initials d-flex align-items-center justify-content-center">
                              {getInitials(currentUser.displayName)}
                            </span>
                          </NavLink>
                        </div>
                        {/* LogoutButton component */}
                        <div className='ms-auto gap-3'>
                          <LogoutButton />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Login Link */}
                        <div className={location.pathname === '/login' ? 'active' : 'not-active'}>
                          <Link onClick={toggleMenu}
                            to="/login"
                            className="d-flex align-items-center color-nav me-3"
                          >
                            <VscAccount className='me-1 fs-2' />
                          </Link>
                        </div>
                        {/* Sign Up Link */}
                        <div className={location.pathname === '/signup' ? 'active' : 'not-active'}>
                          <Link onClick={toggleMenu}
                            to="/signup"
                            className="d-flex align-items-center color-nav me-3"
                          >
                            <CgProductHunt className='me-1 fs-2' />
                          </Link>
                        </div>
                      </>
                    )}

                    {/* Cart Link remains the same */}
                    <div className={location.pathname === '/cart' ? 'active' : 'not-active'}>
                      <Link onClick={toggleMenu}
                        to="/cart"
                        className="d-flex align-items-center color-nav me-3 cart-span-one"
                      >
                        <CgShoppingCart className='me-1 fs-2' />
                        <div>
                          <p><b><span>{totalProducts}</span></b></p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
