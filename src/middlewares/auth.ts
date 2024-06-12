import  { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorizes";
import { errorCode } from "../exceptions/root";
import  * as jwt  from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

declare module 'express' {
    interface Request {
        user?: User
    }
}

const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
//1. token from header
const token  = req.headers.authorization as any;

//2. token not presnt rheeo an error of aunathosided
if (!token) {
    next( new UnauthorizedException("Not Authorised", errorCode.UNAUTHORISED))
 }
try {

//3. token present and verified and exract payload
    const payload  = jwt.verify(token, JWT_SECRET)  as any;
//4. get user rom paylad
    const user = await prismaClient.user.findFirst({
        where:{
            id: payload?.userId
        }
    }) 

    if (!user) {
        next( new UnauthorizedException("Not Authorised", errorCode.UNAUTHORISED))
    }
    
//5. to attach user tot eh current request object
    req.user  = user!
    next();

} catch (error) {
    next( new UnauthorizedException("Not Authorised", errorCode.UNAUTHORISED))
}

}

export default authMiddleware