import React from "react";
import Header from "../../components/admin/HeadernSidebar/Header";
import SideBar from "../../components/admin/HeadernSidebar/Sidebar";
import Banner from "../../pages/admin/Banners";

const Home = () => {
  return (
     <div className="flex h-screen">
      <SideBar />
      <div className="flex flex-col w-full">
      <Header />
        <div className="p-6 px-20">
          <Banner />
          
        </div>
      </div>
    </div>
  );
};

export default Home;