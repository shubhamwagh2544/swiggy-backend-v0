import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter';
import { jwtCheck } from './middlewares/auth';
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

app.use(express.json())
app.use(cors())

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Health OK!'
    })
})

app.use('/api/user', userRouter)

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})