import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HttpStatus } from "../../../types/httpStatus";
import configKeys from "../../../config";

// extending the request interface to include the user object in the req
declare global {
  namespace Express {
    interface Request {
      user?: any;
      doctor?: any;
    }
  }
}
// verify the token and validate user
export default function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(HttpStatus.FORBIDDEN).json("Your are not authenticated");
  }
  const access_token = authHeader.split(" ")[1];
  jwt.verify(access_token, configKeys.ACCESS_SECRET, (err: any, user: any) => {
    if (err) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ success: false, message: "Token is not valid" });
    } else {
      req.user = user.id;
    }
  });
  next();
}


export async function authenticateDoctor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader,"Glinnnnnnnnnnnnnnn")
    if (!authHeader) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json("Your are not authenticated");
    }
    const access_token = authHeader.split(" ")[1];

    const user = jwt.verify(
      access_token,
      configKeys.ACCESS_SECRET
    ) as JwtPayload;
console.log(user,"Glinnnn222222222222222222222222222222222222222222")
    
    if (user.role === "doctor") {
      req.doctor = user.id;
      return next();
    }
    return res.status(HttpStatus.FORBIDDEN).json({
      success: false,
      message: "Your are not allowed to access this resource",
      user,
    });
  } catch (error) {
    res
      .status(HttpStatus.FORBIDDEN)
      .json({ success: false, message: "Token is not valid" });
  }
}


// Admin authorization to get the access to routes in admin
export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(HttpStatus.FORBIDDEN).json("You are not authenticated");

  const access_token = authHeader.split(" ")[1];
  jwt.verify(access_token, configKeys.ACCESS_SECRET, (err: any, user: any) => {
    if (err) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ success: false, message: "Token is not valid" });
    } else {
      if (user.role === "admin") {
        return next();
      }
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: "Your are not allowed to access this resource",
        user,
      });
    }
  });
}