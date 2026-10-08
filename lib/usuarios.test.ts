import { expect, it } from "vitest";
import { buscarUsuario, filasAUsuarios } from "./usuarios";

it("convierte filas en usuarios y omite las sin correo", () => {
  expect(filasAUsuarios([["Ana", " Ana@Ejemplo.com "], ["Sin correo"], []])).toEqual([
    { nombre: "Ana", correo: "ana@ejemplo.com" },
  ]);
});

it("con FUENTE_PRODUCTOS=fixture busca sin distinguir mayúsculas", async () => {
  process.env.FUENTE_PRODUCTOS = "fixture";
  expect((await buscarUsuario("ANA@ejemplo.com"))?.nombre).toBe("Ana");
  expect(await buscarUsuario("otro@ejemplo.com")).toBeUndefined();
});
