import { combineReducers } from "@reduxjs/toolkit";
import UserSlice from "../slices/UserSlice";
import DoctorSlice from "../slices/DoctorSlice";
import  setAppointmentData  from "../slices/bookingSlice";
export const rootReducer = combineReducers({
  UserSlice,
  DoctorSlice,
  appointment : setAppointmentData
});
export type RootState = ReturnType<typeof rootReducer>;
