import { createHmac, timingSafeEqual } from "node:crypto";

export const VIGENCIA_MS = 15 * 60_000;

function firmar(cuerpo: string): string {
  const secreto = process.env.AUTH_SECRET;
  if (!secreto) throw new Error("Falta AUTH_SECRET");
  return createHmac("sha256", secreto).update(cuerpo).digest("base64url");
}

type Uso = "enlace" | "sesion";
export type Carga = { c: string; e: number; u: Uso; n?: string };

/** Token firmado `<cuerpo>.<firma>`; `u` separa los enlaces de las sesiones para que no se confundan. */
export function sellar(carga: Carga): string {
  const cuerpo = Buffer.from(JSON.stringify(carga)).toString("base64url");
  return `${cuerpo}.${firmar(cuerpo)}`;
}

/** Devuelve la carga si el token es auténtico, del uso pedido y no venció; si no, null. */
export function abrir(token: string, uso: Uso, ahora = Date.now()): Carga | null {
  const [cuerpo, firma] = token.split(".");
  if (!cuerpo || !firma) return null;
  const esperada = Buffer.from(firmar(cuerpo));
  const recibida = Buffer.from(firma);
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) return null;
  try {
    const carga = JSON.parse(Buffer.from(cuerpo, "base64url").toString());
    return typeof carga.c === "string" && typeof carga.e === "number" && carga.u === uso && ahora <= carga.e ? carga : null;
  } catch {
    return null;
  }
}

/** Token del enlace de entrada con el correo y su vencimiento (15 minutos). */
export function crearToken(correo: string, ahora = Date.now()): string {
  return sellar({ c: correo, e: ahora + VIGENCIA_MS, u: "enlace" });
}

/** Devuelve el correo si el token es auténtico y no venció; si no, null. */
export function verificarToken(token: string, ahora = Date.now()): string | null {
  return abrir(token, "enlace", ahora)?.c ?? null;
}
