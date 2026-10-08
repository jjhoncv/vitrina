import { beforeEach, expect, it } from "vitest";
import { crearToken, verificarToken } from "./enlace";

beforeEach(() => {
  process.env.AUTH_SECRET = "secreto-de-prueba";
});

it("un token recién creado devuelve su correo", () => {
  expect(verificarToken(crearToken("ana@ejemplo.com"))).toBe("ana@ejemplo.com");
});

it("vence a los 15 minutos", () => {
  const t0 = 1_000_000;
  const token = crearToken("ana@ejemplo.com", t0);
  expect(verificarToken(token, t0 + 14 * 60_000)).toBe("ana@ejemplo.com");
  expect(verificarToken(token, t0 + 15 * 60_000 + 1)).toBeNull();
});

it("rechaza un token alterado o firmado con otro secreto", () => {
  const token = crearToken("ana@ejemplo.com");
  const [cuerpo, firma] = token.split(".");
  const otro = Buffer.from(JSON.stringify({ c: "otro@ejemplo.com", e: Date.now() + 60_000 })).toString("base64url");
  expect(verificarToken(`${otro}.${firma}`)).toBeNull();
  process.env.AUTH_SECRET = "otro-secreto";
  expect(verificarToken(`${cuerpo}.${firma}`)).toBeNull();
});

it("sin AUTH_SECRET falla con un mensaje claro", () => {
  delete process.env.AUTH_SECRET;
  expect(() => crearToken("ana@ejemplo.com")).toThrow(/AUTH_SECRET/);
});
