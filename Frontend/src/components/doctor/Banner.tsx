import React, { useState, useCallback,useEffect} from "react";
// import {doctorbanner} from '../../assets/images'

const names = ["Health", "Care","Lives", "Dream"];

const Banner:React.FC = () => {
  const [newName, setnewName] = useState("");
  const shuffle = useCallback(() => {
    const index = Math.floor(Math.random() * names.length);
    setnewName(names[index]);
  }, []);
  useEffect(() => {
    const intervalID = setInterval(shuffle, 3000);
    return () => clearInterval(intervalID);
  }, [shuffle]);
    return (
      <div className="w-full h-[90vh] flex flex-col md:flex-row justify-center items-center">
        <div className="w-full md:w-3/4 lg:w-1/2 bg-white flex flex-col justify-center items-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-700 mb-5 px-4 md:pl-10">Transforming&nbsp;
            <span className="text-green-700 text-4xl md:text-6xl lg:text-7xl">{ newName ? newName : "Peoples"}</span> </h1>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-700 mb-4 px-4 md:pl-10">Through Solutions</h2>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-auto flex justify-center items-center p-4 md:pl-20 ">
          <img 
            src="https://practices.hotdoc.com.au/wp-content/uploads/2023/12/QC-DoctorPatient-1200x1044.webp" 
            alt="Hero" 
            className="w-full h-auto sm:w-3/4 md:w-3/4 lg:w-4/5 xl:w-11/12 2xl:w-10/12" 
          />
        </div>
      </div>
    );
}

export default Banner