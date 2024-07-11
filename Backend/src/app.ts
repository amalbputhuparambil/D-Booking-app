import express, { Application, NextFunction } from "express";
import http from "http";
import serverConfig from "./frameworks/webserver/server";
import routes from "./frameworks/webserver/routes";
import connectDb from "./frameworks/database/connection";
import expressConfig from "./frameworks/webserver/expressConfig";
import errorHandlingMiddleware from "./frameworks/webserver/middlewares/errorhandleMiddleware";
import { Server } from "socket.io";
import socketConfig from "./frameworks/webserver/webSocket/socket";
import CustomError from "./utils/customError";



const app : Application = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

socketConfig(io);
expressConfig(app);
connectDb();
routes(app);
serverConfig(server).startServer()

app.use(errorHandlingMiddleware)

app.all("*",(req, res, next: NextFunction)=>{
    next(new CustomError(`Not found : ${req.url}`, 404));
});
