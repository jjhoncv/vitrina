import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { crearToken } from "../../lib/enlace";
import usuarios from "../../mocks/fixtures/usuarios.json";

const { Given, When, Then } = createBdd();

// Los usuarios salen del fixture y el correo se simula (CORREO=simulado en playwright.config.ts, ADR 0001).
Given("que {string} está en la hoja de usuarios", async ({}, correo: string) => {
  expect(usuarios.map((u) => u.correo)).toContain(correo);
});

Given("que {string} no está en la hoja de usuarios", async ({}, correo: string) => {
  expect(usuarios.map((u) => u.correo)).not.toContain(correo);
});

When("escribo {string} y pido el enlace", async ({ page }, correo: string) => {
  await page.goto("/entrar");
  await page.getByLabel("Correo").fill(correo);
  await page.getByRole("button", { name: "Pedir enlace" }).click();
});

// Ana "pidió su enlace": el paso firma el mismo token que enviaría el correo (AUTH_SECRET de playwright.config.ts).
let enlace = "";
const enlaceCon = (token: string) => `/entrar/verificar?token=${encodeURIComponent(token)}`;

Given("que Ana pidió su enlace", async () => {
  enlace = enlaceCon(crearToken("ana@ejemplo.com"));
});

Given("que Ana pidió su enlace hace más de {int} minutos", async ({}, minutos: number) => {
  enlace = enlaceCon(crearToken("ana@ejemplo.com", Date.now() - (minutos + 1) * 60_000));
});

When("abre el enlace", async ({ page }) => {
  await page.goto(enlace);
});

Then("ve {string} en la cabecera", async ({ page }, texto: string) => {
  await expect(page.getByRole("banner")).toContainText(texto);
  expect(page.url()).not.toContain("token");
});

Then("ve {string}", async ({ page }, texto: string) => {
  await expect(page.getByText(texto)).toBeVisible();
});
