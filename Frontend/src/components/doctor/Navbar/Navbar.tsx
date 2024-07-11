import React, { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom'; 
import logo from '../../../assets/images/logo.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/reducer/reducer';
import showToast from '../../../utils/toaster';
import { clearDoctor } from '../../../redux/slices/DoctorSlice';
import { removeItemFromLocalStorage } from '../../../utils/setnget';


const Navbar: React.FC = () => {
  // Retrieve doctor information from Redux store
  const doctor = useSelector((state: RootState) => state.DoctorSlice);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const handleLogout = () => {
    dispatch(clearDoctor());
    removeItemFromLocalStorage("access_token")
    removeItemFromLocalStorage("refresh_token")
    navigate('/doctor/login');
    showToast("Logged out successfully","success");
  };

  return (
    <>
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link to="/doctor" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} alt="Quick Doc Logo" className="h-10" />
            <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">Quick Doc</span>
          </Link>
        </div>
        <button 
          className="block md:hidden p-2 w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
        <div className={`w-full md:flex md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link to="/doctor" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" aria-current="page">Home</Link>
            </li>
            <li>
              <Link to="/doctor/slot" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Slot</Link>
            </li>
            <li>
              <Link to="/doctor/patientList" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Patients</Link>
            </li>

            
            {/* <div className="flex items-center"> */}

      {doctor.isAuthenticated && doctor.role === 'doctor' ? (

            <>
            <li>
              <Link to="/doctor/profile" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">KYC</Link>
            </li>
            <li>
            <button onClick={handleLogout} className="text-white px-3 py-2 text-sm font-medium bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 rounded-md ml-2">Logout</button>
            </li>
            </>

     ) : (

      <Link to="/doctor/login" className="text-white px-3 py-2 text-sm font-medium bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 rounded-md ml-2">Login</Link>
     )}
          </ul>
        </div>
        
      </div>
    </nav>
    <hr className="border-gray-200 dark:border-gray-700" />
    </>
  );
}

export default Navbar;

