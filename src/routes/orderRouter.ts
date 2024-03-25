import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { createCheckoutSession } from "../controllers/ordercontroller";
const orderRouter = express.Router();

orderRouter.post(
    '/checkout/create-checkout-session',
    jwtCheck,
    jwtParse,
    createCheckoutSession
)


export default orderRouter;