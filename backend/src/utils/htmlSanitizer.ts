import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const window = new JSDOM("").window;

const purify = createDOMPurify(window as any);

export const sanitizeHTML = (dirty: string): string => {
  return purify.sanitize(dirty);
};
