import { Request, Response } from "express";
import { changeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { errorCode } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";

export const addItemToCart = async (req: Request, res:Response) => {
  // If product exists, don't add it to car, but rather update the quanitity.
    const validatedData = CreateCartSchema.parse(req.body);
    let product: Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where:{
                id: validatedData.productId
            }
        });

        const cart = await prismaClient.cartItems.create({
            data:{
                userId: req.user?.id!,
                productId: product.id,
                quantity: validatedData.quantity
            }
        });

        res.json(cart);
    } catch (error) {
        throw new NotFoundException("Product not found", errorCode.USER_NOT_FOUND);
    }

    res.json();
}

export const deleteItemsFromCart = async (req: Request, res:Response) => {
    try {
        // Check if it's actual owner deleting the cart items
     await prismaClient.cartItems.delete({
          where: {
            id: +req.params.id,
            userId: req.user?.id
          }
        });

        res.json({success:true});
    } catch (error) {
        throw new NotFoundException("Product not found", errorCode.USER_NOT_FOUND);
    }

    res.json();
}

export const changeQuantity = async (req: Request, res:Response) => {

    const validatedData = changeQuantitySchema.parse(req.body);
        // Check if it's actual owner updating the cart items quantity.
    try {
     const updatedData = await prismaClient.cartItems.update({
          where: {
            id: +req.params.id,
            userId: req.user?.id
          },
          data:{
            quantity: validatedData.quantity
          }
        });

        res.json(updatedData);
    } catch (error) {
        throw new NotFoundException("Product not found", errorCode.USER_NOT_FOUND);
    }
    res.json();
}

export const getCart = async (req: Request, res:Response) => {

    const cart = await prismaClient.cartItems.findMany({
        where: {
            userId: req.user?.id
        },
        include: {
            product: true
        }
    });

    res.json(cart);
}

export const me = async (req: Request, res:Response) => {

    res.json();
}