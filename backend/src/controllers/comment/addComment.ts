import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { commentschema } from "../../validations/comment.schema";
import { ZodError } from "zod";
import { userIdSchema } from "../../validations/auth.schema";
import { log } from "console";

const prisma = new PrismaClient()
export const addComment = async (req : Request, res: Response)=>{
  try {
    console.log(typeof req.userId);
    console.log(req.userId);
    const userId = userIdSchema.parse(req.userId)
    const parsed = commentschema.parse(req.body);
    const { postId, description, parentId } = parsed;
    
     const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, postId: true },
      });

      if (!parent) {
        return res.status(400).json({
          success: false,
          message: "Parent comment not found",
        });
      }

      if (parent.postId !== postId) {
        return res.status(400).json({
          success: false,
          message: "Parent comment belongs to a different post",
        });
      }
    }

      const comment = await prisma.comment.create({
      data: {
        userId,
        postId,
        description,
        parentId: parentId || null,
        updatedAt : new Date()
      },
      include: {
        user: { select: { id: true, name: true} }
      },
    });
      res.status(201).json({
        success : true,
        comment,
        message : "new comment added successfully"
      })
  } catch (error: any) {
      if(error instanceof ZodError){
        console.log(error.issues);
        return res.status(500).json({
            success : false,
            errorMessage : error.issues
        })
      }
      return res.status(500).json({
        success : false,
        errorMessage : error.message
      })
  }
}