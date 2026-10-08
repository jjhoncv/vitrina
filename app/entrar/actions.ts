"use server";

import { headers } from "next/headers";
import { pedirEnlace, type Resultado } from "@/lib/pedir-enlace";

export async function pedirEnlaceAccion(_previo: Resultado | null, datos: FormData): Promise<Resultado> {
  const correo = String(datos.get("correo") ?? "").trim();
  if (!correo) return { ok: false, mensaje: "Escribe tu correo" };
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocolo = h.get("x-forwarded-proto") ?? "http";
  try {
    return await pedirEnlace(correo, `${protocolo}://${host}`);
  } catch (error) {
    console.error(error);
    return { ok: false, mensaje: "No pudimos enviar el enlace, intenta de nuevo" };
  }
}
