import z from "zod"

export const categoryIdSchema = z.number()
export const titleSchema = z.string().min(10, "title must have 10 character")
export const descriptionSchema = z.string()
export const autherIdSchema = z.string()
export const blogIdSchema = z.string()
export const pageParamsSchema = z.number().default(1)
export const limitParamsSchema = z.number().default(10)
export const isPublisedSchema = z.boolean().default(false)