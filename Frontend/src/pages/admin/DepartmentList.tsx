import React ,{useState}from 'react';
import AdminHeader from '../../components/admin/HeadernSidebar/Header';
import AdminSidebar from '../../components/admin/HeadernSidebar/Sidebar';
import useDepartments from '../../hooks/useDepartment';
import DepartmentData from '../../components/admin/departmentData';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DepartmentList : React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;
    const { departments } = useDepartments(); // Fetch all departments  once
  
    const totadepartments = departments.length;
    const totalPages = Math.ceil(totadepartments / usersPerPage);
  
    // Calculate users to be displayed on the current page
    const currentUsers = departments.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
  
    const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
  
    const handlePreviousPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

  // Using the usedoctors hook to fetch doctor data
 

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-col w-full">
        <AdminHeader />
        <div className="p-6">
        <ToastContainer/>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold mb-4 text-center w-full ">Department List</span>
          <Link to="/admin/addDepartment" className="ml-auto">
              <button className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 ">
                Add_Department
              </button>
            </Link>
            </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-3/4 mx-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-6 py-3 text-left">Sl.No</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">status</th>
                  <th className="px-6 py-3 text-left">Action</th>

                </tr>
              </thead>
              <tbody>
                {currentUsers.map((department,index) => {
                  return <DepartmentData departmentName={''} isListed={true} {...department} key={department._id} serialNo={(currentPage - 1) * usersPerPage + index + 1} />;
                })}
              </tbody>
            </table>
          </div>

 <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>


          
        </div>



      </div>

      
    </div>
  );
};

export default DepartmentList;
