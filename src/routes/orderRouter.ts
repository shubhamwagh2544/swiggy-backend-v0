import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { createCheckoutSession, stripeWebhookHandler } from "../controllers/ordercontroller";
const orderRouter = express.Router();

orderRouter.post(
    '/checkout/create-checkout-session',
    jwtCheck,
    jwtParse,
    createCheckoutSession
)

orderRouter.post('/checkout/webhook', stripeWebhookHandler)

export default orderRouter;