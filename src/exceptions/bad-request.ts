import { errorCode, HttpException } from "./root";

export class BadRequestsException extends HttpException{
    constructor(message: string, errorCode: errorCode){
        super(message, errorCode, 400, null)
    }
}