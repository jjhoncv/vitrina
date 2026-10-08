import fixture from "@/mocks/fixtures/usuarios.json";
import { leerRango } from "./productos";

export type Usuario = { nombre: string; correo: string };

// Columnas de la pestaña `usuarios`: nombre, correo (PROYECTO.md). El correo se guarda en minúsculas.
export function filasAUsuarios(filas: string[][]): Usuario[] {
  return filas
    .filter((f) => f[1]?.trim())
    .map(([nombre, correo]) => ({ nombre: (nombre ?? "").trim(), correo: correo.trim().toLowerCase() }));
}

export async function buscarUsuario(correo: string): Promise<Usuario | undefined> {
  const usuarios =
    process.env.FUENTE_PRODUCTOS === "fixture" ? (fixture as Usuario[]) : filasAUsuarios(await leerRango("usuarios!A2:B"));
  return usuarios.find((u) => u.correo === correo.trim().toLowerCase());
}
