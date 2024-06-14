import {Router} from 'express'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import { addItemToCart,changeQuantity, deleteItemsFromCart, getCart } from '../controllers/cart.controller'
import adminMiddleware from '../middlewares/admin'

const cartRoutes: Router = Router()

cartRoutes.post("/", [authMiddleware], errorHandler(addItemToCart))
cartRoutes.delete("/:id", [authMiddleware], errorHandler(deleteItemsFromCart))
cartRoutes.get("/", [authMiddleware], errorHandler(getCart))
cartRoutes.put("/:id", [authMiddleware], errorHandler(changeQuantity))


export default cartRoutes;