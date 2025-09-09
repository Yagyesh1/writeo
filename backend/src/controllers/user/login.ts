import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();
 const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

 type loginSchemaType = z.infer<typeof loginSchema>;
export const login = async (req: Request, res: Response) => {
  try {
    const parsedData: loginSchemaType = loginSchema.parse(req.body);
    const { email, password } = parsedData;
    const userData = await prisma.user.findUnique({
      where: { email },
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
