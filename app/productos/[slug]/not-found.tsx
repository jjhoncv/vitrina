import Link from "next/link";

export default function NoEncontrado() {
  return (
    <main>
      <h1>Producto no encontrado</h1>
      <p>
        <Link href="/">Volver al catálogo</Link>
      </p>
    </main>
  );
}
