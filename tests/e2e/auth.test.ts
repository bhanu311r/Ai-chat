import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

test.describe("Authentication Pages", () => {
  test("requires sign-in for chat and lists only the account provider", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
    await page.goto(`/chat/${randomUUID()}`);
    await expect(page).toHaveURL("/login");
    expect((await request.get("/api/models")).status()).toBe(401);
    const providers = await request.get("/api/auth/providers");
    expect(Object.keys(await providers.json())).toEqual(["credentials"]);
  });

  test("can register, sign out and sign back in", async ({ page }) => {
    const email = `test-${randomUUID()}@example.test`;
    const password = randomUUID();
    await page.goto("/register");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(page).toHaveURL("/");
    await page.getByTestId("user-nav-button").click();
    await page.getByText("Sign out", { exact: true }).click();
    await expect(page).toHaveURL("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByTestId("multimodal-input")).toBeVisible();
  });

  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: "Welcome back" })
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });

  test("register page renders correctly", async ({ page }) => {
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { name: "Create account" })
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("can navigate from login to register", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL("/register");
  });

  test("can navigate from register to login", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/login");
  });
});
