import { z } from "zod";

const chatModelSchema = z.object({
  id: z.string(),
  isFree: z.boolean(),
  name: z.string(),
  supportsChat: z.boolean(),
});

const modelCapabilitiesSchema = z.object({
  reasoning: z.boolean(),
  tools: z.boolean(),
  vision: z.boolean(),
});

export const modelCatalogSchema = z.object({
  capabilities: z.record(z.string(), modelCapabilitiesSchema),
  models: z.array(chatModelSchema),
});

export type ChatModel = z.infer<typeof chatModelSchema>;
export type ModelCapabilities = z.infer<typeof modelCapabilitiesSchema>;
export type ModelCatalog = z.infer<typeof modelCatalogSchema>;
