import { enviarCorreo, type Correo } from "./correo";
import { crearToken } from "./enlace";
import { buscarUsuario } from "./usuarios";

export type Resultado = { ok: boolean; mensaje: string };

/** Si el correo está en la hoja, envía el enlace de entrada (vence en 15 minutos). */
export async function pedirEnlace(
  correo: string,
  origen: string,
  enviar: (c: Correo) => Promise<void> = enviarCorreo,
): Promise<Resultado> {
  const usuario = await buscarUsuario(correo);
  if (!usuario) return { ok: false, mensaje: "Este correo no tiene acceso" };
  const enlace = `${origen}/entrar/verificar?token=${encodeURIComponent(crearToken(usuario.correo))}`;
  await enviar({
    para: usuario.correo,
    asunto: "Tu enlace para entrar a Vitrina",
    texto: `Hola, ${usuario.nombre}.\n\nEntra con este enlace (vence en 15 minutos):\n${enlace}\n`,
  });
  return { ok: true, mensaje: `Te enviamos un enlace a ${usuario.correo}` };
}
