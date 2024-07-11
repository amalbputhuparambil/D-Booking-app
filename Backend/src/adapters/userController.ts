import { NextFunction, Request, Response } from "express";
import asynchandler from "express-async-handler";
import { AdminDbRepositoryInterface } from "../app/interfaces/AdminDbRepository";
import { IDepartmentRepository } from "../app/interfaces/departmentRepositoryInterface";
import { doctorDbInterface } from '../app/interfaces/doctorDBRepository';
import { TimeSlotDbInterface } from "../app/interfaces/timeSlotDbRepository";
import { userDbInterface } from "../app/interfaces/userDbRepository";
import { AuthServiceInterfaceType } from "../app/service-interface/authServiceInterface";
import { getAllBanners } from "../app/use-cases/Admin/adminBanner";
import { listDepartments } from "../app/use-cases/Admin/adminDepartment";
import { getDoctors, getSingleDoctor } from '../app/use-cases/Admin/adminRead';
import { getDateSlotsByDoctorId, getTimeSlotsByDoctorId, getTimeSlotsByDoctorIdAndDate } from "../app/use-cases/Doctor/timeSlot";
import {
    authenticateGoogleSignInUser,
    deleteOtp,
    login,
    sendResetVerificationCode,
    userRegister,
    verifyOtpUser,
    verifyTokenAndRestPassword,
} from "../app/use-cases/user/auth/userAuth";
import { WalletTransactions, getUserProfile, getWalletUser, updateUser } from "../app/use-cases/user/readnupdate/profile";
import { AdminRepositoryMongodbType } from "../frameworks/database/repositories/AdminRepositoryMongodb";
import { doctorRepositoryMongodbType } from '../frameworks/database/repositories/doctorRepositoryMongodb';
import { TimeSlotRepositoryMongodbType } from "../frameworks/database/repositories/timeSlotRepositoryMongodb";
import { userRepositoryMongodbType } from "../frameworks/database/repositories/userRepositoryMongodb";
import { AuthService } from "../frameworks/services/authService";
import { GoogleResponseType } from "../types/GoogleResponseType";
import { HttpStatus } from "../types/httpStatus";



const userController =(
  authServiceInterface: AuthServiceInterfaceType,
  authServiceImpl: AuthService,
  userDbRepository: userDbInterface,
  userRepositoryImpl: userRepositoryMongodbType,
  doctorDbRepository: doctorDbInterface,
  doctorDbRepositoryImpl: doctorRepositoryMongodbType,
  departmentDbRepository: IDepartmentRepository,
  departmentDbRepositoryImpl: () => any,
  timeSlotDbRepository: TimeSlotDbInterface,
  timeSlotDbRepositoryImpl: TimeSlotRepositoryMongodbType,
  adminDbRepository: AdminDbRepositoryInterface,
  adminDbRepositoryImpl: AdminRepositoryMongodbType,
) => {
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const dbDoctorRepository = doctorDbRepository(doctorDbRepositoryImpl());
    const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl());
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
    const adminRepository = adminDbRepository(adminDbRepositoryImpl());


    
    // Register User POST - Method
    const registerUser = async( req:Request,res:Response,next:NextFunction ) =>{
        try{
            const user = req.body;
            const newUser =   await userRegister(user,dbRepositoryUser,authService);
            res.json({
               message: "User registration successful,please verify your email",
               newUser,
            });
           } catch (error) {
            next(error);
        }
    }

