import { Request, Response } from "express"
import { AddressSchema, UpdateUserSchema } from "../schema/users"
import { prismaClient } from ".."
import { NotFoundException } from "../exceptions/not-found";
import { errorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestsException } from "../exceptions/bad-request";

export const addAddress= async (req: Request, res:Response) => {
    AddressSchema.parse(req.body);

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: req.user?.id
        }
    })

    res.json(address)
}

export const deleteAddresss = async (req: Request, res:Response) => {
    try {
        await prismaClient.address.delete({
           where: {
               id: +req.params.id
           }
       });
       
       res.json({success: true})
   } catch (err) {
       throw new NotFoundException('Product not found', errorCode.PRODUCT_NOT_FOUND)
   }
    
}

export const listAddress = async (req: Request, res:Response) => {

    const address = await prismaClient.address.findMany({
     where:{
        userId: req.user?.id
     }
    });

    res.json(address);
}

export const updateUser = async (req: Request, res:Response) => {
    const validatedData = UpdateUserSchema.parse(req.body);
    let shippingAddress: Address
    let billingAddress: Address

        if (validatedData.defaultShippingAddress) {
              try {
                shippingAddress = await prismaClient.address.findFirstOrThrow({
                    where: {
                        id: validatedData.defaultShippingAddress
                    }
                });
                
            } catch (err) {
                throw new NotFoundException('Shipping Addres not found', errorCode.PRODUCT_NOT_FOUND)
            }  
            if (shippingAddress.userId != req.user?.id) {
                throw new BadRequestsException('Address does not beong to user', errorCode.INTERNAL_EXCEPTION)
            }
        }

        if (validatedData.defaultBillingAddress) {
              try {
                billingAddress = await prismaClient.address.findFirstOrThrow({
                    where: {
                        id: validatedData.defaultBillingAddress
                    }
                });
                      
            } catch (err) {
                throw new NotFoundException('Billing Addres not found', errorCode.PRODUCT_NOT_FOUND)
            }  
            
            if (billingAddress.userId != req.user?.id) {
                throw new BadRequestsException('Address does not beong to user', errorCode.INTERNAL_EXCEPTION)
            }
        }

    const updateduser = await prismaClient.user.update({
        where: {
            id: req.user?.id
        },
        data: validatedData
    })

    res.json(updateduser)
}

export const listUsers = async (req: Request, res:Response) => {

    const users = await prismaClient.user.findMany({
        skip: +req.query.skip! || 0,
        take: 5
    })
    res.json(users);
}

export const getUserById = async (req: Request, res:Response) => {
    try {
        const user  = await prismaClient.user.findFirstOrThrow({
            where:{
                id: +req.params.id
            },
            include:{
                Address: true
            }
        });

        res.json(user)
    } catch (error) {
        throw new NotFoundException('User not found', errorCode.PRODUCT_NOT_FOUND)
    }
}

export const changeUserRole = async (req: Request, res:Response) => {
    // Add the valiation schema here ?
    try {
        const user  = await prismaClient.user.update({
            where:{
                id: +req.params.id
            },
            data:{
                role: req.body.role
            }
        });

        res.json(user)
    } catch (error) {
        throw new NotFoundException('User not found', errorCode.PRODUCT_NOT_FOUND)
    }
}