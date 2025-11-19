import { z } from "zod";

// Basic text node
const textNode = z.object({
  type: z.literal("text"),
  text: z.string(),
  marks: z
    .array(
      z.object({
        type: z.string()
      })
    )
    .optional()
});

// Generic node (paragraph, heading, bulletList, etc.)
const genericNode: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.string(), z.any()).optional(),
    content: z.array(nodeSchema).optional(),
    marks: z.array(z.any()).optional()
  })
);

// Node schema = text OR generic node
const nodeSchema: z.ZodType<any> = z.union([textNode, genericNode]);

// Top-level TipTap doc schema
export const tiptapDocumentSchema = z.object({
  type: z.literal("doc"),
  content: z.array(nodeSchema).optional()
});

export type TiptapDocument = z.infer<typeof tiptapDocumentSchema>;
