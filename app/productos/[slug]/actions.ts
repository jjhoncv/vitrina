"use server";

import { validarComentario } from "@/lib/comentario";

export type ResultadoComentario = { ok: boolean; mensaje: string };

export async function comentarAccion(_previo: ResultadoComentario | null, datos: FormData): Promise<ResultadoComentario> {
  const validacion = validarComentario(String(datos.get("comentario") ?? ""));
  if (!validacion.ok) return validacion;
  // Guardar, enviar por correo y publicar llega en la tarea T8.
  return { ok: false, mensaje: "Todavía no podemos guardar comentarios" };
}
