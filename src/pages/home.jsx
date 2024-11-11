/* eslint-disable no-unused-vars */
import React from 'react'
// import { CgShoppingCart } from 'react-icons/cg'
import { Link } from 'react-router-dom';
import Featuredproducts from '../components/featuredproducts';
import Newarrivals from '../components/newarrivals'
// import banner from '../assets/images/banner/b17.jpg'
// import banner1 from '../assets/images/banner/b10.jpg'
// import blog1 from '../assets/images/blog/blog-1.jpg'
// import blog2 from '../assets/images/blog/blog-2.jpg'
// import blog3 from '../assets/images/blog/blog-3.jpg'
// import blog4 from '../assets/images/blog/blog-4.jpg'
import Newsletter from '../components/newsletter';
import Hero from '../components/hero';


const home = () => {
  return <>
  <section className="banner container-xxl">
            <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                  <div className='back-details'>
                  <h1>Super Value Deals</h1>
                  <p className='mb-3'>Save more today with us!</p>
                  <Link to='/shop' className='btn btn-primary' id='button-link'>Shop Now</Link>
                  </div>
              </div>
            </div>
  </section>
  <Hero />

  <section className="featured-products p-4 container-xxl  col-12 text-center">
    <div className="row justify-content-center" >
          <h1>Featured Products</h1>
          <p>All Weather New Modern Designs</p>
       <Featuredproducts />
       </div>
  </section>

  <section className="repair-services p-5 container-xxl">
        <div className="repair-details text-center align-items-center">
          <h5 className='mb-3 text-white'>Last Chance</h5>
          <h2 className='mb-3 text-white'>To get 70% Off on All Products And Accessories</h2>
          <Link to='/shop' className='btn btn-primary' id='button-link'>Explore Now</Link> 
    </div>
  </section>


  <section className="featured-products p-4 container-xxl col-12 text-center">
  
  <div className="row justify-content-center">
    <h1>New Arrivals</h1>
  <p>Your Best Designer Outfits</p>
       <Newarrivals />
       </div>
  </section>

    

  

  <Newsletter />
  </>;
}

export default home