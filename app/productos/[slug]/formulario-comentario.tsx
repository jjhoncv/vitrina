"use client";

import { useActionState } from "react";
import { comentarAccion } from "./actions";

export function FormularioComentario() {
  const [resultado, accion, pendiente] = useActionState(comentarAccion, null);
  return (
    <form action={accion} style={{ display: "grid", gap: 8 }}>
      <label htmlFor="comentario">Comentario</label>
      <textarea id="comentario" name="comentario" rows={3} />
      <button type="submit" disabled={pendiente}>
        Comentar
      </button>
      {resultado && <p role="status">{resultado.mensaje}</p>}
    </form>
  );
}
