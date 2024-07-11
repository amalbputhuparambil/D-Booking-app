import { Application } from "express";
import userRoutes from "./userRoute";
import doctorRoutes from "./doctorRoute"
import adminRoutes from './adminRoute'
import refreshTokenRoute from './refreshTokenRoute'
import chatRoute from "./chatRoutes";

const routes = (app: Application) => {
    app.use("/api/user", userRoutes());
    app.use("/api/token", refreshTokenRoute());
    app.use("/api/doctor",doctorRoutes());
    app.use('/api/admin',adminRoutes());
    app.use("/api/chat", chatRoute());

   
};

export default routes;