import express from "express";
import { signup } from "../controllers/user/signup";

export const userRouter = express()

userRouter.post('/signup', signup)