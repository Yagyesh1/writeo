import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { commentIdSchema } from "../../validations/comment.schema";
import { success, ZodError } from "zod";
const prisma = new PrismaClient()
export const deleteComment = async(req : Request, res: Response)=>{
try {
    const parsedUserId = commentIdSchema.parse(req.params.commentId)
    const comment = await prisma.comment.findUnique({
        where: {
            id : parsedUserId
        }
    }) 
    if(!comment){
        return res.status(403).json({
           success : false,
           message : "comment does not exist"
        })
    }
   await prisma.comment.delete({
        where : {
            id : parsedUserId
        }
    })
    res.status(200).json({
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