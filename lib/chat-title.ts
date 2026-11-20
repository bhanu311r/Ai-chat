import { z } from "zod";

const partsSchema = z.array(z.unknown());
const textPart = z.object({ text: z.string(), type: z.literal("text") });
const filePart = z.object({
  filename: z.string().optional(),
  name: z.string().optional(),
  type: z.literal("file"),
});

export function titleFromFirstPrompt(parts: unknown): string {
  const parsed = partsSchema.safeParse(parts);
  const text: string[] = [];
  let attachment: string | undefined;
  for (const part of parsed.data ?? []) {
    const message = textPart.safeParse(part);
    if (message.success) {
      text.push(message.data.text);
    } else {
      const file = filePart.safeParse(part);
      if (file.success) {
        attachment ??=
          file.data.filename?.trim() || file.data.name?.trim() || "Attachment";
      }
    }
  }
  const title =
    text.join(" ").replace(/\s+/g, " ").trim() || attachment || "Untitled chat";
  return [...title].slice(0, 100).join("");
}
