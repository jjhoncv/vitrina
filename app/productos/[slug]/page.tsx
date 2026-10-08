import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";
import { obtenerProductos } from "@/lib/productos";
import { COOKIE_SESION, verificarSesion } from "@/lib/sesion";
import { FormularioComentario } from "./formulario-comentario";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const producto = (await obtenerProductos()).find((p) => p.slug === slug);
  if (!producto) return {};
  return { title: `${producto.nombre} | ${leerNombreDelProyecto()}`, description: producto.descripcion };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producto = (await obtenerProductos()).find((p) => p.slug === slug);
  if (!producto) notFound();
  const sesion = verificarSesion((await cookies()).get(COOKIE_SESION)?.value);
  return (
    <main>
      <h1>{producto.nombre}</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={producto.imagen} alt={producto.nombre} width={320} height={320} />
      <p>{producto.descripcion}</p>
      <p>
        <strong>{producto.precio}</strong>
      </p>
      <p>Proveedor: {producto.proveedor}</p>
      <section>
        <h2>Comentarios</h2>
        {sesion ? <FormularioComentario /> : <p>Entra para comentar</p>}
      </section>
    </main>
  );
}
