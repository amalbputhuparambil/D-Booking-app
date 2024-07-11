import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { USER_API } from "../../constants";
import "../../index.css";
import axios from "axios";
import { DoctorInterface } from "../../types/doctoInterface";
import { DepartmentInterface } from "../../types/departmentInterface";
import { BannerInterface } from "../../types/BannerInterface";
import showToast from "../../utils/toaster";

const Body: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorInterface[]>([]);
  const [departments, setDepartments] = useState<{ [key: string]: string }>({});
  const [hoveredDoctorId, setHoveredDoctorId] = useState<string | null>(null);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [banners, setBanners] = useState<BannerInterface[]>([]);
  useEffect(() => {
    const fetchDoctorsAndDepartments = async () => {
      try {
        // Fetch departments
        const deptResponse = await axios.get(`${USER_API}/department/list`);
        const listedDepartments = deptResponse.data.departments.filter(
          (dept: DepartmentInterface) => dept.isListed
        );
        const departmentMap = listedDepartments.reduce(
          (acc: { [key: string]: string }, dept: DepartmentInterface) => {
            acc[dept._id] = dept.departmentName;
            return acc;
          },
          {}
        );

        // Fetch doctors
        const docResponse = await axios.get(`${USER_API}/doctors`);
        const approvedDoctors = docResponse.data.doctors.filter(
          (doctor: DoctorInterface) => doctor.isApproved
        );

        // Filter doctors based on department listing
        const doctorsWithDepartments = approvedDoctors.filter(
          (doctor: DoctorInterface) =>
            departmentMap[doctor.department as string]
        );

        // Set state
        setDepartments(departmentMap);
        setDoctors(doctorsWithDepartments);
      } catch (error) {
        console.error("Error fetching doctors or departments:", error);
      }
    };

    fetchDoctorsAndDepartments();
  }, []);

  useEffect(() => {
    axios
      .get(USER_API + "/banners")
      .then(({ data }) => setBanners(data.banners))
      .catch(() =>
        console.log("error in the advertisement comming , go nd check ")
      );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setcurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, banners.length]);

  const handleMouseEnter = (doctorId: string) => {
    setHoveredDoctorId(doctorId);
  };

  const handleMouseLeave = () => {
    setHoveredDoctorId(null);
  };

  return (
    <>


{banners.length > 0 && (
      <section className="home py-10 mt-20 bg-white overflow-hidden h-80 pt-2 ">
        <div
          className="container flex flex-col bg-white h-72 md:flex-row items-center justify-center mx-auto px-10 md:px-12"
          key={currentIndex}
        >
          <div className="lg:w-2/5 flex items-center justify-center bg-white ml-20 pl-20">
            <img
              src={banners[currentIndex]?.image}
              alt="Banner image"
              className="border-t border-b border-l border-gray-400"
              style={{ width: "440px", height: "192px", objectFit: "cover" }} // Adjust dimensions as necessary
            />
          </div>
          <div className="lg:w-1/2 flex flex-col justify-center bg-white  mr-20 pr-20 pl-4 h-48 border-t border-b border-r border-gray-400">
            <h1 className="text-2xl md:text-4xl text-gray-800 font-semibold mb-4">
              {banners[currentIndex]?.title}
            </h1>
            <p className="text-xl font-normal  text-gray-500 font-medium mb-4">
              {banners[currentIndex]?.description}
            </p>
            <div className="flex items-center justify-between mb-2 mt-6">
              <p className="text-sm text-gray-600 font-medium">Add</p>
              <Link
                to={`/${banners[currentIndex]?.advertisementUrl}`}
                className="text-green-700 text-xl text-semibold"
              >
                Learn more {">"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      )}

      <div className="bg-blue-100 py-18 px-6 sm:px-8 lg:px-12  rounded-xl w-full py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start max-w-7xl mx-auto">
          <div className="md:w-1/2 mb-8 md:mb-0 md:mr-8">
            <h1 className="text-4xl font-semibold mb-4 text-gray-700 px-10 py-4 ">
              Solutions for <br />
              every specialty
            </h1>
            <p className="text-2xl  px-10 text-gray-700">
              Find out what QuickDoc can do <br /> to support your practice and
              your team.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4 ">
            <div className="flex flex-col items-center px-6 py-6 ml-20 bg-white rounded-lg shadow ">
              <div className="text-green-700 text-4xl mb-4">
                {/* <img src="https://practices.hotdoc.com.au/wp-content/uploads/2022/10/HR-Icons-WFH.png" alt="img" className ="w-8 h-8" /> */}

                {/* <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" height="48" viewBox="0 0 512 512" width="48"><path clip-rule="evenodd" d="m352.254.003-.002-.003-192.504.001-.003.003v159.744l-159.747.001v.004 192.499h.005 159.742l.001 159.747.001.001 192.507-.001h.001v-159.747l159.747-.001-.001-192.503h-159.746z" fill-rule="evenodd"></path></svg>
                 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  height="48"
                  viewBox="0 0 512 512"
                  width="48"
                >
                  <path
                    clipRule="evenodd"
                    fill="#006400"
                    d="m352.254.003-.002-.003-192.504.001-.003.003v159.744l-159.747.001v.004 192.499h.005 159.742l.001 159.747.001.001 192.507-.001h.001v-159.747l159.747-.001-.001-192.503h-159.746z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="text-lg font-semibold">GP</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow mr-20">
              <div className="text-green-700 text-4xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  height="48"
                  viewBox="0 0 511.657 511.657"
                  width="48"
                >
                  <path
                    fill="#004d00"
                    d="m387.044 390.636c-27.829-64.723-129.956-71.031-147.167-4.381-.093.359-.173.722-.241 1.087-5.036 27.197-1.047 43.689 2.157 56.941 3.4 14.059 5.646 23.346-3.489 45.205-4.395 10.515 3.332 22.169 14.763 22.169h96.107c8.836 0 16-7.163 16-16v-23.92c0-13.542 30.877-42.8 22.77-78.34-.215-.945-.516-1.87-.9-2.761z"
                  ></path>
                  <path
                    fill="#004d00"
                    d="m436.113 273.185c-12.15-18.103-39.066-18.149-51.247 0-19.311 28.776-19.312 66.326 0 95.104 12.149 18.102 39.065 18.151 51.247 0 19.311-28.775 19.311-66.329 0-95.104z"
                  ></path>
                  <path
                    fill="#004d00"
                    d="m331.126 314.668c26.614-17.127 49.634-48.66 55.981-76.682 5.937-26.209-9.98-52.616-36.237-60.119-95.891-27.394-177.676-76.278-232.71-158.959-5.627-8.453-17.563-9.556-24.663-2.418l-83.551 83.99c-7.982 8.024-5.323 21.609 5.112 26.021 97.951 41.415 173.108 97.941 229.765 172.808 20.259 26.769 58.174 33.46 86.303 15.359z"
                  ></path>
                  <path
                    fill="#004d00"
                    d="m453.614 510.607c-10.204 0-17.801-9.409-15.657-19.369l33.135-153.961c11.739-53.484-8.703-108.351-51.838-141.714l-215.8-166.906c-6.99-5.406-8.274-15.455-2.868-22.445 5.407-6.99 15.456-8.273 22.445-2.867l215.799 166.906c53.139 41.099 77.846 108.606 63.531 173.823l-33.121 153.896c-1.615 7.505-8.249 12.637-15.626 12.637z"
                  ></path>
                  <path
                    fill="#004d00"
                    d="m198.582 511.657c-9.047 0-16.301-7.48-16.001-16.529l4.363-131.798c.521-15.742-6.587-31.081-19.016-41.03l-156.637-125.388c-6.898-5.522-8.014-15.592-2.492-22.49s15.591-8.015 22.49-2.492l156.638 125.389c20.265 16.223 31.854 41.296 31 67.07l-4.363 131.798c-.287 8.651-7.391 15.47-15.982 15.47z"
                  ></path>
                </svg>
              </div>
              <div className="text-lg font-semibold">Allied health</div>
            </div>

            <div className="col-span-2 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
                <div className="text-green-700 text-4xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_2"
                    height="48"
                    viewBox="0 0 64 64"
                    width="48"
                    data-name="Layer 2"
                  >
                    <path
                      fill="#004d00"
                      d="m20.93 61c2.29 0 3-3.53 4.08-8.42 1.26-5.91 2.82-13.26 7-13.26s5.73 7.35 7 13.26c.99 4.89 1.77 8.42 4.06 8.42 4.16 0 8.71-6.58 11.58-16.76 2.14-7.62 4-16.1 3.23-26.48-.64-8.28-7.34-14.76-15.27-14.76a15.22 15.22 0 0 0 -7.89 2.2 4.84 4.84 0 0 1 -1.45.6c.31.29.59.57.87.85.61.61 2.82 1.57 6.15 1.5v2c-.1 0-5.39.15-7.61-2.09a18.65 18.65 0 0 0 -3.4-2.86 15.22 15.22 0 0 0 -7.89-2.2c-7.93 0-14.63 6.48-15.27 14.76-.79 10.38 1.09 18.86 3.23 26.48 2.87 10.18 7.42 16.76 11.58 16.76zm.46-54v2c-5.3 0-9 4.78-9.29 9.22l-2-.16c.42-5.32 4.9-11.06 11.29-11.06z"
                    ></path>
                  </svg>
                </div>
                <div className="text-lg font-semibold">Dental</div>
              </div>

              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
                <div className="text-green-700 text-4xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Capa_1"
                    height="48"
                    viewBox="0 0 512.039 512.039"
                    width="48"
                  >
                    <path
                      fill="#004d00"
                      d="m255.874 67.497c-111.609-97.618-253.518-11.848-255.845 104.427-.593 29.633 7.961 58.498 24.988 85.109h110.364l19.63-32.718c5.7-9.499 19.494-9.805 25.517-.335l41.417 65.083 60.373-127.451c5.265-11.121 20.956-11.474 26.763-.69l51.752 96.111h125.898c93.262-145.76-91.055-311.811-230.857-189.536z"
                    ></path>
                    <path
                      fill="#004d00"
                      d="m338.667 279.144-41.936-77.881-59.301 125.19c-5.045 10.651-19.884 11.576-26.211 1.632l-42.97-67.523-11.513 19.188c-2.711 4.518-7.593 7.282-12.862 7.282h-95.128c2.982 3.121-12.911-12.74 196.548 195.634 5.85 5.821 15.307 5.822 21.158 0 206.236-205.168 193.572-192.519 196.548-195.634h-111.126c-5.519.001-10.591-3.029-13.207-7.888z"
                    ></path>
                  </svg>
                </div>
                <div className="text-lg font-semibold">Specialist</div>
              </div>

              {/* <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
              <div className="text-green-700 text-4xl mb-4">👁️</div>
              <div className="text-lg font-semibold">Optometry</div>
            </div> */}

              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
                <div className="text-green-700 text-4xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    className="w-12 h-12 text-green-700"
                  >
                    <g>
                      <g>
                        <path
                          d="M508.177,245.995C503.607,240.897,393.682,121,256,121S8.394,240.897,3.823,245.995c-5.098,5.698-5.098,14.312,0,20.01   C8.394,271.103,118.32,391,256,391s247.606-119.897,252.177-124.995C513.274,260.307,513.274,251.693,508.177,245.995z M256,361   c-57.891,0-105-47.109-105-105s47.109-105,105-105s105,47.109,105,105S313.891,361,256,361z"
                          fill="#004d00"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path
                          d="M271,226c0-15.09,7.491-28.365,18.887-36.53C279.661,184.235,268.255,181,256,181c-41.353,0-75,33.647-75,75   c0,41.353,33.647,75,75,75c37.024,0,67.668-27.034,73.722-62.358C299.516,278.367,271,255.522,271,226z"
                          fill="#004d00"
                        />
                      </g>
                    </g>
                  </svg>
                </div>
                <div className="text-lg font-semibold">Optometry</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />

     

      <div className="bg-gradient-to-r bg-gray-100 py-10 px-6 sm:px-8 lg:px-12 m-10 rounded-xl">
        <h1 className="text-4xl font-bold text-green-700 text-center mb-10">
          Our Doctors
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-20 justify-center border-green">
          {doctors.map((doctor) => (
            <Link key={doctor._id} to={`/user/doctor/${doctor._id}`}>
              <div
                onMouseEnter={() => handleMouseEnter(doctor._id)}
                onMouseLeave={handleMouseLeave}
                className={`doctor-card bg-green-800 rounded-lg shadow-lg cursor-pointer transition-transform transform ${
                  hoveredDoctorId && hoveredDoctorId !== doctor._id
                    ? "blur-md"
                    : ""
                }`}
              >
                <div className="flex justify-center items-center h-64 overflow-hidden rounded-t-lg relative">
                  <img
                    src={doctor.profileImage}
                    alt="Doctor"
                    className="w-full h-full object-cover absolute"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-2xl font-bold text-center text-white">
                    Dr. {doctor.doctorName}
                  </h2>
                  <p className="text-white font-semibold mb-2 text-center">
                    {departments[doctor.department as string]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Body;
