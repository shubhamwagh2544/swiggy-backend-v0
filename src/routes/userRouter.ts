import express from 'express';
import {createUser} from '../controllers/usercontroller';
const userRouter = express.Router()

userRouter.post('/', createUser)

export default userRouter