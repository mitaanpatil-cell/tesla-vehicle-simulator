import { test, expect } from "@playwright/test";

test("vehicle is visible", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await expect(
    page.getByText("Model 3 Simulator")
  ).toBeVisible();
});

test("lock button toggles the vehicle lock state", async ({ page }) => {
  let vehicle = {
    id: 1,
    name: "Model 3 Simulator",
    locked: true,
    batteryLevel: 80,
    charging: false,
    climateOn: false,
  };

  await page.route("**/api/vehicle", async (route) => {
    await route.fulfill({
      json: vehicle,
    });
  });

  await page.route("**/api/vehicle/lock", async (route) => {
    const requestBody = route.request().postDataJSON();

    vehicle = {
      ...vehicle,
      locked: requestBody.locked,
    };

    await route.fulfill({
      json: vehicle,
    });
  });

  await page.goto("http://localhost:5173");

  await expect(page.getByText("Locked: Yes")).toBeVisible();
  await expect(page.getByRole("button", { name: "Unlock" })).toBeVisible();

  await page.getByRole("button", { name: "Unlock" }).click();

  await expect(page.getByText("Locked: No")).toBeVisible();
  await expect(page.getByRole("button", { name: "Lock" })).toBeVisible();

  await page.getByRole("button", { name: "Lock" }).click();

  await expect(page.getByText("Locked: Yes")).toBeVisible();
  await expect(page.getByRole("button", { name: "Unlock" })).toBeVisible();
});
