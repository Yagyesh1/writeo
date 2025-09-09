import express from "express";
import { signup } from "../controllers/user/signup";
import { login } from "../controllers/user/login";

export const userRouter = express()

userRouter.post('/signup', signup)
userRouter.post('/login', login)