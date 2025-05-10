import { Hono } from "hono";
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import z from 'zod'
export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string;
        JWT_SECRET: string;
       
    }
    Variables:{
        userId : string;
    }
}>()

blogRouter.use('/*', async(c, next)=>{
   try {
    const authHeader = c.req.header('Authorization') || "";
   
    const user = await verify(authHeader, c.env.JWT_SECRET) 
    if(!user){
        c.status(403)
      return c.json({message : "you are not logged in"}) 
    }
    c.set("userId", String(user.id));
    return await next();
   } catch (error) {
   
    console.log("error",error);
    return c.json({ message: "Invalid or expired token" }, 401);
   }
})


blogRouter.post('/',async (c)=>{
    try {
        const body = await c.req.json()
        
        const id = c.get("userId")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
   const blog =  await prisma.post.create({
        data: {
             title : body.title,
             content: body.content,
             authorId: id,
             categoryId: body.categoryId
        }
    })
    return c.json({id : blog.id}) 
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
blogRouter.put('/',async (c)=>{
   try {
    const body = await c.req.json()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
   const blog =  await prisma.post.update({
         where:{
             id : body.id
         },
        data: {
             title : body.title,
             content: body.content,
            
        }
    })
    return c.json({id : blog.id}) 
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
blogRouter.get('/bulk',async (c)=>{
   
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const blog = await prisma.post.findMany({
            select: {
                title: true,
                content: true,
              },
        })
        return c.json({blog}) 
    } catch (error) {
        console.log("error", error);
        return c.json(
            {
              error: "Something went wrong during signup. Please try again.",
            },
            500 
          );
    }
})
blogRouter.get('/:id',async(c)=>{
    
   try {
    const id =  c.req.param("id")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const blog = await prisma.post.findFirst({
        where:{
            id
        }
    })
    return c.json({blog}) 
   } catch (error) {
    console.log('error', error);
    c.status(411)
     return c.json({
        message : "error while fetching blog post"
     })
     
   }
})
