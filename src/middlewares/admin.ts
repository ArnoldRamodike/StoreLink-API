import  { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorizes";
import { errorCode } from "../exceptions/root";
import { User } from "@prisma/client";

declare module 'express' {
    interface Request {
        user?: User
    }
}

const adminMiddleware = async(req: Request, res: Response, next: NextFunction) => {

try {
    const user  = req.user
     
    if (user?.role === "ADMIN") {
        next()
    }else{
        next( new UnauthorizedException("Not an Admin", errorCode.UNAUTHORISED))
    }

} catch (error) {
    next( new UnauthorizedException("Not Authorised", errorCode.UNAUTHORISED))
}

}

export default adminMiddleware