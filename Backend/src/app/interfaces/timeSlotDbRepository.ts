import { TimeSlotRepositoryMongodbType } from "../../frameworks/database/repositories/timeSlotRepositoryMongodb";
import { TimeSlotEntityType } from "../../entities/timeSlotEntity";

export const timeSlotDbRepository = (
  repository: ReturnType<TimeSlotRepositoryMongodbType>
) => {
  const addtimeSlot = async (doctorId:string, slotTime:string,date:string) =>
    await repository.addTimeSlots(doctorId,slotTime,date);
  

  const isTimeSlotExist = async (
    doctorId: string,
    slotTime: string,
    date:string,
  ) => await repository.getSlotByTime(doctorId,slotTime,date);

  

  const getAllTimeSlots = async (doctorId: string) =>
    await repository.getAllTimeSlots(doctorId);

  const getAllDateSlots = async (doctorId: string) =>
    await repository.getAllDateSlots(doctorId);

  const removeTimeSlotbyId = async (timeSlotId: string) =>
    await repository.removeTimeSlotbyId(timeSlotId);

  const getTimeSlotsByDate =  async (doctorId: string, date:string) =>
    await repository.getTimeSlotsByDate(doctorId,date);

  return {
    addtimeSlot,
    isTimeSlotExist,
    getAllTimeSlots,
    removeTimeSlotbyId,
    getAllDateSlots,
    getTimeSlotsByDate
  };
};
export type TimeSlotDbInterface = typeof timeSlotDbRepository;