import express from "express";
import {search} from "../controllers/searchcontroller";
const searchRouter = express.Router()

searchRouter.get('/search/:city', search)