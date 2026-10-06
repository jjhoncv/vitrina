import { beforeAll, expect, it } from "vitest";
import sitemap from "./sitemap";

beforeAll(() => {
  process.env.FUENTE_PRODUCTOS = "fixture";
});

// Fase 1 — Sitemap con los productos.
it("incluye la URL de cada producto", async () => {
  const urls = (await sitemap()).map((e) => e.url);
  expect(urls.some((u) => u.endsWith("/productos/taza-de-ceramica"))).toBe(true);
  expect(urls.some((u) => u.endsWith("/productos/libreta-a5"))).toBe(true);
});
