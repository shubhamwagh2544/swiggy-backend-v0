import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()
}

export const validateUserRequests = [
    body('name').isString().notEmpty().withMessage('Name must be a string'),
    body('addressLine').isString().notEmpty().withMessage('Address line must be a string'),
    body('city').isString().notEmpty().withMessage('City must be a string'),
    body('country').isString().notEmpty().withMessage('Country must be a string'),
    handleValidationErrors
]

export const validateRestaurantRequests = [
    body('restaurantName').isString().notEmpty().withMessage('Restaurant name must be a string and is required'),
    body('city').isString().notEmpty().withMessage('City must be a string and is required'),
    body('country').isString().notEmpty().withMessage('Country must be a string and is required'),
    body('deliveryPrice').isFloat({ min: 0 }).withMessage('Delivery price must be a positive number'),
    body('estimatedDeliveryTime').isInt({ min: 0 }).withMessage('Estimated delivery time must be a positive integer'),
    body('cuisines').isArray().withMessage('Cuisines must be an array').not().notEmpty().withMessage('Cuisines must not be empty'),
    body('menuItems').isArray().withMessage('Menu items must be an array').not().notEmpty().withMessage('Menu items must not be empty'),
    body('menuItems.*.name').isString().notEmpty().withMessage('Menu item name must be a string and is required'),
    body('menuItems.*.price').isFloat({ min: 0 }).withMessage('Menu item price must be a positive number'),
    handleValidationErrors
]