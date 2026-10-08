"use client";

import { useActionState } from "react";
import { pedirEnlaceAccion } from "./actions";

export function Formulario() {
  const [resultado, accion, pendiente] = useActionState(pedirEnlaceAccion, null);
  return (
    <form action={accion} style={{ display: "grid", gap: 8 }}>
      <label htmlFor="correo">Correo</label>
      <input id="correo" name="correo" type="email" required />
      <button type="submit" disabled={pendiente}>
        Pedir enlace
      </button>
      {resultado && <p role="status">{resultado.mensaje}</p>}
    </form>
  );
}
