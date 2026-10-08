"use client";

import { useActionState } from "react";
import { comentarAccion } from "./actions";

export function FormularioComentario({ slug }: { slug: string }) {
  const [resultado, accion, pendiente] = useActionState(comentarAccion, null);
  return (
    <form action={accion} style={{ display: "grid", gap: 8 }}>
      <input type="hidden" name="slug" value={slug} />
      <label htmlFor="texto">Comentario</label>
      <textarea id="texto" name="texto" rows={3} maxLength={1000} />
      <button type="submit" disabled={pendiente}>
        Enviar
      </button>
      {resultado && <p role="status">{resultado.mensaje}</p>}
    </form>
  );
}
