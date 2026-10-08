import { beforeEach, expect, it, vi } from "vitest";
import { verificarToken } from "./enlace";
import { mensajeSmtp, type Correo } from "./correo";
import { pedirEnlace } from "./pedir-enlace";

beforeEach(() => {
  process.env.FUENTE_PRODUCTOS = "fixture";
  process.env.AUTH_SECRET = "secreto-de-prueba";
});

it("a un usuario de la hoja le envía un enlace firmado", async () => {
  const enviar = vi.fn<(c: Correo) => Promise<void>>(async () => {});
  const r = await pedirEnlace("ana@ejemplo.com", "https://vitrina.test", enviar);
  expect(r).toEqual({ ok: true, mensaje: "Te enviamos un enlace a ana@ejemplo.com" });
  const { para, texto } = enviar.mock.calls[0][0];
  expect(para).toBe("ana@ejemplo.com");
  const token = decodeURIComponent(texto.match(/token=(\S+)/)![1]);
  expect(texto).toContain("https://vitrina.test/entrar/verificar?token=");
  expect(verificarToken(token)).toBe("ana@ejemplo.com");
});

it("a un correo que no está en la hoja no le envía nada", async () => {
  const enviar = vi.fn(async () => {});
  const r = await pedirEnlace("otro@ejemplo.com", "https://vitrina.test", enviar);
  expect(r).toEqual({ ok: false, mensaje: "Este correo no tiene acceso" });
  expect(enviar).not.toHaveBeenCalled();
});

it("el mensaje SMTP codifica asunto y cuerpo en UTF-8", () => {
  const m = mensajeSmtp("yo@gmail.com", { para: "a@b.com", asunto: "Enlace ñ", texto: "Hola" });
  expect(m).toContain("To: a@b.com");
  expect(m).toContain(`Subject: =?UTF-8?B?${Buffer.from("Enlace ñ").toString("base64")}?=`);
  expect(m.endsWith(Buffer.from("Hola").toString("base64"))).toBe(true);
});
