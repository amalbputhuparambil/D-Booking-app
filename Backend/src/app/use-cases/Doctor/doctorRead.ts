import { Request } from "express";
import { BookingDbRepositoryInterface } from "../../interfaces/bookingDbRepository";
import { userDbInterface } from "../../interfaces/userDbRepository";



export const getPatients = async (bookingDbRepository: ReturnType<BookingDbRepositoryInterface>) =>
  await bookingDbRepository.getAllPatients();

export const getPatientFullDetails = async (id:string,bookingDbRepository: ReturnType<BookingDbRepositoryInterface>) =>
    await bookingDbRepository.getSinglePatient(id);

export const getSingleUser = async ( id: string, userDbRepository: ReturnType<userDbInterface>) =>
  await userDbRepository.getUserbyId(id);

