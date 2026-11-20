import { getModelCatalog } from "@/lib/ai/openrouter-models";

export async function GET() {
  const catalog = await getModelCatalog();
  return Response.json(catalog, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
  });
}
