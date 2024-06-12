import { errorCode, HttpException } from "./root";

export class UnauthorizedException extends HttpException{
    constructor(message: string, errorCode: errorCode){
        super(message, errorCode, 401, null)
    }
}