import "server-only";

import { z } from "zod";
import { ChatbotError } from "@/lib/errors";
import type { ModelCatalog } from "./models";

const zeroPrice = z
  .union([z.number(), z.string()])
  .refine(
    (price) =>
      (typeof price === "number" || price.trim() !== "") && Number(price) === 0
  );

const freeModelSchema = z.object({
  architecture: z.object({
    input_modalities: z.array(z.string()),
    output_modalities: z.array(z.string()),
  }),
  id: z.string().min(1),
  name: z.string().min(1),
  pricing: z
    .object({ completion: zeroPrice, prompt: zeroPrice })
    .catchall(zeroPrice.nullable()),
  supported_parameters: z.array(z.string()).optional().default([]),
});

const catalogSchema = z.object({ data: z.array(z.unknown()) });

export async function getModelCatalog(): Promise<ModelCatalog> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new ChatbotError("offline:provider");
  }

  const response = await fetch("https://openrouter.ai/api/v1/models/user", {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);

  if (response?.status === 401 || response?.status === 403) {
    throw new ChatbotError("forbidden:provider");
  }
  if (!response?.ok) {
    throw new ChatbotError("offline:models");
  }

  const payload = catalogSchema.safeParse(
    await response.json().catch(() => null)
  );
  if (!payload.success) {
    throw new ChatbotError("offline:models");
  }

  const catalog: ModelCatalog = { capabilities: {}, models: [] };
  for (const entry of payload.data.data) {
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

  return catalog;
}
