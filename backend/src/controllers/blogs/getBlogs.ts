import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { limitParamsSchema, pageParamsSchema } from "../../validations/blog.schema";
const prisma = new PrismaClient()
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const page = pageParamsSchema.parse(req.query.page);
    const limit = limitParamsSchema.parse(req.query.limit);
    const skip = (page-1)*limit
   const blogs = await prisma.post.findMany({
      skip : skip,
      take : limit
    })
  res.json({
    success : true,
    blogs,
    message : "blogs fetched successfully"
  })

  } catch (error: any) {
         console.log(error.message);
          return res.json({
            success : false,
            errorMessage : error.message
        })
    }
};
