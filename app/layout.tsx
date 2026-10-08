import type { Metadata } from "next";
import { cookies } from "next/headers";
import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";
import { COOKIE_SESION, verificarSesion } from "@/lib/sesion";

export const metadata: Metadata = {
  title: leerNombreDelProyecto(),
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const sesion = verificarSesion((await cookies()).get(COOKIE_SESION)?.value);
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        {sesion && <header>Hola, {sesion.nombre}</header>}
        {children}
      </body>
    </html>
  );
}
