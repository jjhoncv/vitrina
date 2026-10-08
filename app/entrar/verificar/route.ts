import { NextResponse } from "next/server";
import { verificarToken } from "@/lib/enlace";
import { origenPermitido } from "@/lib/origen";
import { COOKIE_SESION, crearSesion, SESION_MS } from "@/lib/sesion";
import { buscarUsuario } from "@/lib/usuarios";

/** Valida el enlace del correo, abre la sesión en una cookie y vuelve a la portada. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  // Los headers los controla el visitante: solo sirven si el host está en la lista permitida.
  const origen = origenPermitido(request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host);
  const correo = verificarToken(url.searchParams.get("token") ?? "");
  const usuario = correo ? await buscarUsuario(correo) : undefined;
  if (!usuario) return NextResponse.redirect(`${origen}/entrar?error=vencido`);
  const respuesta = NextResponse.redirect(`${origen}/`);
  respuesta.cookies.set(COOKIE_SESION, crearSesion(usuario), {
    httpOnly: true,
    sameSite: "lax",
    secure: origen.startsWith("https:"),
    path: "/",
    maxAge: SESION_MS / 1000,
  });
  return respuesta;
}