// Verify Otp Method POSt
    const verifyOtp = async (req: Request, res: Response,next:NextFunction)=>{
        try{
            const {otp,userId} = req.body;
            const isVerified = await verifyOtpUser(otp,userId,dbRepositoryUser);
            if(isVerified){
                return res.status(HttpStatus.OK)
                .json({message:"User account verified, please login"});
            }
        }catch(error){
            next(error);
        }
    }

     //Resend Otp method : POST
     const resendOtp = async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const {userId} = req.body;
            await deleteOtp(userId,dbRepositoryUser,authService);
            res.json({message:"New otp sent to mail"});
        }catch(error){
            next(error);
        }
    };

    // user login method: Post
    const userLogin = asynchandler(
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const { accessToken,refreshToken, isEmailExist } = await login(
              req.body,
              dbRepositoryUser,
              authService
            );
            
            res
            .status(HttpStatus.OK)
            .json({ message: "login success", user: isEmailExist ,
            access_token: accessToken,
            refresh_token : refreshToken ,
            });
        } catch (error) {
          next(error);
        }
      }
      ); 

      //user forgot password : post
      const forgotPassword = async (req:Request,res:Response,next :NextFunction)=> {
        try {
            
            const {email} = req.body;
            console.log(email);
            await sendResetVerificationCode(email,dbRepositoryUser,authService);

            return res.status(HttpStatus.OK).json({
                success:true,
                message : "Reset password is send to your email,check it"
            })
            
        } catch (error) {
           
            next(error)
        }
      }

      //user reset password : post
      const resetPassword = async(req:Request,res:Response,next :NextFunction) => {
        try {
            console.log('aaaaaaaaa')
            const {password} = req.body;
            const {token} = req.params;
            await verifyTokenAndRestPassword(token,password,dbRepositoryUser,authService)
            return res.status(HttpStatus.OK).json({
                success:true,
                message: "Reset password success,you can login with your new password",
            })
            
        } catch (error) {
            console.log('zzzzzzzzz')
            next (error)
        }
      }

      //google sign : post
      const googleSignIn = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const userData: GoogleResponseType= req.body.user;
          const { accessToken,refreshToken, isEmailExist, createdUser } =
            await authenticateGoogleSignInUser(
              userData,
              dbRepositoryUser,
              authService
            );
          const user = isEmailExist ? isEmailExist : createdUser;//isEmailExist is truthy (an existing user is found), user is set to isEmailExist.Otherwise, user is set to createdUser (the newly created user).
          res.status(HttpStatus.OK).json({ message: "login success", user , access_token: accessToken,refresh_token:refreshToken});
        } catch (error) {
          next(error);
        }
      };

      

      //retrieve all doctors from db : get 
      const doctorPage = async(re:Request,res:Response,next:NextFunction) => {
        try {
            const doctors = await getDoctors(dbDoctorRepository);
            return res.status(HttpStatus.OK).json({success:true,doctors})
        } catch (error) {
            next(error)
        }
      }

      //doctor details : get
      const doctorDetails = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {id} = req.params;
            const doctor = await getSingleDoctor(id,dbDoctorRepository);
            return res.status(HttpStatus.OK).json({success:true, doctor})
            
        } catch (error) {
            next(error)
        }
      }
        // get : lists a department by ID.
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

  //get : retrieve user profile 
  const userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user;
      console.log(userId,'userid')
      const user  = await getUserProfile(
        userId,
        dbRepositoryUser
      );
      
      res.status(200).json({ success: true, user});
    } catch (error) {
      next(error);
    }
  };

  //patch : update user profile 
  const updateUserInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user;
      const updateData = req.body;
      const user = await updateUser(userId, updateData, dbRepositoryUser);
      res
        .status(200)
        .json({ success: true, user, message: "Profile updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  //get : get time slot by doctor Id
  const getTimeslots = async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try{
    const {id} = req.params;
    const {date} = req.query; 
  
    const timeSlots = await getTimeSlotsByDoctorId(
      id,
      dbTimeSlotRepository
    )
    res.status(HttpStatus.OK).json({ success: true, timeSlots });
  }catch (error) {
    next(error);
  }
  }

  //get : get date slot by doctor Id 
  const getDateSlots = async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try{
    const {id} = req.params;
    const { date }  = req.query ;
    const dateString = date as string;
    console.log(date)
    if (date) {
      // Fetch time slots for a specific date
      const timeSlots = await getTimeSlotsByDoctorIdAndDate(id, dateString, dbTimeSlotRepository);
      return res.status(HttpStatus.OK).json({ success: true, timeSlots });
    } else {
      // Fetch all dates
      const dateSlots = await getDateSlotsByDoctorId(id, dbTimeSlotRepository);
      return res.status(HttpStatus.OK).json({ success: true, dateSlots });
    }
  }catch (error) {
    next(error);
  }
  }


  /**
   * * METHOD :GET
   * * Retrieve  user wallet
   */
const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id} = req.params;
    
    const getWallet = await getWalletUser(id,dbRepositoryUser);
    res.status(200).json({ success: true, getWallet});
  } catch (error) {
    next(error);
  }
};


  
/**Method Get fetch transactions */

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;
    const transaction = await WalletTransactions(userId, dbRepositoryUser);
    res.status(200).json({
      success: true,
      transaction,
      message: "Transactions fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};




    /**
   * * METHOD:GET
   * * Get banners for home page
   */
    const getBanners = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const banners = await getAllBanners({ isActive: true }, adminRepository);
  
        res.status(HttpStatus.OK).json({
          success: true,
          message: "Banners fetched successfully",
          banners,
        });
      } catch (error) {
        next(error);
      }
    };






    return {
        registerUser,
        verifyOtp,
        userLogin,
        resendOtp,
        forgotPassword,
        resetPassword,
        googleSignIn,
        doctorPage,
        doctorDetails,
        listDepartmentsHandler,
        userProfile,
        updateUserInfo,
        getTimeslots,
        getDateSlots,
        getTransactions,
        getWallet,
        getBanners

    };
}

export default userController