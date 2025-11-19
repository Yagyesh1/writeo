import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { blogIdSchema } from "../../validations/blog.schema";
import { ZodError } from "zod";
const prisma = new PrismaClient()
export const deleteBlogs = async (req: Request, res: Response) => {
  try {
     const blogId = blogIdSchema.parse(req.params.blogId)
     await prisma.post.delete({
        where : {
            id : blogId
        }
     })
     res.status(200).json({
        message : "Blog deleted successfully"
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
