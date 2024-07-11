import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosJWT from '../../utils/axiosService';
import { USER_API } from '../../constants';
import { FaCalendarAlt } from 'react-icons/fa';

interface Doctor {
  profileImage: string;
  department: string | { departmentName: string };
  doctorName: string;
  description: string;
}

const DoctorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axiosJWT.get(`${USER_API}/doctor/${id}`);
        setDoctor(response.data.doctor);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setError('Failed to fetch doctor details. Please try again later.');
      }
    };
    fetchDoctorDetails();
  }, [id]);

  const handleBookAppointment = () => {
    navigate(`/user/appoinment/${id}`);
  };

  const renderAppointmentButton = () => {
    return (
      <button
        onClick={handleBookAppointment}
        className="bg-green-600 text-white py-2 px-4 rounded-lg mt-4 flex items-center hover:bg-green-700 transition-colors duration-300"
      >
        <FaCalendarAlt className="mr-2" /> Book Appointment
      </button>
    );
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!doctor) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Doctor Details</h1>
      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8">
        {/* Left Section */}
        <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
          <img
            src={doctor.profileImage}
            alt="Doctor"
            className="h-96 w-96 rounded-lg shadow-md object-cover"
          />
        </div>
        {/* Right Section */}
        <div className="md:w-2/3 md:pl-8">
          <div className="bg-white p-6 rounded-lg mb-4 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {typeof doctor.department === 'string' ? doctor.department : doctor.department.departmentName}
            </h2>
            <p className="text-xl text-gray-700">{doctor.doctorName}</p>
            <p className="text-lg text-green-500 font-bold ">Verified</p>
            <p className="text-lg text-red-500 font-bold mb-4">Consultation Fee - $200</p>
            {renderAppointmentButton()}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">About</h3>
            <p className="text-lg text-gray-700">{doctor.description}</p>
          </div>
          

          
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
