import React from 'react';
import Footer from '../../components/user/Footer/Footer';
import Navbar from '../../components/user/Navbar/navbar';
import AppointmentBookingPage from '../../components/user/bookingPage';



const DoctorList: React.FC = () => {
  return (
    <>
      <Navbar />
      <AppointmentBookingPage/>
      <Footer />
    </>
  );
};

export default DoctorList;