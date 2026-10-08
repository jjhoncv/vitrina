import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { crearToken } from "../../lib/enlace";
import fixture from "../../mocks/fixtures/productos.json";

const { Given, When, Then } = createBdd();

const rutaDe = (nombre: string) => {
  const producto = fixture.find((p) => p.nombre === nombre);
  expect(producto).toBeTruthy();
  return `/productos/${producto!.slug}`;
};

Given("que no entré", async ({ context }) => {
  await context.clearCookies();
});

Given("que Ana entró y está en la landing de {string}", async ({ page }, nombre: string) => {
  await page.goto(`/entrar/verificar?token=${encodeURIComponent(crearToken("ana@ejemplo.com"))}`);
  await expect(page.getByRole("banner")).toContainText("Hola, Ana");
  await page.goto(rutaDe(nombre));
});

When("estoy en la landing de {string}", async ({ page }, nombre: string) => {
  await page.goto(rutaDe(nombre));
});

When("envía un comentario vacío", async ({ page }) => {
  await page.getByRole("button", { name: "Comentar" }).click();
});

Then("veo {string} y no veo el formulario", async ({ page }, texto: string) => {
  await expect(page.getByText(texto)).toBeVisible();
  await expect(page.getByLabel("Comentario")).toHaveCount(0);
});
