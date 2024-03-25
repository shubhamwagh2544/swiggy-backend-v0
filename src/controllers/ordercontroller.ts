import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import Restaurant, { MenuItemType } from '../models/restaurant';
dotenv.config()

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string)
const FRONTEND_URL = process.env.FRONTEND_URL as string

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

        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems)

        const session = await createSession(
            lineItems,
            "Test_Order_Id",
            restaurant.deliveryPrice,
            restaurant._id.toString()
        )

        if (!session.url) {
            return res.status(500).json({
                message: 'Error creating Stripe session'
            })
        }

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


export {
    createCheckoutSession
}