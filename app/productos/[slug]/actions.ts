"use server";

import { cookies } from "next/headers";
import { validarComentario } from "@/lib/comentario";
import { COOKIE_SESION, verificarSesion } from "@/lib/sesion";

export type ResultadoComentario = { ok: boolean; mensaje: string };

export async function comentarAccion(_previo: ResultadoComentario | null, datos: FormData): Promise<ResultadoComentario> {
  // La pantalla esconde el formulario, pero la acción acepta POST de cualquiera: la sesión se verifica aquí.
  const sesion = verificarSesion((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) return { ok: false, mensaje: "Entra para comentar" };
  const validacion = validarComentario(String(datos.get("comentario") ?? ""));
  if (!validacion.ok) return validacion;
  // Guardar, enviar por correo y publicar llega en la tarea T8.
  return { ok: false, mensaje: "Todavía no podemos guardar comentarios" };
}
