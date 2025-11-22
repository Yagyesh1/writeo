import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { commentIdSchema } from "../../validations/comment.schema";
import { success, ZodError } from "zod";
import { buildTree } from "../../utils/buildTree";
const prisma = new PrismaClient()
export const getComments = async(req : Request, res: Response)=>{
try {
    const comments = await prisma.comment.findMany({
        select : {
            id : true,
            description : true,
            userId: true,
            postId: true,
            parentId: true
        }
    })
    const commentsTree = buildTree(comments)
    res.status(200).json({
        comment : commentsTree,
        success : true,
        message : "comment deleted successfully"
    })
} catch (error: any) {
    if(error instanceof ZodError){
        console.log(error.issues);
        res.status(403).json({
            success : false,
            message : error.issues
        })
    }
    console.log(error.message);
    res.status(500).json({
        success : false,
        errorMessage : error.message
    })
}
}