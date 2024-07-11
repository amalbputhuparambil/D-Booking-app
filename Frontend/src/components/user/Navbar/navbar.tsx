import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logo.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/reducer/reducer';
import showToast from '../../../utils/toaster';
import { clearUser } from '../../../redux/slices/UserSlice';
import { removeItemFromLocalStorage } from '../../../utils/setnget';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const user = useSelector((state: RootState) => state.UserSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    removeItemFromLocalStorage("access_token");
    removeItemFromLocalStorage("refresh_token");
    showToast("Logged out successfully", "success");
    navigate('/user/login');
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src={logo} alt="Quick Doc Logo" className="h-10" />
              <span className="self-center text-4xl font-semibold whitespace-nowrap dark:text-white">Quick Doc</span>
            </Link>
          </div>
          <button
            className="block md:hidden p-2 w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className={`w-full md:flex md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link to="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" aria-current="page">Home</Link>
              </li>
              <li>
                <Link to="/user/doctor" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Doctors</Link>
              </li>
              <li>
                <Link to="/user/aboutus" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About us</Link>
              </li>
              
              <li>
                <Link to="/user/contact" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contact us</Link>
              </li>
              {user.isAuthenticated && user.role === 'user' && (
                <>
                  <li className="relative">
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Profile
                    </button>
                    {isProfileDropdownOpen && (
                      <ul className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                        <li>
                          <Link to="/user/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                        </li>
                        <li>
                          <Link to="/user/appoinmentlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Appointments</Link>
                        </li>
                        <li>
                          <Link to="/user/wallet" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Wallet</Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-white px-3 py-2 text-sm font-medium bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 rounded-md ml-2"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
              {!user.isAuthenticated && (
                <Link
                  to="/user/login"
                  className="text-white px-3 py-2 text-sm font-medium bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 rounded-md ml-2"
                >
                  Login to QuickDoc
                </Link>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <hr className="border-gray-200 dark:border-gray-700 drop-shadow-lg" />
    </>
  );
};

export default Navbar;
