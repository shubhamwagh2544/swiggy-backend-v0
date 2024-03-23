import express from "express";
import { searchRestaurant } from "../controllers/searchcontroller";
import { param } from "express-validator";
const searchRouter = express.Router()

searchRouter.get(
    '/:city',
    param('city').isString().trim().notEmpty().withMessage('City must be string and is required'),
    searchRestaurant
)

export default searchRouter