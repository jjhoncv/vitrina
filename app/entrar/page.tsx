import { Formulario } from "./formulario";

export default async function Entrar({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main>
      <h1>Entrar</h1>
      {error === "vencido" && <p role="alert">El enlace venció, pide uno nuevo</p>}
      <Formulario />
    </main>
  );
}
