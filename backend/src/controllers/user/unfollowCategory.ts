import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

export const unfollowCategory = async (req: Request, res: Response)=>{
  try {
      if(!req.userId){
          return res.json({
              success: false,
              message: "UserId is missing"
            })
        }
        const userId = req.userId
        const  categoryId  = Number(req.body.categoryId);
       const prisma = new PrismaClient()
       
       const user = await prisma.userCategory.delete({
        where:{
            userId_categoryId :{ 
                userId,
                categoryId 
            }
        }
       })
       res.json({
           success : true,
           message: "Category unfollowed successfully"
       })

  } catch (error) {
    return res.json({
        success: false,
        errorMessage : error instanceof Error ? error.message : error
    })
  }
}