import {Router} from 'express'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import { cancelOrder, createOrder, getOrderById,  listOrders } from '../controllers/order.controller'
import adminMiddleware from '../middlewares/admin'

const ordersRoutes: Router = Router()

ordersRoutes.post("/", [authMiddleware], errorHandler(createOrder))
ordersRoutes.put("/:id", [authMiddleware], errorHandler(cancelOrder))
ordersRoutes.get("/", [authMiddleware], errorHandler(listOrders))
ordersRoutes.get("/:id", [authMiddleware], errorHandler(getOrderById))


export default ordersRoutes;