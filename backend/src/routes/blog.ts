import express from 'express'
import { createBlog } from '../controllers/blogs/createBlog'
import { deleteBlogs } from '../controllers/blogs/deleteBlog'
import { getBlogsById } from '../controllers/blogs/getBlogById'
import { getBlogs } from '../controllers/blogs/getBlogs'
import { updateBlogs } from '../controllers/blogs/updateBlog'
import { authMiddleware } from '../middleware/auth.middleware'
export const blogRouter = express()

blogRouter.get('/bulk',authMiddleware, getBlogs)
blogRouter.post('/',authMiddleware, createBlog)
blogRouter.delete('/:blogId',authMiddleware, deleteBlogs)
blogRouter.get('/:blogId',authMiddleware, getBlogsById)
blogRouter.put('/:blogId',authMiddleware, updateBlogs)
