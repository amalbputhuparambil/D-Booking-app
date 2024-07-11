import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import doctor from '../../assets/images/doctor.jpg';
import Logo1 from '../../assets/images/quickdoc.png';
import { DOCTOR_API } from '../../constants';
import showToast from "../../utils/toaster";
import { validateSignUp } from "../../utils/validation";

const Signup: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber:"",
      password: "",
      confirmPassword: "",
    },
    validate: validateSignUp,
    onSubmit: ({  name: doctorName,phoneNumber, email, password }) => {
      setIsSubmitting(true);
      axios
      .post(DOCTOR_API + "/register", { doctorName,phoneNumber, email, password })
        .then(({ data }) => {
          showToast(data.message, "success");
          setTimeout(() => {
            navigate("/doctor/login");
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
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="relative flex-shrink-0 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
      <div className="absolute inset-0 bg-green-700 opacity-25"></div>
      <h1 className="absolute top-24 left-8 font-semibold text-4xl text-white leading-snug"> 
      Streamline Your Schedule,
        <br/>Empower Your Practice!<br/>
      Be a part of <br/>
      <img src={Logo1} alt="Quick Doc Logo" className="h-14 mr-2 inline-block" />
      
       <span className = "text-5xl">QuickDoc Community</span>
      </h1>
        <img
          src={doctor}
          alt="advertisement table image"
          className="w-full h-full object-cover"
        />
         
      </div>
      <div className="bg-white mb-20 w-full md:max-w-md lg:max-w-full md:mx-auto  md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
            Sign Up
          </h1>
          <form className="mt-6" onSubmit={formik.handleSubmit}>
            <div>
              <label className="block text-gray-700"> Name</label>
              <input
                type="text"
                placeholder="Enter Doctor name"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 mt-2 border focus:border--500 focus:bg-white focus:outline-none "
                autoFocus
                {...formik.getFieldProps("name")}
              />
              {formik.errors.name && formik.touched.name && (
                <div className="text-red-500">{formik.errors.name}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="text"
                placeholder="Enter Email Address"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 mt-2 border focus:border--500 focus:bg-white focus:outline-none"
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>

            <div >
              <label className="block text-gray-700"> PhoneNumber</label>
              <input
                type="text"
                placeholder="Enter Phone number"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 mt-2 border focus:border--500 focus:bg-white focus:outline-none"
                {...formik.getFieldProps("phoneNumber")}
              />
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <div className="text-red-500">{formik.errors.phoneNumber}</div>
              )}
            </div>

            <div >
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 mt-2 border focus:border--500 focus:bg-white focus:outline-none"
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password && formik.touched.password && (
                <div className="text-red-500">{formik.errors.password}</div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 mt-2 border focus:border--500 focus:bg-white focus:outline-none"
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
              className="w-full block bg-green-600 hover:bg-green-500 transition duration-300 focus:bg-green-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
              disabled={isSubmitting}
            >
              Signup
            </button>
          </form>
          <p className="mt-8">
            Have an account?
            <Link
              to={"/doctor/login"}
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;