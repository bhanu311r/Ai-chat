import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { shadcnComponentDefinitions } from "@json-render/shadcn/catalog";

export const chatCatalog = defineCatalog(schema, {
  actions: {},
  components: shadcnComponentDefinitions,
});
