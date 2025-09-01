import { openai } from "@ai-sdk/openai";
export const aiModel = () => openai({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.AI_BASE_URL || undefined
})(process.env.OPENAI_MODEL || "gpt-4o-mini");
