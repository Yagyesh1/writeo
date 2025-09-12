import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
interface authRequest extends Request{
    userId? : string;
}
export const authMiddleware = async(req: authRequest, res: Response, next : NextFunction)=>{
    try {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
       return res.json({
            isAuthenticated : false,
            message : "auth header missing / token is not valid"
        })
    }
    const token = authHeader.split(' ')[1]
    const decoded =  jwt.verify(token, process.env.JWT_SECRET as string)
    if (typeof decoded !== "object" || !("id" in decoded)) {
      return res.status(401).json({
        success: false,
        isAuthenticated: false,
        message: "Invalid token payload",
      });
    }
    req.userId = decoded.id as string
    next()
    } catch (error) {
      return res.status(401).json({
      success: false,
      isAuthenticated: false,
      message: "Token verification failed",
      error: error instanceof Error ? error.message : String(error),
    });
    }

}