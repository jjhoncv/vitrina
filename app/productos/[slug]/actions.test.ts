import { beforeAll, beforeEach, expect, it, vi } from "vitest";
import { crearSesion } from "@/lib/sesion";

let cookie: string | undefined;
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => (cookie ? { value: cookie } : undefined) }) }));

beforeAll(() => {
  process.env.AUTH_SECRET = "secreto-de-prueba";
});
beforeEach(() => {
  cookie = undefined;
});

const datos = (texto: string) => {
  const f = new FormData();
  f.set("comentario", texto);
  return f;
};

// Una server action es un endpoint público: la sesión se verifica en el servidor, no solo en la pantalla.
it("sin sesión rechaza el comentario aunque llegue un POST directo", async () => {
  const { comentarAccion } = await import("./actions");
  expect(await comentarAccion(null, datos("¿Viene en azul?"))).toEqual({ ok: false, mensaje: "Entra para comentar" });
});

it("con sesión valida el comentario", async () => {
  cookie = crearSesion({ nombre: "Ana", correo: "ana@ejemplo.com" });
  const { comentarAccion } = await import("./actions");
  expect(await comentarAccion(null, datos("  "))).toEqual({ ok: false, mensaje: "Escribe un comentario" });
});
