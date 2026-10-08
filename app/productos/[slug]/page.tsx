import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { comentariosDe } from "@/lib/comentarios";
import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";
import { obtenerProductos } from "@/lib/productos";
import { COOKIE_SESION, verificarSesion } from "@/lib/sesion";
import { FormularioComentario } from "./formulario-comentario";

export const dynamic = "force-dynamic";

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Lima" });

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
  const comentarios = await comentariosDe(producto.slug);
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
      <section aria-labelledby="comentarios">
        <h2 id="comentarios">Comentarios</h2>
        {comentarios.map((c, i) => (
          <article key={i}>
            <strong>{c.nombre}</strong> <time dateTime={c.fecha}>{formatearFecha(c.fecha)}</time>
            <p style={{ whiteSpace: "pre-wrap" }}>{c.texto}</p>
          </article>
        ))}
        {sesion ? <FormularioComentario slug={producto.slug} /> : <p>Entra para comentar</p>}
      </section>
    </main>
  );
}
