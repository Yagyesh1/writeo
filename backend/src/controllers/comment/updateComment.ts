import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { commentIdSchema } from "../../validations/comment.schema";
import { ZodError } from "zod";
import { descriptionSchema } from "../../validations/blog.schema";
const prisma = new PrismaClient()
export const updateComment = async(req : Request, res: Response)=>{
try {
    const parsedCommentId = commentIdSchema.parse(req.params.commentId)
    const parsedDescription = descriptionSchema.parse(req.body.description)
    const comment = await prisma.comment.findUnique({
        where: {
            id : parsedCommentId
        }
    }) 
    if(!comment){
        return res.status(403).json({
           success : false,
           message : "comment does not exist"
        })
    }
   const upadatedComment = await prisma.comment.update({
        where : {
            id : parsedCommentId
        },
        data : {
           description : parsedDescription
        }
    })
    res.status(200).json({
        upadatedComment,
        success : true,
        message : "comment updated successfully"
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