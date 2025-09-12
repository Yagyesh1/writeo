import {PrismaClient} from "../../backend/src/generated/prisma"
import {categories} from "../src/data/categories"
async function main(){
  try {
    const prisma = new PrismaClient()
   await prisma.category.createMany({
        data: categories
    })
  } catch (error) {
    throw new Error("something went wrong while seeding the database")    
  }
}

main().catch(console.error);
