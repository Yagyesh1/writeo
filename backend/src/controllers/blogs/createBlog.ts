import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { tiptapDocumentSchema } from "../../validations/tiptap.schema";
import  { ZodError } from "zod"
import { sanitizeTiptapJSON } from "../../utils/sanatizeTiptapJson";
import { autherIdSchema, categoryIdSchema, isPublisedSchema, titleSchema } from "../../validations/blog.schema";
const prisma = new PrismaClient()
export const createBlog = async (req: Request, res: Response) => {
      console.log(req.userId);
      try {
         const parsedIsPublised = isPublisedSchema.parse(req.body.isPublised)
         const parsedUserId = autherIdSchema.parse(req.userId)
         const parsedContent =  tiptapDocumentSchema.parse(req.body.content)
         const cleanedContent  = sanitizeTiptapJSON(parsedContent);
         const parsedTitle = titleSchema.parse(req.body.title) 
         const parsedCategoryId = categoryIdSchema.parse(req.body.categoryId)
        const post = await prisma.post.create({
            data : {
                title : parsedTitle,
                content : cleanedContent,
                authorId : parsedUserId,
                categoryId: parsedCategoryId,
                published: parsedIsPublised
            }
           })
        return res.status(200).json({
            success : true,
            post,
            message : "post created successfully"
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
