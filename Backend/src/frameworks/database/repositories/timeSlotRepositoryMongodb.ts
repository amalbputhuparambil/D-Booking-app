import { TimeSlotEntityType } from "../../../entities/timeSlotEntity";
import TimeSlot from "../models/timeSlots";

export const timeSlotRepositoryMongodb = () => {
    const addTimeSlots = async (doctorId:string,slotTime:string,date:string) =>
      {
        console.log("$$$$$$$$$$$$$$$$$$",doctorId)

      const res = await TimeSlot.create({
        doctorId: doctorId,
        slotTime: slotTime,
        date: date,
        available:true,
      });

      console.log(res,"$$$$$$$$$$$$$$$$$$$$$$$$$");
      return res
    }

   const getSlotByTime = async (
    doctorId: string,
    slotTime:string,
    date:string,
   ) => {
    const res = await TimeSlot.findOne({ doctorId,date,slotTime});
    console.log(res,"---------------------------------------------------------------");
    return res
  }

  
  const getAllTimeSlots = async (doctorId: string) =>
    await TimeSlot.find({ doctorId }).sort({ slotTime: -1 });

  const getAllDateSlots = async (doctorId: string) =>
    await TimeSlot.find({ doctorId  }).sort({ date: -1 });


  const getTimeSlotsByDate = async (doctorId: string, date: string) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
  
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
  
    return await TimeSlot.find({
      doctorId,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ date: -1 });
  };

  const removeTimeSlotbyId = async (id: string) =>
    await TimeSlot.findByIdAndDelete(id);

  return {
    addTimeSlots,
    getAllTimeSlots,
    getSlotByTime,
    removeTimeSlotbyId,
    getAllDateSlots,
    getTimeSlotsByDate,
    
  };
};

export type TimeSlotRepositoryMongodbType = typeof timeSlotRepositoryMongodb;