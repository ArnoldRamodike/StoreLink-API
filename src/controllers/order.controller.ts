import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { errorCode } from "../exceptions/root";

export const createOrder = async (req: Request, res:Response) => {
// 1. to create a transaction

return await prismaClient.$transaction(async (tx) => {
    // 2. to list all cart items if cart is not empty
    const cartItems = await tx.cartItems.findMany({
        where:{
            userId: req.user?.id
        },
        include:{
            product: true,
        }
    });

    if (cartItems.length === 0) {
       return res.json({message: "cart is empty"})
    }

    // 3. Calculate the price total amout
    const price  = cartItems.reduce((prev, current) => {
        return prev + (current.quantity * +current.product.price)
    }, 0);

    // 4. fetch user address
    const address = await tx.address.findFirst({
        where: {
            id: req.user?.defaultShippingAddress!
        }
    });

    // 5. to define computed fileURLToPathld for formatted address model 

    // 6. We eill create order and order products 
    const order = await tx.orders.create({
        data: {
            userId: req.user?.id!,
            netAmount: price,
             address: address?.formattedAddress!,
             products: {
                create: cartItems.map((cart:  any) => {
                    return {
                      productId: cart.productId,
                      quantity: cart.quantity
                    }
                }),
             }
        }
    });

    // 7. create evnet 
    const orderEvent = await tx.orderEvent.create({
        data: {
            orderId: order.id,
        }
    });

    // 7. Empty the cart
    await tx.cartItems.deleteMany({
        where: {
            userId: req.user?.id
        }
    });

    return res.json(order)
})

}

export const listOrders = async (req: Request, res:Response) => {
    const orders = await prismaClient.orders.findMany({
        where: {
            userId: req.user?.id
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    res.json(orders)
}

export const cancelOrder = async (req: Request, res:Response) => {
    // 1. wrap it inside transaction
    // 2. check if user is cancelling own order. or is admin
    try {
        const updatedOrder = await prismaClient.orders.update({
            where: {
                id: +req.params.id,
            },
            data:{
                 status: "CANCELLED"
            }
        });

        await prismaClient.orderEvent.create({
            data:{
                orderId: updatedOrder.id,
                status: "CANCELLED"
            }
        })
    
        res.json(updatedOrder)
      } catch (error) {
        throw new NotFoundException("Order not found", errorCode.NOT_FOUND);
      }
}


export const getOrderById = async (req: Request, res:Response) => {
  try {
    const order = await prismaClient.orders.findFirstOrThrow({
        where: {
            id: +req.params.id,
            userId: req.user?.id
        },
        include:{
            products: true,
            orderEvent: true
        }
    });

    res.json(order)
  } catch (error) {
    throw new NotFoundException("Order not found", errorCode.NOT_FOUND);
  }
}

export const listAllOrders = async (req: Request, res:Response) => {

    let whereCaluse = {}
    const status = req.query.status;
    if (status ) {
        whereCaluse = {
            status
        }
    }

    const allOrders = await prismaClient.orders.findMany({
        where: whereCaluse,
        skip: +req.query.skip! || 0,
        take: 5
    });
    res.json(allOrders);
}

export const listUserOrders = async (req: Request, res:Response) => {

    let whereCaluse: any = {
        userId: +req.params.id
    }
    const status = req.params.status;
    if (status ) {
        whereCaluse = {
           ...whereCaluse,
           status
        }
    }
    try {
        const order  = await prismaClient.orders.findMany({
               where: whereCaluse,
               skip: +req.query.skip! || 0,
               take: 5
            
        });

        res.json(order)
    } catch (error) {
        throw new NotFoundException('Order not found', errorCode.NOT_FOUND)
    }
}

export const changeOrderStatus = async (req: Request, res:Response) => {
    // Wrap it inside the transaction
    try {
        const order  = await prismaClient.orders.update({
            where:{
                id: +req.params.id
            },
            data:{
                status: req.body.status
            }
        });

        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: req.body.status
            }
        })

        res.json(order)
    } catch (error) {
        throw new NotFoundException('Order not found', errorCode.NOT_FOUND)
    }
}