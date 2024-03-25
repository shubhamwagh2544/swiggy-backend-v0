import express from "express";
import { getSearchedRestaurant, searchRestaurant } from "../controllers/searchcontroller";
import { param } from "express-validator";
const searchRouter = express.Router()

searchRouter.get(
    '/:city',
    param('city').isString().trim().notEmpty().withMessage('City must be string and is required'),
    searchRestaurant
)

searchRouter.get(
    '/detail/:restaurantId',
    param('restaurantId').isString().trim().notEmpty().withMessage('Restaurant ID must be string and is required'),
    getSearchedRestaurant
)

export default searchRouter