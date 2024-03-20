import express from 'express';
import { createUser, updateUser } from '../controllers/usercontroller';
import { jwtCheck } from '../middlewares/auth';
import { validateUserRequests } from '../middlewares/validation';
const userRouter = express.Router()

userRouter.post('/', jwtCheck, createUser)

userRouter.put('/', jwtCheck, validateUserRequests, updateUser)

export default userRouter