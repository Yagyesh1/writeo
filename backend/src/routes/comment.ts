import express from "express"
import { getComments } from "../controllers/comment/getComments"
import { deleteComment } from "../controllers/comment/deleteComment"
import { addComment } from "../controllers/comment/addComment"
import { updateComment } from "../controllers/comment/updateComment"
import { authMiddleware } from "../middleware/auth.middleware"

export const commentRouter = express.Router()

commentRouter.get('/',authMiddleware, getComments)
commentRouter.delete('/:commentId',authMiddleware, deleteComment)
commentRouter.post('/',authMiddleware, addComment)
commentRouter.put('/:commentId',authMiddleware, updateComment)