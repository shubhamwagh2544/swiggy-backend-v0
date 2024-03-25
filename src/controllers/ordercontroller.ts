import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import Restaurant, { MenuItemType } from '../models/restaurant';
import Order from '../models/order';
import User from '../models/user';
dotenv.config()

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string)
const FRONTEND_URL = process.env.FRONTEND_URL as string
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string

type CheckoutSessionRequest = {
    cartItems: {
        menuItemId: string
        name: string
        quantity: string
    }[]
    deliveryDetails: {
        email: string | undefined
        name: string
        addressLine: string
        city: string
        country: string
    }
    restaurantId: string
}

async function createCheckoutSession(req: Request, res: Response) {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId)

        if (!restaurant) {
            throw new Error('Restaurant not found')
        }

        const user = await User.findById(req.userId)

        const newOrder = new Order({
            restaurant: restaurant,
            user: {
                _id: user?._id,
                name: user?.name,
                email: user?.email,
            },
            status: 'placed',
            deliveryDetails: {
                email: user?.email,
                name: checkoutSessionRequest.deliveryDetails.name,
                addressLine: checkoutSessionRequest.deliveryDetails.addressLine,
                city: checkoutSessionRequest.deliveryDetails.city,
                country: checkoutSessionRequest.deliveryDetails.country
            },
            cartItems: [],
            createdAt: new Date()
        })

        for (const cartItem of checkoutSessionRequest.cartItems) {
            const menuItem = restaurant.menuItems.find(item => item._id.toString() === cartItem.menuItemId)
            if (!menuItem) {
                throw new Error(`Menu item not found: ${cartItem.menuItemId}`)
            }
            newOrder.cartItems.push({
                menuItemId: cartItem.menuItemId,
                name: cartItem.name,
                quantity: cartItem.quantity,
                price: menuItem.price
            })
        }

        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems)

        const session = await createSession(
            lineItems,
            newOrder._id.toString(),
            restaurant.deliveryPrice,
            restaurant._id.toString()
        )

        if (!session.url) {
            return res.status(500).json({
                message: 'Error creating Stripe session'
            })
        }

        await newOrder.save()

        return res.status(200).json({
            url: session.url
        })
    }
    catch (error: any) {
        console.log(error)
        res.status(500).json({
            message: error.raw.message
        })
    }
}

function createLineItems(checkoutSessionRequest: CheckoutSessionRequest, menuItems: MenuItemType[]) {
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((menuItem) => menuItem._id.toString() === cartItem.menuItemId.toString())
        if (!menuItem) {
            throw new Error(`Menu item not found: ${cartItem.menuItemId}`)
        }

        const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data: {
                currency: 'usd',
                unit_amount: menuItem.price * 100,
                product_data: {
                    name: menuItem.name
                }
            },
            quantity: parseInt(cartItem.quantity)
        }

        return line_item
    })

    return lineItems
}

async function createSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    orderId: string,
    deliveryPrice: number,
    restaurantId: string
) {
    const sessionData = await STRIPE.checkout.sessions.create({
        line_items: lineItems,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'Delivery',
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: deliveryPrice * 100,
                        currency: 'usd'
                    }
                }
            }
        ],
        mode: 'payment',
        metadata: {
            orderId,
            restaurantId
        },
        success_url: `${FRONTEND_URL}/order-status?success=true`,
        cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`
    })

    return sessionData
}

async function stripeWebhookHandler(req: Request, res: Response) {
    let event;
    try {
        const signature = req.headers['stripe-signature']
        event = STRIPE.webhooks.constructEvent(
            req.body,
            signature as string,
            STRIPE_WEBHOOK_SECRET
        )
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error processing Stripe webhook'
        })
    }

    if (event.type === 'checkout.session.completed') {
        const order = await Order.findById(event.data.object.metadata?.orderId)

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        if (event.data.object.amount_total !== null) {
            order.totalAmount = event.data.object.amount_total / 100
        }
        order.status = 'paid'

        await order.save()
    }
}

async function getMyOrders(req: Request, res: Response) {
    try {
        const orders = await Order.find({
            user: req.userId
        })
            .populate('restaurant')
            .populate('user')

        res.status(200).json(orders)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error fetching orders'
        })
    }
}

export {
    createCheckoutSession,
    stripeWebhookHandler,
    getMyOrders
}