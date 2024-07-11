import React from 'react';
// import {FcGoogle} from 'react-icons/fc';
import {useFormik} from 'formik';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { validateSignUp } from "../../utils/validation";
import showToast from "../../utils/toaster";
import { setItemToLocalStorage } from "../../utils/setnget";
import { USER_API } from "../../constants";
import img from '../../assets/images/login_img_1.jpeg'



const Register: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  
    const formik = useFormik({
      initialValues: {
        name: "",
        email: "",
        phoneNumber : "",
        password: "",
        confirmPassword: "",
      },
      validate: validateSignUp,
      onSubmit: ({ name, email,phoneNumber, password }) => {
        setIsSubmitting(true);
        axios
          .post(USER_API + "/register", { name, email,phoneNumber, password })
          .then(({ data }) => {
            console.log(data);
            showToast(data.message, "success");
            setTimeout(() => {
              setItemToLocalStorage("userId", data.newUser._id);
              navigate("/user/verify_otp");
            }, 1000);
          })
          .catch(({ response }) => {
            const { message } = response.data;
            setIsSubmitting(false);
            showToast(message, "error");
          });
      },
    });
  
    return (
      <>
      <div 
      className="flex items-center justify-center h-screen bg-cover bg-center" 
      style={{ backgroundImage: `url(${img})` }}
    >
        <div className="flex">
          <div className="w-96 p-8 bg-gray-100 bg-opacity-50 rounded-lg shadow-lg ml-8">
            <h2 className="font-bold text-black-400 text-3xl mb-5 ml-28">
            Sign in 
            </h2>
            {/* <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2> */}
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mr-72">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-green-500"
                  {...formik.getFieldProps("name")}
                />
                 {formik.errors.name && formik.touched.name && (
                    <div className="text-red-500">{formik.errors.name}</div>
                  )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mr-72">
                  Email:
                </label>
                <input
                  type="text"
                  id="email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-green-500"
                  {...formik.getFieldProps("email")}
                />
                {formik.errors.email && formik.touched.email && (
                    <div className="text-red-500">{formik.errors.email}</div>
                  )}
              </div>

              <div className="mb-4">
                    <label htmlFor="phoneNumber" className="block text-gray-700 mr-72">
                    Phonenumber:
                    </label>
                    <input
                          type="text"
                          id="phoneNumber" // Change the id to "phoneNumber"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-green-500"
                         {...formik.getFieldProps("phoneNumber")} // Change the name to "phoneNumber"
                     />
                     {formik.errors.phoneNumber && formik.touched.phoneNumber && ( // Change the name to "phoneNumber"
                     <div className="text-red-500">{formik.errors.phoneNumber}</div>
                     )}
               </div>


              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mr-60">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-green-500"
                  {...formik.getFieldProps("password")}
                />
                {formik.errors.password && formik.touched.password && (
                    <div className="text-red-500">{formik.errors.password}</div>
                  )}
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mr-44">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-green-500"
                  {...formik.getFieldProps("confirmPassword")}
                />
                {formik.errors.confirmPassword &&
                    formik.touched.confirmPassword && (
                      <div className="text-red-500">
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-600 text-white ml-28 font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                
              >
                Register
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-700 ml-24">
              Already have an account?
              <Link to="/user/login" className="text-blue-500  text-sm  underline">
                Login
              </Link>
            </p>
            {/* google */}
          </div>
        </div>
      </div>
      
      </>
    );
  };
  

export default Register
