import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { blogIdSchema, categoryIdSchema, titleSchema } from "../../validations/blog.schema";
import { tiptapDocumentSchema } from "../../validations/tiptap.schema";
  const prisma = new PrismaClient()
export const updateBlogs = async (req: Request, res: Response) => {
  try {
      const blogId = blogIdSchema.parse(req.params.blogId)
      let title;
      if(req.body.title){
        title = titleSchema.parse(req.body.title)
      }
      let content;
      if(req.body.content){
        content =  tiptapDocumentSchema.parse(req.body.content)
      }
      let categoryId;
      if(req.body.categoryId){
         categoryId = categoryIdSchema.parse(req.body.categoryId)
      }
      const blog = await prisma.post.update({
      where: { id : blogId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(categoryId !== undefined ? { categoryId } : {}),
      },
    });

    return res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error: any) {
         console.log(error.message);
          return res.json({
            success : false,
            errorMessage : error.message
        })
    }
};
