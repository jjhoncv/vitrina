import { expect, it } from "vitest";
import { validarComentario } from "./comentario";

// Fase 3 — Comentario vacío: «Escribe un comentario».
it("rechaza el comentario vacío o solo espacios", () => {
  expect(validarComentario("")).toEqual({ ok: false, mensaje: "Escribe un comentario" });
  expect(validarComentario("  \n ")).toEqual({ ok: false, mensaje: "Escribe un comentario" });
});

it("acepta un comentario y lo recorta", () => {
  expect(validarComentario("  ¿Viene en azul? ")).toEqual({ ok: true, texto: "¿Viene en azul?" });
});
