import type { MetadataRoute } from "next";
import { obtenerProductos } from "@/lib/productos";

export const dynamic = "force-dynamic";

// URL absoluta del sitio: `URL` la define Netlify en cada deploy.
const sitio = () => (process.env.URL ?? "http://localhost:3000").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productos = await obtenerProductos();
  return [
    { url: sitio() },
    ...productos.map((p) => ({ url: `${sitio()}/productos/${p.slug}` })),
  ];
}
