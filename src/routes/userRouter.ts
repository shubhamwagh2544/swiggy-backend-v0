import express from 'express';
import {createUser, updateUser} from '../controllers/usercontroller';
import { jwtCheck } from '../middlewares/auth';
const userRouter = express.Router()

userRouter.post('/', jwtCheck, createUser)

userRouter.put('/', jwtCheck, updateUser)

export default userRouter