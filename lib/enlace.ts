import { createHmac, timingSafeEqual } from "node:crypto";

export const VIGENCIA_MS = 15 * 60_000;

function firmar(cuerpo: string): string {
  const secreto = process.env.AUTH_SECRET;
  if (!secreto) throw new Error("Falta AUTH_SECRET");
  return createHmac("sha256", secreto).update(cuerpo).digest("base64url");
}

/** Token firmado `<cuerpo>.<firma>` con el correo y la fecha de vencimiento (15 minutos). */
export function crearToken(correo: string, ahora = Date.now()): string {
  const cuerpo = Buffer.from(JSON.stringify({ c: correo, e: ahora + VIGENCIA_MS })).toString("base64url");
  return `${cuerpo}.${firmar(cuerpo)}`;
}

/** Devuelve el correo si el token es auténtico y no venció; si no, null. */
export function verificarToken(token: string, ahora = Date.now()): string | null {
  const [cuerpo, firma] = token.split(".");
  if (!cuerpo || !firma) return null;
  const esperada = Buffer.from(firmar(cuerpo));
  const recibida = Buffer.from(firma);
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) return null;
  try {
    const { c, e } = JSON.parse(Buffer.from(cuerpo, "base64url").toString());
    return typeof c === "string" && typeof e === "number" && ahora <= e ? c : null;
  } catch {
    return null;
  }
}
