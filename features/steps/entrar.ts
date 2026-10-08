import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import usuarios from "../../mocks/fixtures/usuarios.json";

const { Given, When } = createBdd();

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
