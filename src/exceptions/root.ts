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
    SUCCESS = 200,
    FOUND = 302,
    VALIDATION_ERROR = 400,
    UNAUTHORISED = 401,
    FORBIDEN = 403,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE= 503,
    USER_NOT_FOUND = 404,
    PRODUCT_NOT_FOUND = 404,
    USER_ALREADY_EXISTS=  400,
    INCORRECT_PASSWORD = 1003,
    UPROCESSABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION =5000,

}