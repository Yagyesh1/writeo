import express from 'express'
import { createBlog } from '../controllers/blogs/createBlog'
import { authMiddleware } from '../middleware/auth.middleware'

export const blogRouter = express()

blogRouter.post('/',authMiddleware, createBlog)

