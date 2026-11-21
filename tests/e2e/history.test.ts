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

test("history can retry and load older chats with the sidebar open", async ({
  page,
}) => {
  let attempts = 0;
  const recentChat = {
    createdAt: new Date().toISOString(),
    id: "b415ae3d-b547-4617-9fe0-633d08de27bf",
    title: "Recent conversation",
    visibility: "private",
  };

  await page.route("**/api/history?*", (route) => {
    const cursor = new URL(route.request().url()).searchParams.get(
      "ending_before"
    );
    if (cursor === recentChat.id) {
      return route.fulfill({
        json: {
          chats: [
            {
              ...recentChat,
              id: "c603237d-6429-4292-98c5-c03a7cbef62b",
              title: "Older conversation",
            },
          ],
          hasMore: false,
        },
      });
    }
    attempts += 1;
    if (attempts === 1) {
      return route.fulfill({ json: { code: "offline:chat" }, status: 503 });
    }
    return route.fulfill({ json: { chats: [recentChat], hasMore: true } });
  });

  await page.goto("/");
  await expect(page.getByTestId("user-nav-button")).toContainText(
    "@example.test"
  );
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(
    page.getByRole("link", { name: "Recent conversation" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Load older chats" }).click();
  await expect(
    page.getByRole("link", { name: "Older conversation" })
  ).toBeVisible();
  const toggle = page.locator('[data-sidebar="trigger"]');
  await toggle.click();
  await expect(
    page.getByRole("link", { name: "Recent conversation" })
  ).toBeHidden();
  await toggle.click();
  await expect(
    page.getByRole("link", { name: "Recent conversation" })
  ).toBeVisible();
});
