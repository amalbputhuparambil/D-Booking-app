import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { USER_API } from '../../constants';
import { clearAppointmentData, setAppointmentData } from '../../redux/slices/bookingSlice';
import axiosJWT from '../../utils/axiosService';
import showToast from '../../utils/toaster';
import {  useSelector } from "react-redux";
import { RootState } from "../../redux/reducer/reducer";

const AppointmentBookingPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate=useNavigate()
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const userId = useSelector((state: RootState) => state.UserSlice.id);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    patientName: '',
    patientAge: '',
    patientGender: "",
    patientNumber: '',
    patientProblem: '',
  });
  const [existingPatientDetails, setExistingPatientDetails] =
  useState<any>(null);

  // State to track whether time slot and package are selected
  const [isTimeSlotSelected, setIsTimeSlotSelected] = useState(false);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axiosJWT.get(`${USER_API}/doctor/${id}`);
        setDoctor(response.data.doctor);
        // Fetch scheduled dates inside fetchDoctorDetails
        try {
          const datesResponse = await axiosJWT.get(`${USER_API}/time-slots/${id}/dates`);
          // Parse dates to format them as needed
          const formattedDates: string[] = datesResponse.data.dateSlots.map((date: any) => {
            const splittedDate = date.date.split('T')[0]; // Split date and time, and take only the date part
            return splittedDate;
          });
          const uniqueDates: string[] = Array.from(new Set(formattedDates));
          setDates(uniqueDates);
        } catch (error) {
          console.error('Error fetching scheduled dates:', error);
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleBookAppointment = () => {
    // Check if both time slot and package are selected
    if (selectedTimeSlot ) {
      setIsModalOpen(true);
    } else {
      // Display error toast if either time slot or package is not selected
      showToast('Please select both time slot and package.', 'error');
    }
  };

  const handleModalClose = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleAppointmentConfirmation = async () => {
    try {
      const { patientName, patientAge, patientNumber,patientGender, patientProblem } = patientDetails;

      // Validation checks
      const nameRegex = /^[A-Z][a-zA-Z]+$/; // Regex for name validation
      const ageRegex = /^\d+$/; // Regex for age validation
      const numberRegex = /^\d{10}$/; // Regex for phone number validation

      // Validate patient name
      if (!patientName || !nameRegex.test(patientName)) {
        showToast('Please enter a valid name (first letter capital, letters only).', 'error');
        return;
      }

      // Validate patient age
      if (!patientAge || !ageRegex.test(patientAge) || parseInt(patientAge) < 3) {
        showToast('Please enter a valid age (numeric value, at least 3 years old).', 'error');
        return;
      }

       // Validate patient number
       if (!patientGender ) {
        showToast('Please Select a gender ', 'error');
        return;
      }

      // Validate patient number
      if (!patientNumber || !numberRegex.test(patientNumber)) {
        showToast('Please enter a valid phone number (10 digits, numbers only).', 'error');
        return;
      }

      
      // Validate patient problem
      if (!patientProblem.trim()) {
        showToast('Please enter the patient\'s problem.', 'error');
        return;
      }

      const appointmentData = {
        doctorId: id || "",
        // patientDetails: existingPatientDetails || patientDetails, 
        doctorName: doctor.doctorName,
        doctorImage : doctor.profileImage,
        fee: 200, 
        paymentStatus: "Pending",
        appoinmentStatus: "Booked",
        appoinmentCancelReason: "",
        timeSlot: selectedTimeSlot.slotTime || "",
        date: selectedDate,
        patientName: patientName,
        patientAge: parseInt(patientAge, 10),
        patientGender:patientGender,
        patientNumber: patientNumber,
        patientProblem: patientProblem,
      };
      console.log('appointmentData data:', appointmentData);
      

      // const response = await axiosJWT.post(`${USER_API}/book-appoinment`, appointmentData);
      // console.log('Appointment booked successfully:', response.data);
      dispatch(clearAppointmentData())
      dispatch(setAppointmentData(appointmentData))
      navigate(`/user/checkout/${doctor?._id}`)
      setIsModalOpen(false);
      // showToast('Appointment booked successfully.', 'success');
    } catch (error) {
      console.error('Error booking appointment:', error);
      showToast('Error booking appointment. Please try again later.', 'error');
    }
  };

 

  const handleTimeSlotSelection = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setIsTimeSlotSelected(true); // Update time slot selection state
  };

  const handleDateSelection = (date: string) => {
    // Deselect the date if it's already selected
    if (selectedDate === date) {
      setSelectedDate('');
      setSelectedDate(date);
    } else {
      setSelectedDate(date);
      setIsTimeSlotSelected(false); // Reset time slot selection when date changes
      fetchTimeSlots(date);
    }
  };

  const fetchTimeSlots = async (selectedDate: string) => {
    try {
      const response = await axiosJWT.get(`${USER_API}/time-slots/${id}/dates`, {
        params: {
          date: selectedDate,
        },
      });
      setTimeSlots(response.data.timeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleAddDetails = () => {
    setIsDetailsModalOpen(true);
  };

  const handleSelectExisting = (patientDetails: any) => {
    setIsDetailsModalOpen(true);
    setPatientDetails(patientDetails);
    setIsModalOpen(false);
  };

  const handleAddPatientDetails = () => {
    if (
      patientDetails.patientName &&
      patientDetails.patientAge &&
      patientDetails.patientGender&&
      patientDetails.patientNumber&&
      patientDetails.patientProblem

    ) {
      setIsDetailsModalOpen(false);
      setIsModalOpen(false);
      setExistingPatientDetails(patientDetails);
    } else {
      showToast("Please fill in all fields", "error");
    }
  };

 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>

      {doctor && (
        <div>
          {/* Doctor Profile */}
          <div className="flex items-center mb-8">
            <img src={doctor.profileImage} alt={doctor.doctorName} className="w-28 h-28 rounded-full mr-4" />
            <div>
              <h2 className="text-xl font-bold">{doctor.doctorName}</h2>
              <p>{doctor?.department?.departmentName}</p>
              <p className="text-green-600 font-semibold"> Verified </p>
            </div>
          </div>

          {/* Scheduled Dates */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Scheduled Dates</h2>
            <div className="grid grid-cols-4 gap-4">
              {dates &&
                dates.map((date: string, index: number) => (
                  <div
                    key={index}
                    className={`bg-gray-100 rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer ${
                      selectedDate === date && 'border border-blue-500'
                    }`}
                    onClick={() => handleDateSelection(date)}
                  >
                    <div>
                      <input type="radio" id={`dateSlot${index}`} name="dateSlot" value={date} />
                      <label htmlFor={`dateSlot${index}`} className="text-lg font-bold">
                        {date}
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Available Time Slots</h2>
            <div className="grid grid-cols-9 gap-4">
              {timeSlots &&
                timeSlots.map((slot: any, index: number) => (
                  <div
                    key={index}
                    className={`bg-gray-100 rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer ${
                      selectedTimeSlot === slot.slotTime && 'border border-blue-500'
                    }`}
                    onClick={() => handleTimeSlotSelection(slot)}
                  >
                    <div>
                      <input type="radio" id={`timeSlot${index}`} name="timeSlot" value={slot.slotTime} />
                      <label htmlFor={`timeSlot${index}`} className="text-lg font-bold">
                        {slot.slotTime}
                      </label>
                      <p className={slot.available ? 'text-green-700' : 'text-red-600'}>
                        {slot.available ? 'Available' : 'Not Available'}
                      </p>
                      {/* Render availability status */}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Select Package
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Select Package</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            </div>
          </div> */}

          {/* Book Appointment Button */}
          <div className="flex justify-between mb-4">
            <button onClick={handleAddDetails} className="bg-green-800 text-white py-2 px-4 rounded-lg">
              Book an Appointment
            </button>
          </div>

          

             {/* Modal for entering patient details */}
          {/* <Modal
            isOpen={isModalOpen}
            onRequestClose={handleModalClose}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              content: {
                position: "relative",
                top: "auto",
                left: "auto",
                right: "auto",
                bottom: "auto",
                width: "90%",
                maxWidth: "400px",
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                margin: "0 auto",
              },
            }}
          >
            <button
              onClick={handleModalClose}
              className="absolute top-0 right-0 m-4 bg-gray-400 p-2 rounded"
            >
              close
            </button>
            <h2 className="text-xl font-bold mb-4">Patient Details</h2>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 mb-4 cursor-pointer"
                  onClick={() => handleSelectExisting(booking)}
                >
                  <p>Name: {booking.patientName}</p>
                  <p>Age: {booking.patientAge}</p>
                  <p>Gender: {booking.patientGender}</p>
                </div>
              ))
            ) : (
              <p className="mb-4">No existing patient details</p>
            )}
            <button
              onClick={handleAddDetails}
              className="bg-blue-950 text-white py-2 px-4 rounded-lg mr-2"
            >
              Add Details +
            </button>
          </Modal> */}

          <Modal
            isOpen={isDetailsModalOpen}
            onRequestClose={() => setIsDetailsModalOpen(false)}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              content: {
                position: "relative",
                top: "auto",
                left: "auto",
                right: "auto",
                bottom: "auto",
                width: "90%",
                maxWidth: "400px",
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                margin: "0 auto",
              },
            }}
          >
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute top-0 right-0 m-4 bg-gray-400 p-2 rounded"
            >
              close
            </button>
            <h2 className="text-xl font-bold mb-4">Enter Patient Details</h2>
            <div className="mb-4">
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                name="patientName"
                value={patientDetails.patientName}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-lg px-4 py-2 w-full mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Age:</label>
              <input
                type="text"
                name="patientAge"
                value={patientDetails.patientAge}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-lg px-4 py-2 w-full mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Gender:</label>
              <select
                name="patientGender"
                value={patientDetails.patientGender}
                onChange={handleGenderChange}
                className="border border-gray-400 rounded-lg px-4 py-2 w-full mt-1"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>



            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block mb-2">
                Phone Number
              </label>
              <input
                type="text"
                required
                id="phoneNumber"
                name="patientNumber"
                value={patientDetails.patientNumber}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="problem" className="block mb-2">
                Problem
              </label>
              <input
                id="problem"
                required
                name="patientProblem"
                value={patientDetails.patientProblem}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <button onClick={handleAppointmentConfirmation} className="bg-green-700 text-white py-2 px-4 rounded-lg">
              Book Appointment
            </button>
          </Modal>


        </div>
      )}
    </div>
  );
};

export default AppointmentBookingPage;
