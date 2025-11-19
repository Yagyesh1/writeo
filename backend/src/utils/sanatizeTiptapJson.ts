import { sanitizeHTML } from "./htmlSanitizer";
import { TiptapNode } from "../types/tiptap";

export function sanitizeTiptapJSON(node: TiptapNode): TiptapNode {
  if (!node) return node;

  if (typeof node.text === "string") {
    return { ...node, text: sanitizeHTML(node.text) };
  }

  if (Array.isArray(node.content)) {
    return {
      ...node,
      content: node.content.map(child => sanitizeTiptapJSON(child))
    };
  }

  return node;
}
