import { Response, Request, NextFunction } from 'express'
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets';
import { BadRequestsException } from '../exceptions/bad-request';
import { errorCode } from '../exceptions/root';
import { SignUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';

export const signup = async (req: Request, res:Response, next: NextFunction) => {

        SignUpSchema.parse(req.body)
        const {email, password, name} = req.body;

        let user = await prismaClient.user.findFirst({
            where:{
                email
            }
        });
    
        if (user) {
            next( new BadRequestsException("user already exits!", errorCode.VALIDATION_ERROR))
        }
    
        user = await prismaClient.user.create({
            data:{
                name, 
                email,
                password: hashSync(password, 10)
            }
        });
    
        res.json(user);

}

export const login = async (req: Request, res:Response,  next: NextFunction) => {
    const {email, password} = req.body;

    let user = await prismaClient.user.findFirst({
        where:{
            email
        }
    });

    if (!user) {
        throw new NotFoundException("User does not exists", errorCode.NOT_FOUND);
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequestsException("Invalid details exits!", errorCode.UNAUTHORISED);
    }
    
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET);

    res.json({user, token});
}

export const me = async (req: Request, res:Response) => {

    res.json(req);
}