import express from "express";
import { signup } from "../controllers/user/signup";
import { login } from "../controllers/user/login";
import { followCategory } from "../controllers/user/followCategory";
import { unfollowCategory } from "../controllers/user/unfollowCategory";
import { authMiddleware } from "../middleware/auth.middleware";
import { getUserCategories } from "../controllers/user/getUserCategories";

export const userRouter = express()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.post('/followCategory',authMiddleware, followCategory)
userRouter.post('/unfollowCategory',authMiddleware, unfollowCategory)
userRouter.post('/getUserCategories',authMiddleware, getUserCategories)