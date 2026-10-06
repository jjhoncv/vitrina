import { expect, it } from "vitest";
import { filasAProductos, obtenerProductos } from "./productos";

it("convierte las filas de la hoja en productos y omite filas vacías", () => {
  const filas = [
    ["Taza", "taza", "Desc", "S/ 25", "http://x/y.png", "Prov", "p@x.com"],
    [],
    ["Solo nombre"],
  ];
  const productos = filasAProductos(filas);
  expect(productos).toHaveLength(2);
  expect(productos[0]).toEqual({
    nombre: "Taza",
    slug: "taza",
    descripcion: "Desc",
    precio: "S/ 25",
    imagen: "http://x/y.png",
    proveedor: "Prov",
    correoProveedor: "p@x.com",
  });
  expect(productos[1].precio).toBe("");
});

it("con FUENTE_PRODUCTOS=fixture devuelve Taza de cerámica y Libreta A5", async () => {
  process.env.FUENTE_PRODUCTOS = "fixture";
  expect((await obtenerProductos()).map((p) => p.nombre)).toEqual(["Taza de cerámica", "Libreta A5"]);
});

it("sin credenciales de Google falla con un mensaje claro", async () => {
  delete process.env.FUENTE_PRODUCTOS;
  delete process.env.GOOGLE_SHEET_ID;
  await expect(obtenerProductos()).rejects.toThrow(/GOOGLE_SHEET_ID/);
});
