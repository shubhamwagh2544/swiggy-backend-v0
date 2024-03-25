import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { createCheckoutSession, getMyOrders, stripeWebhookHandler } from "../controllers/ordercontroller";
const orderRouter = express.Router();

orderRouter.post(
    '/checkout/create-checkout-session',
    jwtCheck,
    jwtParse,
    createCheckoutSession
)

orderRouter.post('/checkout/webhook', stripeWebhookHandler)

orderRouter.get('/', jwtCheck, jwtParse, getMyOrders)

export default orderRouter;