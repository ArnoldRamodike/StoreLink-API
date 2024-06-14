import {Router} from 'express'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import { addAddress, deleteAddresss, listAddress, updateUser } from '../controllers/users.controller'
import adminMiddleware from '../middlewares/admin'

const usersRoutes: Router = Router()

usersRoutes.post("/address", [authMiddleware], errorHandler(addAddress))
usersRoutes.delete("/address/:id", [authMiddleware], errorHandler(deleteAddresss))
usersRoutes.get("/address", [authMiddleware], errorHandler(listAddress))
usersRoutes.put("/", [authMiddleware], errorHandler(updateUser))


export default usersRoutes;