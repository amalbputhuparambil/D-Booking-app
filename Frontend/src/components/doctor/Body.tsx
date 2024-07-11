import React from "react";
import { Link } from "react-router-dom";

const Body: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-gray-200 to-gray-200 py-10 px-4 sm:px-8 lg:px-12 m-4 sm:m-8 lg:m-10 rounded-xl">
      {/* <h1 className="text-2xl font-bold mb-4">Our Doctors</h1> */}
      <h1 className="text-4xl font-bold text-dark text-center mb-10 py-5"></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 justify-center pb-12">
        {/* Doctor Card 1 */}
        <Link to="/user/profile">
          <div className="bg-white rounded-lg shadow-lg items-center text-center flex flex-col doctor-card hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <img
              src="https://img.freepik.com/premium-vector/boy-girl-doing-id-registration_118167-6078.jpg?w=740"
              alt="Doctor"
              className="h-64 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2 text-center">
                KYC (Know Your Customer)
              </h2>
              {/* <p className="text-gray-600 font-semibold mb-2 text-center">Cardiology</p> */}
              <p className="text-gray-600 mb-4">
                Complete your KYC verification to unlock scheduling capabilities. Only verified doctors can manage time slots and appointments for efficient practice management.
              </p>
              <div className="text-center">
                {/* <button className="bg-green-700 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-green-600"> K Y C</button> */}
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow-lg items-center text-center flex flex-col doctor-card hover:shadow-xl transition-shadow duration-300 cursor-pointer">
          <img
            src="https://img.freepik.com/premium-vector/virtual-communication-flat-illustration-financial-consultation_203633-2107.jpg?w=740"
            alt="Doctor"
            className="h-64 object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2 text-center">Patient List</h2>
            {/* <p className="text-gray-600 font-semibold mb-2 text-center">Dermatologist</p> */}
            <p className="text-gray-600 mb-4 mx-2">
              View and manage your patient list to stay organized and provide timely care. Easily access patient information and appointments to streamline your practice.
            </p>
            <div className="text-center">
              {/* <button className="bg-green-700 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-green-600">Patients</button> */}
            </div>
          </div>
        </div>

        {/* Doctor Card 2 */}
        <div className="bg-white rounded-lg shadow-lg items-center text-center flex flex-col doctor-card hover:shadow-xl transition-shadow duration-300 cursor-pointer">
          <img
            src="https://img.freepik.com/free-vector/flat-design-time-management-concept_23-2148813012.jpg?w=740&t=st=1715330463~exp=1715331063~hmac=de49e1c2cb9511e6a8ba299991ace5cd753a560899fb945012678470ad3cb210"
            alt="Doctor"
            className="h-64 object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2 text-center">Time Slots</h2>
            {/* <p className="text-gray-600 font-semibold mb-2 text-center" >Orthopedics</p> */}
            <p className="text-gray-600 mb-4 mx-2">
              Keep your schedule up-to-date to provide the best service to your patients. Customize your availability effortlessly to suit your practice needs.
            </p>
            <div className="text-center">
              {/* <button className="items-center bg-green-700 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-green-600">Slots</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
