import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { blogIdSchema } from "../../validations/blog.schema";
import { ZodError } from "zod";
const prisma = new PrismaClient()
export const getBlogsById = async (req: Request, res: Response) => {
   try {
      const blogId = blogIdSchema.parse(req.params.blogId)
      
     const blog =  await prisma.post.findFirst({
             where : {
                id : blogId
             }
          })
     if(!blog){
        return res.status(400).json({
            success : false,
            message : "incorrect blog id provided"
        })
     }
     res.status(200).json({
        success : true,
        blog,
        message: "blog fetched successfully"
     })
   } catch (error: any) {
         if(error instanceof ZodError){
            console.log(error.issues);
            return res.status(400).json({
            success : false,
            message : error.issues[0].message
            })
        }
         console.log(error.message);
          return res.json({
            success : false,
            errorMessage : error.message
        })
    }
};
