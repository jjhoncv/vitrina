import { beforeEach, expect, it, vi } from "vitest";
import { comentar, comentariosDe, filasAComentarios } from "./comentarios";

const ana = { nombre: "Ana", correo: "ana@ejemplo.com" };

beforeEach(() => {
  process.env.FUENTE_PRODUCTOS = "fixture";
  delete (globalThis as { __comentarios?: unknown }).__comentarios;
});

// Fase 3 — Comentario visible para todos: la hoja se lee como slug, nombre, correo, texto, fecha.
it("convierte las filas de la pestaña en comentarios sin exponer el correo", () => {
  const filas = [
    ["taza-de-ceramica", "Ana", "ana@ejemplo.com", "¿Viene en azul?", "2026-10-08T15:00:00.000Z"],
    ["", "", "", "", ""],
  ];
  expect(filasAComentarios(filas)).toEqual([
    { slug: "taza-de-ceramica", nombre: "Ana", texto: "¿Viene en azul?", fecha: "2026-10-08T15:00:00.000Z" },
  ]);
});

// Fase 3 — Comentar un producto: guarda, envía al usuario y al proveedor, y publica.
it("guarda el comentario, lo envía al usuario y al proveedor, y lo publica", async () => {
  const enviar = vi.fn().mockResolvedValue(undefined);
  const r = await comentar("taza-de-ceramica", "¿Viene en azul?", ana, enviar);
  expect(r).toEqual({ ok: true, mensaje: "Enviamos tu comentario a ti y al proveedor" });
  expect(enviar.mock.calls.map(([c]) => c.para).sort()).toEqual(["ana@ejemplo.com", "ventas@ceramicas.ejemplo.com"]);
  expect(enviar.mock.calls[0][0].texto).toContain("¿Viene en azul?");
  const publicados = await comentariosDe("taza-de-ceramica");
  expect(publicados).toHaveLength(1);
  expect(publicados[0]).toMatchObject({ nombre: "Ana", texto: "¿Viene en azul?" });
  expect(Number.isNaN(Date.parse(publicados[0].fecha))).toBe(false);
});

it("no mezcla comentarios de otros productos", async () => {
  await comentar("taza-de-ceramica", "Hola", ana, vi.fn());
  expect(await comentariosDe("libreta-a5")).toEqual([]);
});

// Fase 3 — Comentario vacío.
it("rechaza un comentario vacío sin guardar ni enviar", async () => {
  const enviar = vi.fn();
  expect(await comentar("taza-de-ceramica", "   ", ana, enviar)).toEqual({ ok: false, mensaje: "Escribe un comentario" });
  expect(enviar).not.toHaveBeenCalled();
  expect(await comentariosDe("taza-de-ceramica")).toEqual([]);
});

it("rechaza un producto que no existe", async () => {
  const r = await comentar("no-existe", "Hola", ana, vi.fn());
  expect(r).toEqual({ ok: false, mensaje: "Producto no encontrado" });
});

it("si el correo falla, el comentario queda publicado y avisa", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const r = await comentar("taza-de-ceramica", "Hola", ana, vi.fn().mockRejectedValue(new Error("smtp")));
  expect(r.ok).toBe(true);
  expect(r.mensaje).toContain("no pudimos enviar el correo");
  expect(await comentariosDe("taza-de-ceramica")).toHaveLength(1);
});

// Una sección secundaria no tumba la página: si la hoja falla al leer comentarios, la landing sigue.
it("si la hoja falla al leer comentarios, devuelve la lista vacía", async () => {
  const anterior = process.env.FUENTE_PRODUCTOS;
  delete process.env.FUENTE_PRODUCTOS;
  delete process.env.GOOGLE_SHEET_ID;
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  expect(await comentariosDe("taza-de-ceramica")).toEqual([]);
  expect(error).toHaveBeenCalled();
  process.env.FUENTE_PRODUCTOS = anterior;
});
