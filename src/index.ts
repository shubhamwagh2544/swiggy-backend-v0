import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary'
import userRouter from './routes/userRouter';
import restaurantRouter from './routes/restaurantRouter';
import searchRouter from './routes/searchRouter';
import orderRouter from './routes/orderRouter';
dotenv.config()
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL as string)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err)
    })

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// cors
app.use(cors())

// stripe webhook
app.use('/api/order/checkout/webhook', express.raw({ type: '*/*' }))

// json body parser 
app.use(express.json())

// health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Health OK!'
    })
})

// routes
app.use('/api/user', userRouter)
app.use('/api/restaurant', restaurantRouter)
app.use('/api/search', searchRouter)
app.use('/api/order', orderRouter)

// server start
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
