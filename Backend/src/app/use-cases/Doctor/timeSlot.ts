import TimeSlotEntity from "../../../entities/timeSlotEntity";
import { HttpStatus } from "../../../types/httpStatus";
import { TimeSlotDbInterface } from "../../../app/interfaces/timeSlotDbRepository";
import { TimeSlotDataInterface } from "../../../types/timeSlotInterface";
import CustomError from "../../../utils/customError";

export const addTimeSlot = async (
  doctorId: string,
  timeData: TimeSlotDataInterface, // Object containing both time and date
  dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
) => {
  const { slotTime, date } = timeData; // Destructure time and date from timeData
   console.log("usecase-1111111111", doctorId);
  const isTimeSlotExists = await dbTimeSlotRepository.isTimeSlotExist(
    doctorId,
    slotTime,
    date
  );
  console.log("usecase-22222222222", doctorId)

  if (isTimeSlotExists){
    console.log("usecase-3333333333")
    throw new CustomError("Time slot already exists", HttpStatus.BAD_REQUEST);
  }


  // console.log("usecase-3333333333", doctorId)

  const newSlot = await dbTimeSlotRepository.addtimeSlot(doctorId, slotTime, date);
  console.log(newSlot,"4444444444444444444444444444")
  return newSlot;
};


  export const getTimeSlotsByDoctorId = async (
    doctorId: string,
    // date:any,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.getAllTimeSlots(doctorId);


  export const deleteTimeSlot = async (
    timeSlotId: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.removeTimeSlotbyId(timeSlotId);


  export const getDateSlotsByDoctorId = async (
    doctorId: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.getAllDateSlots(doctorId);


  export const getTimeSlotsByDoctorIdAndDate = async (
    doctorId: string,
    date: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.getTimeSlotsByDate(doctorId, date);
  

  