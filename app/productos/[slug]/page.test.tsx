// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, it } from "vitest";
import Page from "./page";
import NoEncontrado from "./not-found";

afterEach(cleanup);

beforeAll(() => {
  process.env.FUENTE_PRODUCTOS = "fixture";
});

// Fase 1 — Abrir la landing de un producto: descripción, precio y proveedor.
it("muestra nombre, descripción, precio y proveedor del producto", async () => {
  render(await Page({ params: Promise.resolve({ slug: "taza-de-ceramica" }) }));
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Taza de cerámica");
  expect(screen.getByText("Taza artesanal de 350 ml.")).toBeTruthy();
  expect(screen.getByText("S/ 25.00")).toBeTruthy();
  expect(screen.getByText(/Cerámicas del Valle/)).toBeTruthy();
});

// Fase 1 — Producto que no existe: dispara notFound() (404).
it("con un slug inexistente dispara notFound", async () => {
  await expect(Page({ params: Promise.resolve({ slug: "no-existe" }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/);
});

it("la página de no encontrado dice «Producto no encontrado»", () => {
  render(<NoEncontrado />);
  expect(screen.getByText("Producto no encontrado")).toBeTruthy();
});
