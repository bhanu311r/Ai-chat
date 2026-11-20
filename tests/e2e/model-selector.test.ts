import { expect, test } from "@playwright/test";

const fixtureModel = {
  id: "inclusionai/ling-3.2-flash:free",
  name: "Ling 3.2 Flash (free)",
};

const routerModel = { id: "openrouter/free", name: "OpenRouter Free" };

const catalog = {
  capabilities: {},
  models: [routerModel, fixtureModel],
};

test.describe("Model Selector", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/models", async (route) => {
      await route.fulfill({ json: catalog });
    });
    await page.goto("/");
  });

  test("displays a model button", async ({ page }) => {
    const modelButton = page.getByTestId("model-selector");
    await expect(modelButton).toBeVisible();
  });

  test("opens model selector popover on click", async ({ page }) => {
    const modelButton = page.getByTestId("model-selector");
    await modelButton.click();

    await expect(page.getByPlaceholder("Search models...")).toBeVisible();
  });

  test("can search for models", async ({ page }) => {
    const modelButton = page.getByTestId("model-selector");
    await modelButton.click();

    const searchInput = page.getByPlaceholder("Search models...");
    await searchInput.fill("Ling");

    await expect(
      page.getByRole("option", { name: fixtureModel.name })
    ).toBeVisible();
  });

  test("can close model selector by clicking outside", async ({ page }) => {
    const modelButton = page.getByTestId("model-selector");
    await modelButton.click();

    await expect(page.getByPlaceholder("Search models...")).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByPlaceholder("Search models...")).not.toBeVisible();
  });

  test("shows available models", async ({ page }) => {
    const modelButton = page.getByTestId("model-selector");
    await modelButton.click();

    const availableModels = page.getByRole("group", { name: "Free models" });
    await expect(availableModels).toBeVisible();
    await expect(
      availableModels.getByRole("option", { name: fixtureModel.name })
    ).toBeVisible();
    await expect(
      availableModels.getByRole("option", { name: routerModel.name })
    ).toBeVisible();
  });

  test("can select a different model", async ({ page }) => {
    const modelButton = page.getByTestId("model-selector");
    await modelButton.click();

    await page.getByRole("option", { name: fixtureModel.name }).click();

    await expect(page.getByPlaceholder("Search models...")).not.toBeVisible();
    await expect(modelButton).toContainText(fixtureModel.name);
  });
});

test("shows a catalog failure and loads models when retrying", async ({
  page,
}) => {
  let attempts = 0;
  await page.route("**/api/models", async (route) => {
    attempts += 1;
    if (attempts === 1) {
      await route.fulfill({
        json: { code: "offline:provider" },
        status: 503,
      });
      return;
    }
    await route.fulfill({ json: catalog });
  });
  await page.goto("/");
  const modelButton = page.getByTestId("model-selector");
  await modelButton.click();

  const retry = page.getByRole("button", { name: "Retry" });
  await expect(retry).toBeVisible();
  await expect(modelButton).toHaveText("Select model");
  await expect(
    page.getByRole("option", { name: routerModel.name })
  ).toHaveCount(0);

  await retry.click();
  await expect(
    page.getByRole("option", { name: fixtureModel.name })
  ).toBeVisible();
  await expect(retry).not.toBeVisible();
});
