import { Router } from "express";
import adminController from "../../../adapters/adminController";
import adminDbRepository from "../../../app/interfaces/AdminDbRepository";
import { departmentDbRepository } from "../../../app/interfaces/departmentRepositoryInterface";
import { doctorDbRepository } from "../../../app/interfaces/doctorDBRepository";
import { userDbRepository } from "../../../app/interfaces/userDbRepository";
import { authServiceInterface } from "../../../app/service-interface/authServiceInterface";
import { adminRepositoryMongodb } from "../../database/repositories/AdminRepositoryMongodb";
import { departmentRepositoryMongodb } from "../../database/repositories/departmentRepositoryMongodb";
import { doctorRepositoryMongodb } from "../../database/repositories/doctorRepositoryMongodb";
import { userRepositoryMongodb } from "../../database/repositories/userRepositoryMongodb";
import { authService } from "../../services/authService";


export default () => {
    const router = Router ();

    const controller = adminController(
        authServiceInterface,
        authService,
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        adminDbRepository,
        adminRepositoryMongodb,
        departmentDbRepository,
        departmentRepositoryMongodb,
        
    );

    router.post('/login',controller.adminLogin)
    router.get("/users", controller.getAllUser);
    router.patch("/block_user/:id", controller.userBlock);
    router.get("/doctors", controller.getAllDoctors);
    router.patch("/block_doctor/:id", controller.doctorBlock);
    router.get("/doctors/:id", controller.doctorDetails);
    router.patch("/update_doctor/:id", controller.updateDoctor);
    router.patch("/verify_doctor_rejection/:id",controller.rejectionDoctor);


    // departmentManagement--- 
    router.get('/department', controller.getAllDepartmentsHandler);
    router.post('/addDepartment', controller.addDepartmentHandler);
    router.get('/department/list', controller.listDepartmentsHandler);
    // router.get('/department/unList/:id', controller.unlistDepartmentsHandler);
    router.put('/editDepartment/:id', controller.updateDepartmentHandler);
    router.patch('/block_department/:id', controller.blockDepartmentHandler);
    router.patch('/unblock_department/:id', controller.unblockDepartmentHandler);
    router.get("/banners", controller.getBanners);
  router.post("/banners/add", controller.addNewBanner);
  router.patch("/banners/edit/:bannerId",controller.updateBanner);
  router.delete("/banners/remove/:bannerId",controller.removBanner);
    
    return router
}