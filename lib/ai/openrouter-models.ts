import "server-only";

import { z } from "zod";
import {
  DEFAULT_CHAT_MODEL,
  defaultChatModel,
  type ModelCatalog,
} from "./models";

const freeModelSchema = z.object({
  architecture: z.object({
    input_modalities: z.array(z.string()),
    output_modalities: z.array(z.string()),
  }),
  id: z.string().endsWith(":free"),
  name: z.string(),
  pricing: z.object({
    completion: z.union([z.literal("0"), z.literal(0)]),
    prompt: z.union([z.literal("0"), z.literal(0)]),
  }),
  supported_parameters: z.array(z.string()),
});

export async function getModelCatalog(): Promise<ModelCatalog> {
  const catalog: ModelCatalog = {
    capabilities: {
      [DEFAULT_CHAT_MODEL]: { reasoning: true, tools: true, vision: true },
    },
    models: [defaultChatModel],
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) {
      return catalog;
    }

    const payload = z
      .object({ data: z.array(z.unknown()) })
      .parse(await response.json());
    for (const entry of payload.data) {
      const parsed = freeModelSchema.safeParse(entry);
      if (!parsed.success) {
        continue;
      }
      const model = parsed.data;
      if (
        !model.architecture.input_modalities.includes("text") ||
        !model.architecture.output_modalities.includes("text")
      ) {
        continue;
      }
      catalog.models.push({ id: model.id, name: model.name });
      catalog.capabilities[model.id] = {
        reasoning: model.supported_parameters.includes("reasoning"),
        tools: model.supported_parameters.includes("tools"),
        vision: model.architecture.input_modalities.includes("image"),
      };
    }
  } catch {
    // Keep OpenRouter's free fallback available if discovery is temporarily offline.
  }

  return catalog;
}
