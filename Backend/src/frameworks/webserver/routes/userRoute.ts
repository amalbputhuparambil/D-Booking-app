import express from "express";
import bookingController from "../../../adapters/bookingController";
import userController from "../../../adapters/userController";
import adminDbRepository from "../../../app/interfaces/AdminDbRepository";
import { bookingDbRepository } from "../../../app/interfaces/bookingDbRepository";
import { departmentDbRepository } from "../../../app/interfaces/departmentRepositoryInterface";
import { doctorDbRepository } from "../../../app/interfaces/doctorDBRepository";
import { timeSlotDbRepository } from "../../../app/interfaces/timeSlotDbRepository";
import { userDbRepository } from "../../../app/interfaces/userDbRepository";
import { authServiceInterface } from "../../../app/service-interface/authServiceInterface";
import { adminRepositoryMongodb } from "../../database/repositories/AdminRepositoryMongodb";
import { bookingRepositoryMongodb } from "../../database/repositories/BookingRepositoryMongodb";
import { departmentRepositoryMongodb } from "../../database/repositories/departmentRepositoryMongodb";
import { doctorRepositoryMongodb } from "../../database/repositories/doctorRepositoryMongodb";
import { timeSlotRepositoryMongodb } from "../../database/repositories/timeSlotRepositoryMongodb";
import { userRepositoryMongodb } from "../../database/repositories/userRepositoryMongodb";
import { authService } from "../../services/authService";
import authenticateUser from '../middlewares/authMiddleware';
import reviewController from "../../../adapters/reviewController";
import { reviewDbRepository } from "../../../app/interfaces/reviewDbRepository";
import { reviewRepositoryMongodb } from "../../database/repositories/reviewRepositoryMongodb";




const userRoutes = () => {
    const router = express.Router();

    const controller = userController(
        authServiceInterface,
        authService,
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        departmentDbRepository,
        departmentRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        adminDbRepository,
        adminRepositoryMongodb

    )

    const _bookingController = bookingController(
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        bookingDbRepository,
        bookingRepositoryMongodb
    )

    const _reviewController = reviewController(
        reviewDbRepository,
        reviewRepositoryMongodb
    );


    router.post('/register',controller.registerUser)
    router.post('/verify_otp',controller.verifyOtp)
    router.post("/resend_otp", controller.resendOtp);
    router.post("/login",controller.userLogin)
    router.post("/forgot_password",controller.forgotPassword);
    router.post("/reset_password/:token",controller.resetPassword);
    router.post("/google_signIn", controller.googleSignIn);



    router.get("/doctors", controller.doctorPage)
    router.get("/doctor/:id",controller.doctorDetails)
    router.get('/department/list', controller.listDepartmentsHandler);
    router.get("/profile", authenticateUser, controller.userProfile);
    router.patch("/profile/edit", authenticateUser, controller.updateUserInfo);
    router.get("/time-slots/:id",authenticateUser,controller.getTimeslots);
    router.get("/time-slots/:id/dates",authenticateUser,controller.getDateSlots);
    router.get("/fetchWallet/:id",authenticateUser,controller.getWallet);
    router.get("/transactions", authenticateUser, controller.getTransactions);
    router.get("/banners", controller.getBanners);



    // router.post("/book-appoinment",authenticateUser,_bookingController.BookAppoinment);

    
router.post("/appointments",authenticateUser,_bookingController.BookAppoinment);//last booking ......
router.get("/allAppoinments",authenticateUser,_bookingController.getAllAppoinments);
router.patch("/payment/status/:id",authenticateUser,_bookingController.updatePaymentStatus);
router.post("/walletPayment",authenticateUser,_bookingController.walletPayment);
router.put("/updateWallet",authenticateUser,_bookingController.changeWalletAmount);
router.get("/bookingdetails/:id",authenticateUser,_bookingController.getBookingDetails);
router.get("/bookings/:id",authenticateUser,_bookingController.getAllBookingDetails);
router.put("/bookingdetails/:id",authenticateUser,_bookingController.cancelAppoinment);

router.post("/createreviews", authenticateUser, _reviewController.createReviewHandler);
router.get("/getallreviews/:id", authenticateUser, _reviewController.getAllReviewsHandler);
router.post('/submitreply/:id', authenticateUser, _reviewController.submitReplyHandler);



    return router
}

export default userRoutes