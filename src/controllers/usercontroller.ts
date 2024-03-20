import { Request, Response } from "express";
import User from "../models/user";

async function createUser(req: Request, res: Response) {
    try {
        const { auth0Id } = req.body
        const existingUser = await User.findOne({
            auth0Id
        })
        //TODO: recheck
        if (existingUser) {
            return res.status(200).json({
                user: existingUser
            })
        }
        const newUser = new User(req.body)
        await newUser.save()
        return res.status(201).json({
            user: newUser.toObject()
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error creating user'
        })
    }
}

async function updateUser(req: Request, res: Response) {
    try {
        const { name, addressLine, city, country } = req.body
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // name, addressLine, city, country are required fields in the frontend
        user.name = name
        user.addressLine = addressLine
        user.city = city
        user.country = country

        await user.save()
        return res.status(200).json({
            user: user.toObject()
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error updating user'
        })
    }
}

export {
    createUser,
    updateUser
}