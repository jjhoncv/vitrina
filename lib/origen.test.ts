import { expect, it } from "vitest";
import { origenPermitido, ORIGEN_PRODUCCION } from "./origen";

it("un host ajeno da el origen de producción", () => {
  expect(origenPermitido("evil.com")).toBe(ORIGEN_PRODUCCION);
  expect(origenPermitido("vitrina-jjhoncv.netlify.app.evil.com")).toBe(ORIGEN_PRODUCCION);
  expect(origenPermitido("evil.com/--vitrina-jjhoncv.netlify.app")).toBe(ORIGEN_PRODUCCION);
  expect(origenPermitido("x@evil.com#.vitrina-jjhoncv.netlify.app")).toBe(ORIGEN_PRODUCCION);
  expect(origenPermitido("localhost.evil.com")).toBe(ORIGEN_PRODUCCION);
  expect(origenPermitido("localhost:abc")).toBe(ORIGEN_PRODUCCION);
  expect(origenPermitido("vitrina-jjhoncv.netlify.app:8080")).toBe(ORIGEN_PRODUCCION);
  expect(origenPermitido(null)).toBe(ORIGEN_PRODUCCION);
});

it("producción y sus alias se aceptan", () => {
  expect(origenPermitido("vitrina-jjhoncv.netlify.app")).toBe("https://vitrina-jjhoncv.netlify.app");
  expect(origenPermitido("staging--vitrina-jjhoncv.netlify.app")).toBe("https://staging--vitrina-jjhoncv.netlify.app");
  expect(origenPermitido("pr-20--vitrina-jjhoncv.netlify.app")).toBe("https://pr-20--vitrina-jjhoncv.netlify.app");
  expect(origenPermitido("PR-20--Vitrina-JJHoncv.netlify.app")).toBe("https://pr-20--vitrina-jjhoncv.netlify.app");
});

it("localhost con puerto se acepta en http", () => {
  expect(origenPermitido("localhost:3000")).toBe("http://localhost:3000");
  expect(origenPermitido("localhost")).toBe("http://localhost");
});
