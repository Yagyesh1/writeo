import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { success } from "zod";
export const followCategory = async (req: Request, res: Response)=>{
   try {
    if (!req.userId) {
       return res.status(400).json({ error: "User ID is required" });
    }
    const userId = req.userId;
    const categoryId = Number(req.body.categoryId)
    const prisma = new PrismaClient();
    const isExist = await prisma.userCategory.findFirst({
        where: {
            categoryId
        }
    })
    if(isExist){
        res.json({
            success : false,
            message : "category already followed by user" 
        })
    }
    const user = await prisma.userCategory.create({
      data: {
        userId,
        categoryId
      }
    });
    res.json({
        user,
        success: true,
        message : "Category followed successfully"
    })
   } catch (error) {
       return res.json({
        success : false,
        error: error instanceof Error ? error.message : String(error) 
       })
   }
}