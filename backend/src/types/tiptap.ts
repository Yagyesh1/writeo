export interface TiptapNode {
  [key: string]: any;
  type?: string;
  text?: string;
  attrs?: Record<string, any>;
  marks?: Array<Record<string, any>>;
  content?: TiptapNode[];
}
