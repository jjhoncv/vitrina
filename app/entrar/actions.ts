"use server";

import { headers } from "next/headers";
import { origenPermitido } from "@/lib/origen";
import { pedirEnlace, type Resultado } from "@/lib/pedir-enlace";

export async function pedirEnlaceAccion(_previo: Resultado | null, datos: FormData): Promise<Resultado> {
  const correo = String(datos.get("correo") ?? "").trim();
  if (!correo) return { ok: false, mensaje: "Escribe tu correo" };
  const h = await headers();
  // Los headers los controla el visitante: solo sirven si el host está en la lista permitida.
  const origen = origenPermitido(h.get("x-forwarded-host") ?? h.get("host"));
  try {
    return await pedirEnlace(correo, origen);
  } catch (error) {
    console.error(error);
    return { ok: false, mensaje: "No pudimos enviar el enlace, intenta de nuevo" };
  }
}
