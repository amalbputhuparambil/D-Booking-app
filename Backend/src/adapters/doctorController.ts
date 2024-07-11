import { NextFunction, Request, Response } from "express";
import { BookingDbRepositoryInterface } from "../app/interfaces/bookingDbRepository";
import { IDepartmentRepository } from "../app/interfaces/departmentRepositoryInterface";
import { doctorDbInterface } from "../app/interfaces/doctorDBRepository";
import { TimeSlotDbInterface } from "../app/interfaces/timeSlotDbRepository";
import {
    AuthServiceInterfaceType
} from "../app/service-interface/authServiceInterface";
import { listDepartments } from "../app/use-cases/Admin/adminDepartment";
import {
    getDoctorProfile,
    updateDoctor,
} from "../app/use-cases/Doctor/ReadnUpdate/Profile";
import {
    addNewDoctor,
    authenticateGoogleSignInDoctor,
    doctorLogin,
    verifyAccount,
} from "../app/use-cases/Doctor/authDoctor";
import { getPatientFullDetails, getPatients, getSingleUser } from "../app/use-cases/Doctor/doctorRead";
import { addTimeSlot, deleteTimeSlot, getTimeSlotsByDoctorId } from "../app/use-cases/Doctor/timeSlot";
import { BookingRepositoryMongodbType } from "../frameworks/database/repositories/BookingRepositoryMongodb";
import { doctorRepositoryMongodbType } from "../frameworks/database/repositories/doctorRepositoryMongodb";
import { TimeSlotRepositoryMongodbType } from "../frameworks/database/repositories/timeSlotRepositoryMongodb";
import { AuthService } from "../frameworks/services/authService";
import { GoogleResponseDoctorType } from "../types/GoogleResponseType";
import { HttpStatus } from "../types/httpStatus";
import { userDbInterface } from "../app/interfaces/userDbRepository";
import { userRepositoryMongodbType } from "../frameworks/database/repositories/userRepositoryMongodb";

