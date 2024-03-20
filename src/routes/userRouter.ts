import express from 'express';
import {createUser} from '../controllers/usercontroller';
import { jwtCheck } from '../middlewares/auth';
const userRouter = express.Router()

userRouter.post('/', jwtCheck, createUser)

export default userRouter