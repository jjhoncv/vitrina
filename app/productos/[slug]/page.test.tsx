// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vitest";
import { crearSesion } from "@/lib/sesion";
import Page, { generateMetadata } from "./page";
import NoEncontrado from "./not-found";

let cookie: string | undefined;
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => (cookie ? { value: cookie } : undefined) }) }));

beforeEach(() => {
  cookie = undefined;
});
afterEach(cleanup);

beforeAll(() => {
  process.env.FUENTE_PRODUCTOS = "fixture";
  process.env.AUTH_SECRET = "secreto-de-prueba";
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

// Fase 1 — Título para buscadores: «<nombre> | Vitrina» y descripción.
it("genera título y descripción para SEO", async () => {
  const meta = await generateMetadata({ params: Promise.resolve({ slug: "taza-de-ceramica" }) });
  expect(meta.title).toBe("Taza de cerámica | Vitrina");
  expect(meta.description).toBe("Taza artesanal de 350 ml.");
});

it("sin producto, no genera metadatos propios", async () => {
  expect(await generateMetadata({ params: Promise.resolve({ slug: "no-existe" }) })).toEqual({});
});

// Fase 3 — Sin sesión no se comenta.
it("sin sesión muestra «Entra para comentar» y no el formulario", async () => {
  render(await Page({ params: Promise.resolve({ slug: "taza-de-ceramica" }) }));
  expect(screen.getByText("Entra para comentar")).toBeTruthy();
  expect(screen.queryByLabelText("Comentario")).toBeNull();
});

it("con sesión muestra el formulario de comentario", async () => {
  cookie = crearSesion({ nombre: "Ana", correo: "ana@ejemplo.com" });
  render(await Page({ params: Promise.resolve({ slug: "taza-de-ceramica" }) }));
  expect(screen.getByLabelText("Comentario")).toBeTruthy();
  expect(screen.queryByText("Entra para comentar")).toBeNull();
});
