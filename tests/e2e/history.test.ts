import { expect, test } from "../signed-in";

test("a draft takes its first submitted prompt as its history title", async ({
  page,
}) => {
  await page.route("**/api/history?*", (route) =>
    route.fulfill({ json: { chats: [], hasMore: false } })
  );
  await page.goto("/");
  const draft = page.getByTestId("draft-history-title");
  await expect(draft).toHaveText("New chat");
  const composer = page.getByTestId("multimodal-input");
  await composer.fill("Outline a neighborhood garden");
  await expect(draft).toHaveText("New chat");
  await composer.press("Enter");
  await expect(draft).toHaveText("Outline a neighborhood garden");
});
