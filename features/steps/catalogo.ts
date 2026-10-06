import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import fixture from "../../mocks/fixtures/productos.json";

const { Given, When, Then } = createBdd();

// Los productos salen del fixture (FUENTE_PRODUCTOS=fixture en playwright.config.ts, ADR 0001).
Given("que la hoja tiene los productos {string} y {string}", async ({}, uno: string, dos: string) => {
  const nombres = fixture.map((p) => p.nombre);
  expect(nombres).toEqual([uno, dos]);
});

Given("que la hoja tiene el producto {string} con slug {string}", async ({}, nombre: string, slug: string) => {
  expect(fixture.find((p) => p.slug === slug)?.nombre).toBe(nombre);
});

When("hago clic en {string}", async ({ page }, nombre: string) => {
  await page.goto("/");
  await page.getByRole("link", { name: nombre }).click();
});

When("entro a {string}", async ({ page }, ruta: string) => {
  await page.goto(ruta);
});

Then("estoy en {string}", async ({ page }, ruta: string) => {
  await expect(page).toHaveURL(new RegExp(`${ruta}$`));
});

Then("veo su descripción, precio y proveedor", async ({ page }) => {
  const p = fixture[0];
  await expect(page.getByText(p.descripcion)).toBeVisible();
  await expect(page.getByText(p.precio)).toBeVisible();
  await expect(page.getByText(p.proveedor)).toBeVisible();
});

Then("el título de la página es {string}", async ({ page }, titulo: string) => {
  await expect(page).toHaveTitle(titulo);
});

Then("veo la URL {string}", async ({ page }, ruta: string) => {
  expect(await page.content()).toContain(ruta);
});

Then("veo {string}", async ({ page }, texto: string) => {
  await expect(page.getByText(texto)).toBeVisible();
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
