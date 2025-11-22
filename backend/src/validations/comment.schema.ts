import z from "zod"

export const commentschema = z.object({
    postId : z.string(),
    description : z.string(),
    parentId : z.string().nullable()
})

export const commentIdSchema = z.string()