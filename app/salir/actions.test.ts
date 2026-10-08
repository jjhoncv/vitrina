import { expect, it, vi } from "vitest";

const borrar = vi.fn();
const redirigir = vi.fn();
vi.mock("next/headers", () => ({ cookies: async () => ({ delete: borrar }) }));
vi.mock("next/navigation", () => ({ redirect: redirigir }));

it("salir borra la cookie de sesión y vuelve a la portada", async () => {
  const { salirAccion } = await import("./actions");
  await salirAccion();
  expect(borrar).toHaveBeenCalledWith("sesion");
  expect(redirigir).toHaveBeenCalledWith("/");
});