const doctorController = (
  authServiceInterface: AuthServiceInterfaceType,
  authServiceImpl: AuthService,
  userDbRepository: userDbInterface,
  userRepositoryImpl: userRepositoryMongodbType,
  doctorDbRepository: doctorDbInterface,
  doctorDbRepositoryImpl: doctorRepositoryMongodbType,
  timeSlotDbRepository: TimeSlotDbInterface,
    timeSlotDbRepositoryImpl: TimeSlotRepositoryMongodbType,
  departmentDbRepository: IDepartmentRepository,
  bookingDbRepository: BookingDbRepositoryInterface,
    bookingDbRepositoryImpl: BookingRepositoryMongodbType,
  departmentDbRepositoryImpl: () => any
) => {
  const authService = authServiceInterface(authServiceImpl());
  const dbRepositoryUser = userDbRepository(userRepositoryImpl());
  const dbRepositoryDoctor = doctorDbRepository(doctorDbRepositoryImpl());
  const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
  const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl());
  const dbBookingRepository = bookingDbRepository(bookingDbRepositoryImpl());



  //doctor signup - post
  const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("inside the controller success");
      const doctordata = req.body;
      const registerDoctor = await addNewDoctor(
        doctordata,
        dbRepositoryDoctor,
        authService
      );
      if (registerDoctor) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message:
            "Registration success, please verify your email that we sent to your mail",
        });
      }
    } catch (error) {
      console.log("inside the controller failed");
      next(error);
    }
  };

  //verify ac - post
  const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token } = req.params;
      const verifying = await verifyAccount(token, dbRepositoryDoctor);
      if (verifying) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: "Account is verified ,go n login",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  // doctor login - post
  const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Assuming doctorLogin, dbRepositoryDoctor, and authService are defined elsewhere
      const { accessToken,refreshToken, isEmailExist } = await doctorLogin(
        email,
        password,
        dbRepositoryDoctor,
        authService
      );
      // console.log("accesstoken -", accessToken);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Login successful",
        doctor: isEmailExist,
        access_token: accessToken,
        refresh_token : refreshToken ,
      });
    } catch (error) {
      next(error);
    }
  };

  //google authen - post
  const googleSignIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorData: GoogleResponseDoctorType = req.body.doctor;

      const { accessToken,refreshToken, isEmailExist, createdUser } =
        await authenticateGoogleSignInDoctor(
          doctorData,
          dbRepositoryDoctor,
          authService
        );

      const user = isEmailExist ? isEmailExist : createdUser;
      res
        .status(HttpStatus.OK)
        .json({ message: "login success",
         user,
        access_token: accessToken,
        refresh_token : refreshToken  });
    } catch (error) {
      next(error);
    }
  };

  //doctor profile - get
  const doctorProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const doctorId = req.doctor;
      const doctor = await getDoctorProfile(doctorId, dbRepositoryDoctor);
      console.log(doctor," molusee ivde noku ... ");
      console.log(doctor?.department);
      res.status(200).json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  };

   /*
   * * METHOD :patch
   * update doctor profile.
   */
  const updateDoctorInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req.doctor;
      const updateData = req.body;
      console.log("inside doctor profile editing controller")

      const doctor = await updateDoctor(
        doctorId,
        updateData,
        dbRepositoryDoctor
      );
      res
        .status(200)
        .json({ success: true, doctor, message: "KYC updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  /*
   * * METHOD :GET
   * retrieve doctor status.
   */
  const doctorStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req.doctor;
      const doctor = await getDoctorProfile(doctorId, dbRepositoryDoctor);
      res.status(200).json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  };


   /*
   * * METHOD :GET
   * lists a department by ID.
   */
  const listDepartmentsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departments = await listDepartments(dbDepartmentRepository);
      return res.status(HttpStatus.OK).json({ success: true, departments });
    } catch (error) {
      next(error);
    }
  };

   /*
   * * METHOD :POST
   * adding a time slot
   */
  const scheduleTime = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req.doctor;
      console.log(doctorId)
      console.log(req.body,"[[[[[[[[[[[[[[[[")
      const {slotTime , date } = req.body // Destructure time and date from req.body
      console.log(slotTime)
  
      const newTimeSlot = await addTimeSlot(
        doctorId,
        {
          slotTime,  date,
          isAvailable:true,
        }, // Pass time and date as an object
        dbTimeSlotRepository
      );
  
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Time slot added successfully",
        newTimeSlot,
      });
    } catch (error) {
      next(error);
    }
  };

    /*
   * * METHOD :GET
   * return all time slot to the doctor
   */
    const getTimeSlots = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const doctorId = req.doctor;
        // const { date } = req.params; 
        const timeSlots = await getTimeSlotsByDoctorId(
          doctorId,
          // date,
          dbTimeSlotRepository
        );
        res.status(HttpStatus.OK).json({ success: true, timeSlots });
      } catch (error) {
        next(error);
      }
    };
  
      /*
   * * METHOD :DELETE
   * removing the timeslot to the doctor
   */
    const removeTimeSlot = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        
        const{ id } = req.params;
        console.log(id);
        await deleteTimeSlot(id, dbTimeSlotRepository);
        res
          .status(HttpStatus.OK)
          .json({ success: true, message: "Slot deleted successfully" });
      } catch (error) {
        next(error);
      }
    }
      
      /*
   * * METHOD :GET
   * get the paitent list to the doctor
   */
      const getPatientList = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const patients = await getPatients(dbBookingRepository);
          return res.status(HttpStatus.OK).json({ success: true, patients });
        } catch (error) {
          next(error);
        }
      }

  /*
   * * METHOD :GET
   * get the one paitent detail to the doctor
   */
      const getPatientDetails = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const {id} = req.params;
          console.log(id);
          const patient = await getPatientFullDetails(id,dbBookingRepository);
          return res.status(HttpStatus.OK).json({ success: true, patient });
        } catch (error) {
          next(error);
        }
      }


        /*
   * * METHOD :GET
   * get the user details to the doctor
   */
    const userDetails = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const {id} = req.params;
        console.log(id,"inside the userdetails of the doc controlllllllllllllllllllllller")
        const user = await getSingleUser(id,dbRepositoryUser);
        console.log(user,"inside the userdetails of the doc controlllllllllllllllllllllller")

        return res.status(HttpStatus.OK).json({ success: true, user });
      } catch (error) {
        next(error);
      }
    };


  return {
    signup,
    verifyToken,
    googleSignIn,
    login,
    doctorProfile,
    updateDoctorInfo,
    doctorStatus,
    listDepartmentsHandler,
    scheduleTime,
    getTimeSlots,
    removeTimeSlot,
    getPatientList,
    getPatientDetails,
    userDetails
  };
};

export default doctorController;
