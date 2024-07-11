import React from 'react';
import { MdOutlineModeEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { BsWallet } from 'react-icons/bs'; 
import useProfile from "../../hooks/userProfile";

const Profile: React.FC = () => {
  const {
    profile,
    formData,
    imagePreview,
    handleInputChange,
    handleSubmit,
  } = useProfile();

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto py-10">
          <h2 className="text-4xl font-bold text-center text-green-700 mb-6">Profile</h2>
          <div className="bg-white rounded-lg shadow-md p-8 w-3/4 mx-auto flex flex-col items-center">
            
           

            {/* <form onSubmit={handleSubmit} className="w-full max-w-3xl"> */}
              <div className="grid grid-cols-3 gap-4">

              <div className="relative mb-4">
              <img 
                src={imagePreview || profile?.profilePicture || "https://picsum.photos/200/"} 
                alt="Profile" 
                className="w-40 h-40 rounded-full mx-auto mb-4"
              />
              <label htmlFor="profile-image" className="absolute bottom-0 right-0 transform translate-x-1/2 bg-green-700 text-white rounded-full p-2 cursor-pointer mr-10">
                <input type="file" id="profile-image" name="imageFile" className="hidden" onChange={handleInputChange} />
                <MdOutlineModeEdit className="h-5 w-5" />
              </label>
            </div>


                <div className="mb-4 pt-5">
                  <div className='pb-7'>
                  <label htmlFor="name" className="block text-gray-700 font-semibold">Name:</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 "
                  />
                  </div>

                  <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-semibold">Email:</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={profile?.email || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                </div>
                
                <div className="mb-4 pt-20 mt-7">
                  <label htmlFor="phone" className="block text-gray-700 font-semibold">Phone:</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phoneNumber" 
                    value={formData.phoneNumber || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-gray-700 font-semibold">Address:</label>
                  <input 
                    type="text" 
                    id="address" 
                    name="address" 
                    value={formData.address || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="age" className="block text-gray-700 font-semibold">Age:</label>
                  <input 
                    type="number" 
                    id="age" 
                    name="age" 
                    value={formData.age || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="dob" className="block text-gray-700 font-semibold">DOB:</label>
                  <input 
                    type="date" 
                    id="dob" 
                    name="dateofbirth" 
                    value={formData.dateofbirth || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="gender" className="block text-gray-700 font-semibold">Gender:</label>
                  <select 
                    id="gender" 
                    name="gender" 
                    value={formData.gender || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="marital_status" className="block text-gray-700 font-semibold">Marital Status:</label>
                  <select 
                    id="marital_status" 
                    name="marital_status" 
                    value={formData.marital_status || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="allergies" className="block text-gray-700 font-semibold">Allergies:</label>
                  <input 
                    type="text" 
                    id="allergies" 
                    name="allergies" 
                    value={formData.allergies || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="chronic_conditions" className="block text-gray-700 font-semibold">Chronic Conditions:</label>
                  <input 
                    type="text" 
                    id="chronic_conditions" 
                    name="chronicConditions" 
                    value={formData.chronicConditions || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="height" className="block text-gray-700 font-semibold">Height (cm):</label>
                  <input 
                    type="number" 
                    id="height" 
                    name="height" 
                    value={formData.height || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="weight" className="block text-gray-700 font-semibold">Weight (kg):</label>
                  <input 
                    type="number" 
                    id="weight" 
                    name="weight" 
                    value={formData.weight || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="emergency_contact_name" className="block text-gray-700 font-semibold">Emergency Contact Name:</label>
                  <input 
                    type="text" 
                    id="emergency_contact_name" 
                    name="emergencyContactName" 
                    value={formData.emergencyContactName || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="emergency_contact_relationship" className="block text-gray-700 font-semibold">Emergency Contact Relationship:</label>
                  <input 
                    type="text" 
                    id="emergency_contact_relationship" 
                    name="emergencyContactRelationship" 
                    value={formData.emergencyContactRelationship || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="emergency_contact_phone" className="block text-gray-700 font-semibold">Emergency Contact Phone:</label>
                  <input 
                    type="tel" 
                    id="emergency_contact_phone" 
                    name="emergencyContactPhoneNumber" 
                    value={formData.emergencyContactPhoneNumber || ""} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="mt-6 w-full bg-green-700 text-white rounded-md py-2 hover:bg-green-600 transition duration-300"
                onClick={handleSubmit} >
                Update Profile
              </button>
            {/* </form> */}
          </div>
          <Link to="/user/wallet" className="fixed bottom-8 right-8 bg-green-900 text-white rounded-full p-4 shadow-lg hover:bg-green-800">
            <BsWallet className="h-7 w-7" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Profile;
