import { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import Restaurant from '../models/restaurant'
import mongoose from 'mongoose'

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

export {
    createRestaurant,
    getRestaurant
}