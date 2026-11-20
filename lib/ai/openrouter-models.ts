import "server-only";

import { z } from "zod";
import { ChatbotError } from "@/lib/errors";
import type { ModelCatalog } from "./models";

const zeroPrice = z.union([z.literal(0), z.string().regex(/^0+(?:\.0+)?$/)]);
const freePricing = z
  .object({ completion: zeroPrice, prompt: zeroPrice })
  .catchall(zeroPrice.nullable());

const openRouterModelSchema = z.object({
  architecture: z
    .object({
      input_modalities: z.array(z.string()).nullish(),
      output_modalities: z.array(z.string()).nullish(),
    })
    .nullish(),
  endpoints: z.array(z.string()).nullish(),
  id: z.string().min(1),
  name: z.string().min(1),
  pricing: freePricing,
  supported_parameters: z.array(z.string()).nullish(),
});

const catalogSchema = z.object({ data: z.array(z.unknown()) });

export async function getModelCatalog(): Promise<ModelCatalog> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new ChatbotError("offline:provider");
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/models/user?output_modalities=all",
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    }
  ).catch(() => null);

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
    const parsed = openRouterModelSchema.safeParse(entry);
    if (!parsed.success) {
      continue;
    }

    const { architecture, endpoints, id, name, supported_parameters } =
      parsed.data;
    const supportsChat =
      Boolean(architecture?.input_modalities?.includes("text")) &&
      Boolean(architecture?.output_modalities?.includes("text")) &&
      (!endpoints?.length || endpoints.includes("/api/v1/chat/completions"));
    if (!supportsChat) {
      continue;
    }

    catalog.models.push({ id, name });
    catalog.capabilities[id] = {
      reasoning: supported_parameters?.includes("reasoning") ?? false,
      tools: supported_parameters?.includes("tools") ?? false,
      vision: architecture?.input_modalities?.includes("image") ?? false,
    };
  }

  return catalog;
}
