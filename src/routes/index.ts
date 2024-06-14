import {Router} from 'express'
import authRoutes from './auth';
import productsRoutes from './products';
import usersRoutes from './users';
import cartRoutes from './cart';
import ordersRoutes from './orders';


const rootRouter:Router = Router();


rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);
rootRouter.use('/users', usersRoutes);
rootRouter.use('/cart', cartRoutes);
rootRouter.use('/orders', ordersRoutes);


export default rootRouter;

/* 1. user manager
     a. list users
     b. get user by id
     c. change user role

     2. Order management
        a. list all orders (filter on status)
        b.Change order status
        c. List all order of given user
     3. products
        a. sEARCH API PRODUCTS (for both users and admins) => full text search.
 */