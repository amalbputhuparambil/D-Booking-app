
import express from "express";
import tokenController from "../../../adapters/tokenController";
import { doctorDbRepository } from "../../../app/interfaces/doctorDBRepository";
import { userDbRepository } from "../../../app/interfaces/userDbRepository";
import { authServiceInterface } from "../../../app/service-interface/authServiceInterface";
import { doctorRepositoryMongodb } from "../../database/repositories/doctorRepositoryMongodb";
import { userRepositoryMongodb } from "../../database/repositories/userRepositoryMongodb";
import { authService } from "../../services/authService";

const refreshTokenRoute = () => {
  const router = express.Router();
  const controller = tokenController(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongodb,
    doctorDbRepository,
    doctorRepositoryMongodb
  );

  router.get("/accessToken", controller.returnAccessToClient);
  router.post("/refresh_token", controller.getNewAccessToken);

  return router;
};
export default refreshTokenRoute;