import React from 'react';
import Footer from '../../components/user/Footer/Footer';
import Navbar from '../../components/user/Navbar/navbar';
import Profile from '../../components/user/Profile';




const DoctorList: React.FC = () => {
  return (
    <>
      <Navbar />
      <Profile/>
      <Footer />
    </>
  );
};

export default DoctorList;
