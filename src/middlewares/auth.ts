import  { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorizes";
import { errorCode } from "../exceptions/root";
import jwt  from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";
require('dotenv').config();

declare module 'express' {
    interface Request {
        user?: User
    }
}

const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
//1. token from header
const authheader  = req.headers.authorization as string;
const token = authheader.split(' ')[1];



//2. token not presnt rheeo an error of aunathosided
if (!token) {
    next( new UnauthorizedException("Not Authorised 1", errorCode.UNAUTHORISED))
 }
try {

//3. token present and verified and exract payload
    // const payload = jwt.verify(token, token)

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as any;
    //   console.log("Token verified successfully, payload:", payload);
    } catch (err: any) {
      console.log("Token verification failed:", err.message);
      return next(new UnauthorizedException("Not Authorized: Invalid token", errorCode.UNAUTHORISED));
    }
    
//4. get user rom paylad
    const user = await prismaClient.user.findFirst({
        where:{
            id: payload?.userId
        }
    }) 


    if (!user) {
        next( new UnauthorizedException("Not Authorised 2", errorCode.UNAUTHORISED))
    }

//5. to attach user tot eh current request object
    req.user  = user!
    next();

} catch (error) {
    next( new UnauthorizedException("Not Authorised 3", errorCode.UNAUTHORISED))
}

}

export default authMiddleware