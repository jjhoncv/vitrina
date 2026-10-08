export type ValidacionComentario = { ok: true; texto: string } | { ok: false; mensaje: string };

export function validarComentario(entrada: string): ValidacionComentario {
  const texto = entrada.trim();
  return texto ? { ok: true, texto } : { ok: false, mensaje: "Escribe un comentario" };
}
