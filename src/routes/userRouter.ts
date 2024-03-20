import express from 'express';
import { createUser, getUser, updateUser } from '../controllers/usercontroller';
import { jwtCheck, jwtParse } from '../middlewares/auth';
import { validateUserRequests } from '../middlewares/validation';
const userRouter = express.Router()


userRouter.post('/', jwtCheck, createUser)

userRouter.put('/', jwtCheck, jwtParse, validateUserRequests, updateUser)

userRouter.get('/', jwtCheck, jwtParse, getUser)


export default userRouter