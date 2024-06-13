import {Router} from 'express'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import { createProduct,listProducts, getProductById, updateProduct, deleteProduct } from '../controllers/products.controller'
import adminMiddleware from '../middlewares/admin'

const productsRoutes: Router = Router()

productsRoutes.post("/", [authMiddleware, adminMiddleware], errorHandler(createProduct))
productsRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listProducts))
productsRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getProductById))
productsRoutes.put("/:id", [authMiddleware, adminMiddleware], errorHandler(updateProduct))
productsRoutes.delete("/:id", [authMiddleware, adminMiddleware], errorHandler(deleteProduct))



export default productsRoutes;