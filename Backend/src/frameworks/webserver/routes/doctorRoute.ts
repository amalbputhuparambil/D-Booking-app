import express from 'express'
import doctorController from '../../../adapters/doctorController'
import { bookingDbRepository } from '../../../app/interfaces/bookingDbRepository'
import { departmentDbRepository } from "../../../app/interfaces/departmentRepositoryInterface"
import { doctorDbRepository } from '../../../app/interfaces/doctorDBRepository'
import { timeSlotDbRepository } from '../../../app/interfaces/timeSlotDbRepository'
import { authServiceInterface } from '../../../app/service-interface/authServiceInterface'
import { bookingRepositoryMongodb } from '../../database/repositories/BookingRepositoryMongodb'
import { departmentRepositoryMongodb } from "../../database/repositories/departmentRepositoryMongodb"
import { doctorRepositoryMongodb } from '../../database/repositories/doctorRepositoryMongodb'
import { timeSlotRepositoryMongodb } from '../../database/repositories/timeSlotRepositoryMongodb'
import { authService } from '../../services/authService'
import { authenticateDoctor } from '../middlewares/authMiddleware'
import { userDbRepository } from "../../../app/interfaces/userDbRepository";
import { userRepositoryMongodb } from '../../database/repositories/userRepositoryMongodb'
import bookingController from '../../../adapters/bookingController'



const doctorRoutes = () => {
    const router = express.Router();
    const controller = doctorController(
        authServiceInterface,
        authService,
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        departmentDbRepository,
        bookingDbRepository,
        bookingRepositoryMongodb,
        departmentRepositoryMongodb,
    )

    const _bookingController = bookingController(
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        bookingDbRepository,
        bookingRepositoryMongodb,
    )
    console.log("in doc rot")
    router.post('/register',controller.signup);
    router.post('/verify-token/:token',controller.verifyToken);
    router.post("/google_signIn", controller.googleSignIn);
    router.post('/login',controller.login);

    router.get("/profile",authenticateDoctor,controller.doctorProfile);
    router.get('/department/list', controller.listDepartmentsHandler);
    router.patch("/profile/edit",authenticateDoctor,controller.updateDoctorInfo);
    router.get("/status",authenticateDoctor,controller.doctorStatus);

    router.post("/schedule",authenticateDoctor,controller.scheduleTime);
    router.get("/timeslots",authenticateDoctor,controller.getTimeSlots)
    router.delete("/deleteTime/:id",authenticateDoctor,controller.removeTimeSlot)
    router.get("/patients",authenticateDoctor,controller.getPatientList);
    router.get("/patients/:id",authenticateDoctor,controller.getPatientDetails);
    router.get("/user/:id", authenticateDoctor,controller.userDetails);

    router.get("/bookingdetails/:id",authenticateDoctor,_bookingController.getAppoinmentList)
    

    return router
} 

export default doctorRoutes