import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
dotenv.config();
export const auth = (req: Request, res : Response, next : NextFunction)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.json({
            isAuthenticated : false,
            message : "Authorization header missing"
        })
    }
   const token =  authHeader?.split(' ')[1]
   if(!token){
     res.json({
        isAuthenticated : false,
        message : "Token Missing"
     })
   }
}