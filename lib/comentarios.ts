import { enviarCorreo, type Correo } from "./correo";
import { agregarFila, leerRango, obtenerProductos } from "./productos";
import type { Sesion } from "./sesion";

export type Comentario = { slug: string; nombre: string; texto: string; fecha: string };
export type Resultado = { ok: boolean; mensaje: string };

export const MAX_COMENTARIO = 1000;

// Columnas de la pestaña `comentarios`: slug, nombre, correo, texto, fecha ISO. El correo no se publica.
export function filasAComentarios(filas: string[][]): Comentario[] {
  return filas
    .filter((f) => f[0]?.trim() && f[3]?.trim())
    .map(([slug, nombre, , texto, fecha]) => ({ slug: slug.trim(), nombre: nombre ?? "", texto, fecha: fecha ?? "" }));
}

const enFixture = () => process.env.FUENTE_PRODUCTOS === "fixture";

// Con fixtures (ADR 0001) los comentarios viven en memoria del servidor, no en la hoja real.
const memoria = () => ((globalThis as { __comentarios?: string[][] }).__comentarios ??= []);

const leerFilas = async () => (enFixture() ? memoria() : await leerRango("comentarios!A2:E"));

// Los comentarios son una sección secundaria: si la hoja falla al leerlos, la landing sigue sin ellos.
export async function comentariosDe(slug: string): Promise<Comentario[]> {
  try {
    return filasAComentarios(await leerFilas()).filter((c) => c.slug === slug);
  } catch (error) {
    console.error("No se pudieron leer los comentarios", error);
    return [];
  }
}

/** Guarda el comentario, lo envía por correo al usuario y al proveedor, y queda publicado. */
export async function comentar(
  slug: string,
  texto: string,
  usuario: Sesion,
  enviar: (c: Correo) => Promise<void> = enviarCorreo,
): Promise<Resultado> {
  const limpio = texto.trim();
  if (!limpio) return { ok: false, mensaje: "Escribe un comentario" };
  if (limpio.length > MAX_COMENTARIO) return { ok: false, mensaje: `Máximo ${MAX_COMENTARIO} caracteres` };
  const producto = (await obtenerProductos()).find((p) => p.slug === slug);
  if (!producto) return { ok: false, mensaje: "Producto no encontrado" };

  const fila = [producto.slug, usuario.nombre, usuario.correo, limpio, new Date().toISOString()];
  if (enFixture()) memoria().push(fila);
  else await agregarFila("comentarios", fila);

  const correo = (para: string): Correo => ({
    para,
    asunto: `Comentario sobre ${producto.nombre}`,
    texto: `${usuario.nombre} (${usuario.correo}) comentó sobre «${producto.nombre}»:\n\n${limpio}\n`,
  });
  const destinos = [usuario.correo, producto.correoProveedor.trim()].filter(Boolean);
  const envios = await Promise.allSettled(destinos.map((d) => enviar(correo(d))));
  const fallos = envios.filter((e) => e.status === "rejected");
  if (fallos.length) {
    fallos.forEach((f) => console.error(f.reason));
    return { ok: true, mensaje: "Publicamos tu comentario, pero no pudimos enviar el correo" };
  }
  return { ok: true, mensaje: "Enviamos tu comentario a ti y al proveedor" };
}
