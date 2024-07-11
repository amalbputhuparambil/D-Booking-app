import React, { useState, lazy, useEffect, Suspense } from "react";
import dayGridPlugin  from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button } from 'primereact/button';
import Modal from "react-modal";
import { DOCTOR_API } from "../../constants";
import showToast from "../../utils/toaster";
import axiosJWT from "../../utils/axiosService";
const FullCalendar = lazy(() => import('@fullcalendar/react'));
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ScheduleAppointmentPage = () => {
  const [IsDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [timeInput, setTimeInput] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDoctorApproved, setIsDoctorApproved] = useState(false);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusResponse, timeSlotsResponse] = await Promise.all([
          axiosJWT.get(`${DOCTOR_API}/status`),
          fetchTimeSlots(),
        ]);

        setIsDoctorApproved(statusResponse.data.doctor.status === "approved");
        setTimeSlots(timeSlotsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const response = await axiosJWT.get(`${DOCTOR_API}/timeslots`);
      return response.data.timeSlots;
    } catch (error) {
      console.error("Error fetching time slots:", error);
      return [];
    }
  };

  const openDateTimeModal = () => {
    setIsDateTimeModalOpen(true);
  };

  const closeDateTimeModal = () => {
    setIsDateTimeModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeInput(e.target.value);
  };

  const handleTimeClick = (time: string, date: string) => {
    setSelectedTime(time);
    setSelectedDate(date);
    setIsDeleteModalOpen(true);
  };

  const handleUploadButtonClick = async () => {
    try {
      if (!startDate || !endDate) {
        showToast("Please select a valid date range.", "error");
        return;
      }

      const datesInRange = getDatesInRange(startDate, endDate);
      const promises = datesInRange.map(async (date) => {
        const response = await axiosJWT.post(`${DOCTOR_API}/schedule`, {
          slotTime: timeInput,
          date: date.toISOString().split("T")[0],
        });
        return response.data.newTimeSlot;
      });

      const newTimeSlots = await Promise.all(promises);
      closeDateTimeModal();
      setTimeSlots([...timeSlots, ...newTimeSlots]);
      showToast("Time slots added successfully.", "success");
    } catch (error: any) {
      showToast(error.response.data.message, "error");
      console.error("Error uploading time:", error);
    }
  };

  const handleDeleteTime = async () => {
    try {
      const selectedTimeSlot = timeSlots.find(
        (timeSlot) =>
          timeSlot.slotTime === selectedTime && timeSlot.date === selectedDate
      );
      if (!selectedTimeSlot) {
        console.error("Selected time slot not found");
        return;
      }

      const response = await axiosJWT.delete(
        `${DOCTOR_API}/deleteTime/${selectedTimeSlot._id}`
      );
      closeDateTimeModal();
      setTimeSlots(
        timeSlots.filter((timeSlot) => timeSlot._id !== selectedTimeSlot._id)
      );
      showToast(response.data.message, "success");
    } catch (error) {
      console.error("Error deleting time:", error);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour < 12 ? "AM" : "PM";
        const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const time = `${formattedHour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")} ${period}`;
        const nextHour = minute === 30 ? (hour === 12 ? 1 : hour + 1) : hour;
        const nextMinute = minute === 30 ? "00" : "30";
        const nextPeriod = nextHour < 12 ? "AM" : "PM";
        const nextFormattedHour =
          nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour;
        const nextTime = `${nextFormattedHour
          .toString()
          .padStart(2, "0")}:${nextMinute} ${nextPeriod}`;
        const label = `${time} - ${nextTime}`;
        options.push(
          <option key={time} value={time}>
            {label}
          </option>
        );
      }
    }
    return options;
  };

  const handleDateChange = (date: Date | null, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const formatDate = (isoDate: string | number | Date) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  const EnterDateAndTime = () => {
    if (isDoctorApproved) {
      openDateTimeModal();
    } else {
      alert("You need to be approved to be an approved doctor for adding slots.");
    }
  };

  const renderEventContent = (eventInfo : any) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center">
        <div className="h-2 w-2 bg-green-700 rounded-full mr-1"></div>
            <span>{eventInfo.event.title}</span>
      </div>
      <button  className = "lg:ml-5"onClick={() => handleTimeClick(eventInfo.event.extendedProps.slotTime, eventInfo.event.extendedProps.date)}>
        <FontAwesomeIcon icon={faTrash} className="text-red-500 ml-2" />
      </button>
    </div>
  );

  const calendarEvents = timeSlots.map((timeSlot) => ({
    title: `${timeSlot.slotTime}`,
    start: new Date(timeSlot.date),
    end: new Date(timeSlot.date),
    color: '#008000',
    extendedProps: {
      slotTime: timeSlot.slotTime,
      date: timeSlot.date   
    }
    
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Schedule Appointment
      </h1>
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <div className="flex flex-col items-center">
          {/* Calendar Section */}
          <div className="mb-8 w-full md:w-2/3 lg:w-3/4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              Add time and date for Appointments
            </h2>
            <div className="flex flex-col items-center">
              <button
                onClick={EnterDateAndTime}
                className="bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Add time and date
              </button>
            

          {/* Time Slots Section */}
          {/* <div className="bg-gray-50 p-6 rounded-lg shadow-inner w-full md:w-1/2">
            <div className="flex justify-between mb-4 items-center">
              <h2 className="text-xl font-semibold text-gray-800">Time Slot</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {timeSlots.map((timeSlot) => (
                <div
                  key={timeSlot._id}
                  className="flex justify-between items-center bg-white p-4 rounded shadow"
                >
                  <span className="text-lg">
                    {timeSlot.slotTime} - ({formatDate(timeSlot.date)})
                  </span>
                  <button
                    onClick={() =>
                      handleTimeClick(timeSlot.slotTime, timeSlot.date)
                    }
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-400 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div> */}


        </div>
      </div>

      {/* Modal for adding time and date */}
      <Modal
        isOpen={IsDateTimeModalOpen}
        onRequestClose={closeDateTimeModal}
        contentLabel="Enter Time Slot"
        ariaHideApp={false}
        className="flex items-center justify-center min-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 md:w-1/3 lg:w-1/4 z-60">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
            Add a Time Slot
          </h2>
          <div className="mb-4">
            <label
              htmlFor="timeInput"
              className="block text-gray-700 font-semibold mb-2"
            >
              Select Time:
            </label>
            <select
              id="timeInput"
              value={timeInput}
              onChange={handleTimeInputChange}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Select a time</option>
              {generateTimeOptions()}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="startDate"
              className="block text-gray-700 font-semibold mb-2"
            >
              Select Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate ? startDate.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                handleDateChange(e.target.value ? new Date(e.target.value) : null, "start")
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="endDate"
              className="block text-gray-700 font-semibold mb-2"
            >
              Select End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                handleDateChange(e.target.value ? new Date(e.target.value) : null, "end")
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex justify-between">
            <Button
              label="Upload"
              icon="pi pi-check"
              onClick={handleUploadButtonClick}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition duration-300"
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={closeDateTimeModal}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition duration-300"
            />
          </div>
        </div>
      </Modal>

      {/* Modal for deleting time slot */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDateTimeModal}
        contentLabel="Delete Time Slot"
        ariaHideApp={false}
        className="flex items-center justify-center min-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 md:w-1/3 lg:w-1/4 z-60">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
            Delete Time Slot
          </h2>
          <p className="mb-4 text-gray-700">
            Are you sure you want to delete the time slot "{selectedTime}" on "
            {formatDate(selectedDate)}"?
          </p>
          <div className="flex justify-between">
            <Button
              label="Delete"
              icon="pi pi-check"
              onClick={handleDeleteTime}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition duration-300"
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={closeDateTimeModal}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-400 transition duration-300"
            />
          </div>
        </div>
      </Modal>

      {/* Full Calendar */}
      <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto sm:w-full md:w-1/2 lg:w-2/3 xl:w-3/4 bg-white shadow-lg p-6 rounded-lg">
          <FullCalendar
            plugins={[dayGridPlugin,timeGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventContent={renderEventContent}
            eventClick={(info) =>
              handleTimeClick(
                info.event.extendedProps.slotTime,
                info.event.extendedProps.date
              )
            }
            // dateClick={(info) => handleMoreClick(info.dateStr)}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            }}
            displayEventTime={false} // Disable event time display
            contentHeight="auto"
            
          />
        </div>
      </Suspense>
      

    </div>
    </div>
    </div>
  );
};

export default ScheduleAppointmentPage;
