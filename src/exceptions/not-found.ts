import { errorCode, HttpException } from "./root";

export class NotFoundException extends HttpException{
    constructor(message: string, errorCode: errorCode){
        super(message, errorCode, 404, null)
    }
}