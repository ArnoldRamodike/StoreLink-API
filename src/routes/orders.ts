import {Router} from 'express'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import { cancelOrder, createOrder, getOrderById,  listOrders, changeOrderStatus,  listAllOrders, listUserOrders } from '../controllers/order.controller'
import adminMiddleware from '../middlewares/admin'

const ordersRoutes: Router = Router()

ordersRoutes.post("/", [authMiddleware], errorHandler(createOrder))
ordersRoutes.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder))
ordersRoutes.get("/", [authMiddleware], errorHandler(listOrders))
ordersRoutes.get("/index", [authMiddleware, adminMiddleware], errorHandler(listAllOrders))
ordersRoutes.get("/users/:id", [authMiddleware], errorHandler(listUserOrders))
ordersRoutes.put("/status/:id", [authMiddleware], errorHandler(changeOrderStatus))
ordersRoutes.get("/:id", [authMiddleware], errorHandler(getOrderById))

export default ordersRoutes;
