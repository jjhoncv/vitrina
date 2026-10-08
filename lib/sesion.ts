import { abrir, sellar } from "./enlace";

export const COOKIE_SESION = "sesion";
export const SESION_MS = 7 * 24 * 60 * 60_000;

export type Sesion = { nombre: string; correo: string };

/** Valor de la cookie de sesión: firmado, con nombre y correo, vence a los 7 días. */
export function crearSesion({ nombre, correo }: Sesion, ahora = Date.now()): string {
  return sellar({ c: correo, n: nombre, e: ahora + SESION_MS, u: "sesion" });
}

export function verificarSesion(valor: string | undefined, ahora = Date.now()): Sesion | null {
  const carga = valor ? abrir(valor, "sesion", ahora) : null;
  return carga ? { nombre: carga.n ?? "", correo: carga.c } : null;
}
