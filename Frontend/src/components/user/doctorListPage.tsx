import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_API } from '../../constants';
import axios from 'axios';
import { DoctorInterface } from '../../types/doctoInterface';
import { DepartmentInterface } from '../../types/departmentInterface';
import axiosJWT from '../../utils/axiosService';

const DoctorListingPage: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorInterface[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [departments, setDepartments] = useState<DepartmentInterface[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosJWT.get(`${USER_API}/department/list`);
        const listedDepartments = response.data.departments.filter((dept: DepartmentInterface) => dept.isListed);
        setDepartments(listedDepartments);
        return listedDepartments;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axiosJWT.get(`${USER_API}/doctors`);
        const approvedDoctors = response.data.doctors.filter((doctor: DoctorInterface) => doctor.isApproved );
        return approvedDoctors;
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    const fetchData = async () => {
      const listedDepartments = await fetchDepartments();
      const approvedDoctors = await fetchDoctors();

      const departmentMap: { [key: string]: DepartmentInterface } = {};
      listedDepartments.forEach((dept: DepartmentInterface) => {
        departmentMap[dept._id] = dept;
      });

      const doctorsWithDepartments = approvedDoctors
  .filter((doctor: DoctorInterface) => departmentMap[doctor.department as string])
  .map((doctor: DoctorInterface) => {
    return {
      ...doctor,
      department: departmentMap[doctor.department as string]
    };
  });

      setDoctors(doctorsWithDepartments);
    };

    fetchData();
  }, []);

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value);
  };

  const filteredDoctors = selectedDepartment
    ? doctors.filter(doctor => (doctor.department as unknown as DepartmentInterface)._id === selectedDepartment)
    : doctors;

  return (
    <div className="w-full mx-auto px-4 py-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">Find a Doctor</h1>
      <div className="flex items-center mb-4 pl-20">
        <div className="border border-gray-500 shadow-lg rounded-md w-80">
          <select className="rounded-md px-4 py-2 w-full" value={selectedDepartment} onChange={handleDepartmentChange}>
            <option value="">All Departments</option>
            {departments.map(department => (
              <option key={department._id} value={department._id}>{department.departmentName}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid px-20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredDoctors.map(doctor => (
          <Link key={doctor._id} to={`/user/doctor/${doctor._id}`}>
            <div className="doctor-card bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-xl p-4 sm:p-6">
              <div className="flex justify-center items-center">
                <img src={doctor.profileImage} alt="Doctor" className="h-36 w-36 object-cover rounded-full" />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-xl font-bold mb-2">Dr. {doctor.doctorName}</h3>
                <p className="text-gray-600 font-semibold mb-2">{(doctor.department as unknown as DepartmentInterface)?.departmentName}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DoctorListingPage;
