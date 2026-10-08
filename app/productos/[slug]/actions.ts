"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { comentar, type Resultado } from "@/lib/comentarios";
import { COOKIE_SESION, verificarSesion } from "@/lib/sesion";

export async function comentarAccion(_previo: Resultado | null, datos: FormData): Promise<Resultado> {
  // La identidad sale de la cookie firmada, nunca del formulario.
  const sesion = verificarSesion((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) return { ok: false, mensaje: "Entra para comentar" };
  const slug = String(datos.get("slug") ?? "");
  try {
    const resultado = await comentar(slug, String(datos.get("texto") ?? ""), sesion);
    if (resultado.ok) revalidatePath(`/productos/${slug}`);
    return resultado;
  } catch (error) {
    console.error(error);
    return { ok: false, mensaje: "No pudimos guardar tu comentario, intenta de nuevo" };
  }
}
