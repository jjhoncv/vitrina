// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, it } from "vitest";
import Page from "./page";

afterEach(cleanup);

beforeAll(() => {
  process.env.FUENTE_PRODUCTOS = "fixture";
});

// E1 — Proyecto nuevo en producción el día 1: la página muestra el nombre del PROYECTO.md,
// sea cual sea (la plantilla no puede fijar un nombre).
it("muestra como título principal el # título de PROYECTO.md", async () => {
  const titulo = readFileSync("PROYECTO.md", "utf8").match(/^#[ \t]+(.+?)[ \t]*$/m)?.[1];
  render(await Page());
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(titulo);
});

// Fase 1 — Ver el catálogo: foto, nombre y precio de cada producto.
it("lista cada producto con foto, nombre y precio", async () => {
  render(await Page());
  const items = screen.getAllByTestId("producto");
  expect(items).toHaveLength(2);
  expect(items[0].querySelector("img")?.getAttribute("src")).toBeTruthy();
  expect(items[0].textContent).toContain("Taza de cerámica");
  expect(items[0].textContent).toContain("S/ 25.00");
  expect(items[1].textContent).toContain("Libreta A5");
});
