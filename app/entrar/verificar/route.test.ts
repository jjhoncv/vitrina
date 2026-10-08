import { beforeEach, expect, it } from "vitest";
import { crearToken, VIGENCIA_MS } from "@/lib/enlace";
import { verificarSesion } from "@/lib/sesion";
import { GET } from "./route";

beforeEach(() => {
  process.env.AUTH_SECRET = "secreto-de-prueba";
  process.env.FUENTE_PRODUCTOS = "fixture";
});

const pedir = (token?: string) =>
  GET(new Request(`http://localhost:3000/entrar/verificar${token === undefined ? "" : `?token=${encodeURIComponent(token)}`}`));
const error = (r: Response) => new URL(r.headers.get("location")!).searchParams.get("error");

it("con un enlace válido crea la sesión y vuelve a la portada", async () => {
  const r = await pedir(crearToken("ana@ejemplo.com"));
  expect(r.status).toBe(307);
  expect(new URL(r.headers.get("location")!).pathname).toBe("/");
  const cookie = r.headers.getSetCookie()[0];
  expect(cookie).toMatch(/HttpOnly/i);
  expect(cookie).toMatch(/SameSite=lax/i);
  const valor = decodeURIComponent(cookie.split(";")[0].split("=")[1]);
  expect(verificarSesion(valor)?.nombre).toBe("Ana");
});

it("con un enlace vencido no crea sesión y avisa", async () => {
  const r = await pedir(crearToken("ana@ejemplo.com", Date.now() - VIGENCIA_MS - 60_000));
  expect(new URL(r.headers.get("location")!).pathname).toBe("/entrar");
  expect(error(r)).toBe("vencido");
  expect(r.headers.getSetCookie()).toEqual([]);
});

it("sin token o con un correo que ya no está en la hoja, avisa", async () => {
  expect(error(await pedir())).toBe("vencido");
  expect(error(await pedir(crearToken("otro@ejemplo.com")))).toBe("vencido");
});
