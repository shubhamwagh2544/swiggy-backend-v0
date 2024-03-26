import e, { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import Restaurant from '../models/restaurant'
import mongoose from 'mongoose'
import Order from '../models/order'

async function createRestaurant(req: Request, res: Response) {
    try {
        const existingRestaurant = await Restaurant.findOne({
            user: req.userId
        })
        if (existingRestaurant) {
            return res.status(409).json({               // 409 Conflict
                message: 'Restaurant already exists'
            })
        }
        const image = req.file as Express.Multer.File
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`

        const uploadResponse = await cloudinary.uploader.upload(dataURI)
        const newRestaurant = new Restaurant(req.body)
        newRestaurant.imageUrl = uploadResponse.url
        newRestaurant.user = new mongoose.Types.ObjectId(req.userId)
        newRestaurant.lastUpdated = new Date()

        await newRestaurant.save()
        return res.status(201).json({
            restaurant: newRestaurant.toObject()
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error creating restaurant'
        })
    }
}

async function getRestaurant(req: Request, res: Response) {
    try {
        const restaurant = await Restaurant.findOne({
            user: req.userId
        })
        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant does not exists"
            })
        }
        return res.status(200).json({
            restaurant
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error fetching restaurant'
        })
    }
}

async function getMyRestaurantOrders(req: Request, res: Response) {
    try {
        const restaurant = await Restaurant.findOne({
            user: req.userId
        })
        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant does not exists"
            })
        }
        const orders = await Order.find({
            restaurant: restaurant._id
        })
            .populate('restaurant')
            .populate('user')

        return res.status(200).json(orders)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error fetching restaurant orders'
        })
    }
}

async function updateOrderStatus(req: Request, res: Response) {
    try {
        const { orderId } = req.params
        const { status } = req.body

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        const restaurant = await Restaurant.findById(order.restaurant)
        if (restaurant?.user?._id.toString() !== req.userId) {
            return res.status(403).json({
                message: 'Forbidden'
            })
        }

        order.status = status
        await order.save()

        return res.status(200).json(order)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error updating order status'
        })
    }
}

export {
    createRestaurant,
    getRestaurant,
    getMyRestaurantOrders,
    updateOrderStatus
}