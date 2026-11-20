export const DEFAULT_CHAT_MODEL = "openrouter/free";

export const defaultChatModel = {
  id: DEFAULT_CHAT_MODEL,
  name: "OpenRouter Free",
};

export type ChatModel = {
  id: string;
  name: string;
};

export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};

export type ModelCatalog = {
  capabilities: Record<string, ModelCapabilities>;
  models: ChatModel[];
};
