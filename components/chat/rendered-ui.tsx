"use client";

import {
  defineRegistry,
  JSONUIProvider,
  Renderer,
  useJsonRenderMessage,
} from "@json-render/react";
import { shadcnComponents } from "@json-render/shadcn";
import { chatCatalog } from "@/lib/render/catalog";
import type { ChatMessage } from "@/lib/types";

const { registry } = defineRegistry(chatCatalog, {
  components: shadcnComponents,
});

export default function RenderedUI({
  parts,
  loading,
}: {
  parts: ChatMessage["parts"];
  loading: boolean;
}) {
  const { hasSpec, spec } = useJsonRenderMessage(parts);

  if (!hasSpec || !spec) {
    return null;
  }

  return (
    <div className="min-w-0" data-testid="rendered-chat-ui">
      <JSONUIProvider initialState={spec.state} registry={registry}>
        <Renderer loading={loading} registry={registry} spec={spec} />
      </JSONUIProvider>
    </div>
  );
}
