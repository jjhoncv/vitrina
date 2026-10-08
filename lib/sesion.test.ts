import { beforeEach, expect, it } from "vitest";
import { crearToken } from "./enlace";
import { crearSesion, SESION_MS, verificarSesion } from "./sesion";

beforeEach(() => {
  process.env.AUTH_SECRET = "secreto-de-prueba";
});

it("la sesión devuelve nombre y correo", () => {
  expect(verificarSesion(crearSesion({ nombre: "Ana", correo: "ana@ejemplo.com" }))).toEqual({
    nombre: "Ana",
    correo: "ana@ejemplo.com",
  });
});

it("vence a los 7 días", () => {
  const t0 = 1_000_000;
  const sesion = crearSesion({ nombre: "Ana", correo: "ana@ejemplo.com" }, t0);
  expect(verificarSesion(sesion, t0 + SESION_MS - 1)).not.toBeNull();
  expect(verificarSesion(sesion, t0 + SESION_MS + 1)).toBeNull();
});

it("un token de enlace no sirve como sesión", () => {
  expect(verificarSesion(crearToken("ana@ejemplo.com"))).toBeNull();
});

it("rechaza basura", () => {
  expect(verificarSesion("x.y")).toBeNull();
  expect(verificarSesion("")).toBeNull();
});
