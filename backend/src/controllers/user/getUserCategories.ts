import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

export const getUserCategories = async(req: Request, res: Response)=>{
  try {
        const userId = req.userId
        const prisma = new PrismaClient()
       const categories =  await prisma.category.findMany({
            where:{
                user : {
                    some : {
                        userId
                    }
                }   
            }
        })
        res.json({
            categories,
            message : "categories fetched successfully",
            success: true
        })
  } catch (error) {
    return res.status(500).json({
        error : error instanceof Error ? error.message : error
    })
  }
}