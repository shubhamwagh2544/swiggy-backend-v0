import express from 'express';
import multer from 'multer';
import { createRestaurant, getMyRestaurantOrders, getRestaurant, updateOrderStatus } from '../controllers/restaurantcontroller';
import { jwtCheck, jwtParse } from '../middlewares/auth';
import { validateRestaurantRequests } from '../middlewares/validation';
const restaurantRouter = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024   // 5 MB file size limit
    }
})

restaurantRouter.post('/', upload.single('imageFile'), validateRestaurantRequests, jwtCheck, jwtParse, createRestaurant)

restaurantRouter.get('/', jwtCheck, jwtParse, getRestaurant)

restaurantRouter.get('/order', jwtCheck, jwtParse, getMyRestaurantOrders)

restaurantRouter.patch('/order/:orderId/status', jwtCheck, jwtParse, updateOrderStatus)

export default restaurantRouter