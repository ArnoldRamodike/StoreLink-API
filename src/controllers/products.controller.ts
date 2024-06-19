import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { errorCode } from "../exceptions/root";

export const createProduct = async (req: Request, res:Response, next: NextFunction) => {

    // Validator to create products

    const product  = await prismaClient.product.create({
        data:{
            ...req.body,
            tags: req.body.tags.join(',')
        }
    });

    res.json(product);
}

export const listProducts = async (req: Request, res:Response, next: NextFunction) => {

    try {
        const count = await prismaClient.product.count();

        const products = await prismaClient.product.findMany({
            skip: +req.query.skip! || 0,
            take: 5
        });

        res.json({count, data: products})
    } catch (err) {
        throw new NotFoundException('Product not found', errorCode.NOT_FOUND)
    }
}
export const getProductById = async (req: Request, res:Response, next: NextFunction) => {
    try {

        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        });

        res.json(product)
    } catch (err) {
        throw new NotFoundException('Product not found', errorCode.NOT_FOUND)
    }
}
export const updateProduct = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',')
        }
        
        const updatedProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        });
        

        res.json(updatedProduct)
    } catch (err) {
        throw new NotFoundException('Product not found', errorCode.NOT_FOUND)
    }
}

export const deleteProduct = async (req: Request, res:Response, next: NextFunction) => {
    try {
         await prismaClient.product.delete({
            where: {
                id: +req.params.id
            }
        });
        
        res.json("Product deleted successfully")
    } catch (err) {
        throw new NotFoundException('Product not found', errorCode.NOT_FOUND)
    }
}
export const searchProducts = async (req: Request, res:Response, next: NextFunction) => {
    // try {
    // Implement pagination.
        const products =  await prismaClient.product.findMany({
            where: {
               name: {
                search: req.query.q?.toString()
               },
               description: {
                search: req.query.q?.toString()
               },
               tags: {
                search: req.query.q?.toString()
               },
            }
        });
        
        res.json(products)
    // } catch (err) {
    //     throw new NotFoundException('Product not found', errorCode.PRODUCT_NOT_FOUND)
    // }
}