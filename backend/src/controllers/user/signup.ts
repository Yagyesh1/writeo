import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import "dotenv/config";
import z from "zod"
import { signupSchema } from "../../validations/auth.schema";
type SignupInput = z.infer<typeof signupSchema>;
export const signup = async (req : Request, res : Response)=>{
    try {
        console.log(req.body);
        
        const parsedData : SignupInput = signupSchema.parse(req.body)
        const {email, password, name} = parsedData
        const prisma = new PrismaClient();
        const isAlreadyExits = await prisma.user.findUnique({
            where : {
                email
            }
        })
        if(isAlreadyExits){
          return  res.json({
             message : "userAlready Exist",
           })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                email,
                password : hashedPassword,
                name
            }
        })
        const JWT_SECRET = process.env.JWT_SECRET
        if(!JWT_SECRET){
          throw new Error("JWT_SECRET is not defined in environment variables")
        }
        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({
            message: "user signed up successfully",
            data: {email : newUser.email, name : newUser.name},
            token
        })
    } catch (err) {
        if (err instanceof z.ZodError) {
           return res.status(400).json({
             message: "Validation error",
             errors: err.issues.map(e => ({
               field: e.path[0],
               message: e.message,
             })),
           });
        }
      console.error(err);
      res.status(500).json({ message: "Something went wrong",err });
    }
}