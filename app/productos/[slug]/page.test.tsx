// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vitest";
import { comentar } from "@/lib/comentarios";
import { crearSesion } from "@/lib/sesion";
import Page, { generateMetadata } from "./page";
import NoEncontrado from "./not-found";

let cookie: string | undefined;
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => (cookie ? { value: cookie } : undefined) }),
}));
// El formulario es un componente cliente con una acción de servidor: aquí solo importa si aparece.
vi.mock("./formulario-comentario", () => ({ FormularioComentario: () => <form aria-label="Comentar" /> }));

afterEach(cleanup);

beforeAll(() => {
  process.env.FUENTE_PRODUCTOS = "fixture";
  process.env.AUTH_SECRET = "secreto-de-prueba";
});

beforeEach(() => {
  cookie = undefined;
  delete (globalThis as { __comentarios?: unknown }).__comentarios;
});

// Fase 3 — Comentario visible para todos: sin sesión se ven los comentarios, con nombre y fecha.
it("muestra los comentarios publicados con nombre y fecha a un visitante sin sesión", async () => {
  await comentar("taza-de-ceramica", "¿Viene en azul?", { nombre: "Ana", correo: "ana@ejemplo.com" }, async () => {});
  render(await Page({ params: Promise.resolve({ slug: "taza-de-ceramica" }) }));
  expect(screen.getByText("¿Viene en azul?")).toBeTruthy();
  expect(screen.getByText("Ana")).toBeTruthy();
  expect(document.querySelector("time")?.textContent).toMatch(/\d{4}/);
  expect(screen.queryByLabelText("Comentar")).toBeNull();
});

// Fase 3 — Comentar un producto: quien entró ve el formulario.
it("con sesión muestra el formulario para comentar", async () => {
  cookie = crearSesion({ nombre: "Ana", correo: "ana@ejemplo.com" });
  render(await Page({ params: Promise.resolve({ slug: "taza-de-ceramica" }) }));
  expect(screen.getByLabelText("Comentar")).toBeTruthy();
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
