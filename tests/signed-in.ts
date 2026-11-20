import { randomUUID } from "node:crypto";
import { test as base, expect } from "@playwright/test";

export { expect } from "@playwright/test";

export const test = base.extend({
  storageState: async ({ browser, baseURL }, use) => {
    const page = await browser.newPage({ baseURL });
    try {
      await page.goto("/register");
      await page.getByLabel("Email").fill(`test-${randomUUID()}@example.test`);
      await page.getByLabel("Password").fill(randomUUID());
      await page.getByRole("button", { name: "Sign up" }).click();
      await expect(page).toHaveURL("/");
      await use(await page.context().storageState());
    } finally {
      await page.context().close();
    }
  },
});
