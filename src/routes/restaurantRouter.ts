import express from 'express';
import multer from 'multer';
import { createRestaurant } from '../controllers/restaurantcontroller';
import { jwtCheck, jwtParse } from '../middlewares/auth';
const restaurantRouter = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024   // 5 MB file size limit
    }
})

restaurantRouter.post('/', jwtCheck, jwtParse, upload.single('image'), createRestaurant)

export default restaurantRouter