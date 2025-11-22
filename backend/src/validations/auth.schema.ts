import z, { email, string } from "zod"

export const signupSchema = z.object({
    email : z.email(),
    password : z.string().min(6),
    name : z.string()
})
 export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const userIdSchema = z.string()
