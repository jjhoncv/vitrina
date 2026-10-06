import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import fixture from "../../mocks/fixtures/productos.json";

const { Given, When, Then } = createBdd();

// Los productos salen del fixture (FUENTE_PRODUCTOS=fixture en playwright.config.ts, ADR 0001).
Given("que la hoja tiene los productos {string} y {string}", async ({}, uno: string, dos: string) => {
  const nombres = fixture.map((p) => p.nombre);
  expect(nombres).toEqual([uno, dos]);
});

When("entro a la portada", async ({ page }) => {
  await page.goto("/");
});

Then("veo los dos productos con su foto, nombre y precio", async ({ page }) => {
  const items = page.getByTestId("producto");
  await expect(items).toHaveCount(2);
  for (const [i, nombre, precio] of [
    [0, "Taza de cerámica", "S/ 25.00"],
    [1, "Libreta A5", "S/ 18.00"],
  ] as const) {
    await expect(items.nth(i).getByRole("heading", { name: nombre })).toBeVisible();
    await expect(items.nth(i)).toContainText(precio);
    await expect(items.nth(i).getByRole("img", { name: nombre })).toBeVisible();
  }
});
