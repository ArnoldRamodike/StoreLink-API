import {Router} from 'express'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import { addAddress, deleteAddresss, listAddress, updateUser, changeUserRole, getUserById, listUsers } from '../controllers/users.controller'
import adminMiddleware from '../middlewares/admin'

const usersRoutes: Router = Router()

usersRoutes.post("/address", [authMiddleware], errorHandler(addAddress));
usersRoutes.delete("/address/:id", [authMiddleware], errorHandler(deleteAddresss));
usersRoutes.get("/address", [authMiddleware], errorHandler(listAddress));
usersRoutes.put("/", [authMiddleware], errorHandler(updateUser));
usersRoutes.put("/role/:id", [authMiddleware, adminMiddleware], errorHandler(changeUserRole));
usersRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listUsers));
usersRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getUserById));


export default usersRoutes;