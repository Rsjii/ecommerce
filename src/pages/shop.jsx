// src/pages/shop.jsx
import React, { useState } from 'react';
import ShopItems from '../components/shopitems';
import Newsletter from '../components/newsletter';
import Hero from '../components/hero';

const Shop = () => {
  // State to manage the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <section className="shop-banner p-5 container-xxl text-center">
        <div className="shop-details">
          <h1 className="text-white"><b className="title-green">#100%</b> Off On All Products</h1>
          <p className="text-white fs-5">Make your orders we will deliver..</p>
        </div>
      </section>

      {/* Add search bar here */}
      <section className="search-bar p-3 container-xxl">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                aria-label="Search products"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="input-group-text" id="basic-addon2">
                {/* Optional: Add a search icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1-1.414 0L6.5 7.914a4 4 0 1 1 1.414-1.414l2.528 2.528a1 1 0 0 1 0 1.414z"/>
                  <path fillRule="evenodd" d="M12 6a6 6 0 1 0-12 0 6 6 0 0 0 12 0zM1 6a5 5 0 1 1 10 0 5 5 0 0 1-10 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products p-5 container">
        {/* Pass the searchQuery to ShopItems as a prop */}
        <ShopItems searchQuery={searchQuery} />
      </section>

      {/* Optional: Remove pagination if it's not functional or adjust accordingly */}
      {/* <section className="pagination justify-content-center">
        ...
      </section> */}

      <Hero />
      <Newsletter />
    </>
  );
};

export default Shop;
