import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from 'jsonwebtoken'
import User from "../models/user";

declare global {
    namespace Express {
        interface Request {
            userId: string
            auth0Id: string
        }
    }
}

export const jwtCheck = auth({
    audience: "swiggy-api",
    issuerBaseURL: "https://dev-26pvwwybpf61vcgj.us.auth0.com/",
    tokenSigningAlg: 'RS256'
});

export const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    const token = authorization.split(' ')[1]
    if (!token && !token.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    // decode token to pass userId to req
    try {
        const decoded = jwt.decode(token) as jwt.JwtPayload
        const auth0Id = decoded.sub

        // find user by auth0Id
        const user = await User.findOne({
            auth0Id
        })
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
        req.userId = user._id.toString()
        req.auth0Id = user.auth0Id as string
        next()
    }
    catch (error) {
        console.log(error)
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}