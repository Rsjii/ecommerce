// src/components/shopitems.jsx
import React from 'react';
import Prod from './prod';
import { PRODUCTS, PRODUCTS1 } from './products';

const ShopItems = ({ searchQuery }) => {
  // Combine all products
  const allProducts = [...PRODUCTS, ...PRODUCTS1];

  // Filter products based on the search query
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <Prod key={product.id} data={product} />
        ))
      ) : (
        <div className="col-12">
          <p className="text-center">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ShopItems;
