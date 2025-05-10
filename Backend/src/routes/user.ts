import { Hono,Context } from "hono";
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>()
interface CustomContext extends Context {
  user?: { id: string } 
}
const authMiddleware = async (c: CustomContext, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const user = await verify(token, c.env.JWT_SECRET) 
    c.set('user', {id : user.id}) 
    await next()
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

userRouter.post('/auth',authMiddleware, async(c)=>{
  try {
         const {id} = c.get("user")
         const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
      const user =  await prisma.user.findFirst({
          where:{
             id
            }
        })
        if(!user){
          return c.json({
            error : 'manipulated token'
          })
        }
        return c.json({
          isAuthenticated: true, user
        })
  } catch (error) {
   console.log('an error occured',error);
   }
})

userRouter.post('/signup', async (c) => {
  try {
    if (!c.env.JWT_SECRET || !c.env.DATABASE_URL) {
      return c.json({ error: "Server misconfiguration" }, 500);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }

    if (!body.email || !body.password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const isAlreadyExist = await prisma.user.findFirst({
      where: { email: body.email }
    });

    if (isAlreadyExist) {
      return c.json({ error: "user already exists" }, 400);
    }


    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name || "",
      }
    });

    const jwt = await sign({ id: user.id ,exp: Math.floor(Date.now() / 1000) + 60 * 60 }, c.env.JWT_SECRET );

    return c.json({ jwt, user, message: "sign up successful" });

  } catch (error: any) {
    console.log("Signup error:", error);
    return c.json({ error: error.message || "Internal Server Error" }, 500);
  }
});

userRouter.post('/signin',async(c)=>{
    try {
     const prisma = new PrismaClient({
       datasourceUrl : c.env.DATABASE_URL
      }).$extends(withAccelerate())
      const body = await c.req.json()
      const user = await prisma.user.findUnique({
       where:{
         email : body.email,
         password: body.password
       }
   
      })
      if(!user){
        c.status(403)
        return c.json({error : "user not found"})
      }
      const jwt = await sign({id : user.id}, c.env.JWT_SECRET)
      return c.json({jwt, user, message: "login successful"})
    } catch (error) {
     console.log("error",error);
     return c.json(
      {
        error: "Something went wrong during signup. Please try again.",
      },
      500 
    );
    }
   
})