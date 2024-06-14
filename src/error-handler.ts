import { NextFunction, Request, Response } from "express"
import { errorCode, HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-exception"
import { ZodError } from "zod"
import { BadRequestsException } from "./exceptions/bad-request"

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
           await method(req, res, next)
        } catch (error: any) {
            let exceptiom: HttpException
            if (error instanceof HttpException) {
                exceptiom = error;
            }else{
                if(error instanceof ZodError){
                    console.log(error);
                    
                    exceptiom = new BadRequestsException("Unprocessabel entity", errorCode.UPROCESSABLE_ENTITY)
                }else{
                exceptiom = new InternalException('Something went wrong', error, errorCode.INTERNAL_EXCEPTION)
                }
            }
            next(exceptiom);
        }
    }
}