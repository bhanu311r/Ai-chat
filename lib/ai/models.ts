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
