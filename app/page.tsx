import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";
import { obtenerProductos } from "@/lib/productos";

export const dynamic = "force-dynamic";

export default async function Page() {
  const productos = await obtenerProductos();
  return (
    <main>
      <h1>{leerNombreDelProyecto()}</h1>
      <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: 24, flexWrap: "wrap" }}>
        {productos.map((p) => (
          <li key={p.slug} data-testid="producto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.imagen} alt={p.nombre} width={160} height={160} />
            <h2>{p.nombre}</h2>
            <p>{p.precio}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
