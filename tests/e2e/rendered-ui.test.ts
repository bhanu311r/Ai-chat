import { pipeJsonRender } from "@json-render/core";
import { createUIMessageStream, readUIMessageStream } from "ai";
import type { ChatMessage } from "@/lib/types";
import { expect, test } from "../signed-in";

test("renders shadcn UI from saved stream parts between plain chat text", async ({
  page,
}) => {
  const card = {
    children: ["details"],
    props: { title: "Trip overview" },
    type: "Card",
  };
  const details = {
    children: [],
    props: { text: "Two days in Kyoto" },
    type: "Text",
  };
  const reply = [
    "Here is your itinerary.",
    "```spec",
    JSON.stringify({ op: "add", path: "/root", value: "trip" }),
    JSON.stringify({ op: "add", path: "/elements/trip", value: card }),
    JSON.stringify({ op: "add", path: "/elements/details", value: details }),
    "```",
    "Have a great trip.",
  ].join("\n");

  const stream = createUIMessageStream<ChatMessage>({
    execute({ writer }) {
      writer.merge(
        pipeJsonRender(
          new ReadableStream({
            start(controller) {
              controller.enqueue({ messageId: "assistant", type: "start" });
              controller.enqueue({ id: "text", type: "text-start" });
              controller.enqueue({
                delta: reply,
                id: "text",
                type: "text-delta",
              });
              controller.enqueue({ id: "text", type: "text-end" });
              controller.enqueue({ type: "finish" });
              controller.close();
            },
          })
        )
      );
    },
  });
  let assistant: ChatMessage | undefined;
  for await (const message of readUIMessageStream<ChatMessage>({ stream })) {
    assistant = message;
  }
  expect(assistant?.parts.some((part) => part.type === "data-spec")).toBe(true);

  await page.route("**/api/messages?*", (route) =>
    route.fulfill({
      json: { isReadonly: true, messages: [assistant], visibility: "private" },
    })
  );
  await page.goto("/chat/b415ae3d-b547-4617-9fe0-633d08de27bf");

  const message = page.getByTestId("message-assistant");
  await expect(message.getByText("Here is your itinerary.")).toBeVisible();
  const ui = message.getByTestId("rendered-chat-ui");
  await expect(ui.getByText("Trip overview")).toBeVisible();
  await expect(ui.getByText("Two days in Kyoto")).toBeVisible();
  await expect(message.getByText("Have a great trip.")).toBeVisible();
  await expect(message).not.toContainText("/elements/details");
});
