import { Request, Response } from "express";
import User from "../models/user";

async function createUser(req: Request, res: Response) {
    try {
        const { auth0Id } = req.body
        const existingUser = await User.findOne({
            auth0Id
        })
        //TODO: code smell
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


export {
    createUser
}