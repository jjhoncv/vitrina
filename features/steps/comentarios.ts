import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { crearToken } from "../../lib/enlace";
import productos from "../../mocks/fixtures/productos.json";

const { Given, When, Then } = createBdd();

// Productos y correo simulados (ADR 0001); los comentarios viven en la memoria del servidor de pruebas.
async function entrarComoAna(page: Page, producto: string) {
  const slug = productos.find((p) => p.nombre === producto)?.slug;
  expect(slug, `producto «${producto}» en el fixture`).toBeTruthy();
  await page.goto(`/entrar/verificar?token=${encodeURIComponent(crearToken("ana@ejemplo.com"))}`);
  await expect(page.getByRole("banner")).toContainText("Hola, Ana");
  await page.goto(`/productos/${slug}`);
}

async function comentar(page: Page, texto: string) {
  await page.getByRole("textbox", { name: "Comentario" }).fill(texto);
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByRole("status")).toContainText("Enviamos tu comentario");
}

Given("que Ana entró y está en la landing de {string}", async ({ page }, producto: string) => {
  await entrarComoAna(page, producto);
});

Given("que Ana comentó {string} en {string}", async ({ page }, texto: string, producto: string) => {
  await entrarComoAna(page, producto);
  await comentar(page, texto);
});

When("escribe {string} y envía", async ({ page }, texto: string) => {
  await page.getByRole("textbox", { name: "Comentario" }).fill(texto);
  await page.getByRole("button", { name: "Enviar" }).click();
});

When("un visitante sin sesión entra a esa landing", async ({ page }) => {
  const landing = page.url();
  await page.context().clearCookies();
  await page.goto(landing);
  await expect(page.getByRole("banner")).toContainText("Entrar");
});

Then("ve su comentario publicado con su nombre y la fecha", async ({ page }) => {
  const comentario = page.getByRole("article").filter({ hasText: "¿Viene en azul?" }).first();
  await expect(comentario).toContainText("Ana");
  await expect(comentario.locator("time")).toHaveText(/\d{4}/);
});

Then("ve el comentario de Ana", async ({ page }) => {
  const comentario = page.getByRole("article").filter({ hasText: "¿Viene en azul?" }).first();
  await expect(comentario).toContainText("Ana");
});
