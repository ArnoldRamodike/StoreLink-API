// Message and statuscode, error codes.

export class HttpException extends Error {
    message: string;
    errorCode: errorCode;
    statusCode: number;
    errors: errorCode;

    constructor(message: string, errorCode: any, statusCode:number, error: any){
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = error
    }
}

export enum errorCode {
    USER_NOT_FOUND = 404,
    PRODUCT_NOT_FOUND = 404,
    USER_ALREADY_EXISTS=  400,
    INCORRECT_PASSWORD = 1003,
    UPROCESSABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION =5000,
    UNAUTHORISED= 3002
}