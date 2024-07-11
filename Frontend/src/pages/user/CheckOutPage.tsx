import React from 'react'
import Footer from '../../components/user/Footer/Footer';
import Checkout from '../../components/user/Checkout';
import Navbar from '../../components/user/Navbar/navbar';


function CheckoutPage() {
  return (
    <div >
      <Navbar />
      <Checkout/>
      <Footer/>
    </div>
  )
}

export default CheckoutPage