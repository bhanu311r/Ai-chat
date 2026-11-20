import { connection } from "next/server";
import { getModelCatalog } from "@/lib/ai/openrouter-models";
import { ChatbotError } from "@/lib/errors";

export async function GET() {
  await connection();

  let response: Response;
  try {
    response = Response.json(await getModelCatalog());
  } catch (error) {
    response = (
      error instanceof ChatbotError ? error : new ChatbotError("offline:models")
    ).toResponse();
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
