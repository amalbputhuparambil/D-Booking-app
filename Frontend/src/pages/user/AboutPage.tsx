import React from 'react';
import Footer from '../../components/user/Footer/Footer';
import Navbar from '../../components/user/Navbar/navbar';
import AboutUsPage from '../../components/user/aboutus';



const AboutPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <AboutUsPage/>
      <Footer />
    </>
  );
};

export default AboutPage;