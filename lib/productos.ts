import { createSign } from "node:crypto";
import fixture from "@/mocks/fixtures/productos.json";

export type Producto = {
  nombre: string;
  slug: string;
  descripcion: string;
  precio: string;
  imagen: string;
  proveedor: string;
  correoProveedor: string;
};

// Columnas de la pestaña `productos`, en orden (PROYECTO.md).
export function filasAProductos(filas: string[][]): Producto[] {
  return filas
    .filter((f) => f[0]?.trim())
    .map(([nombre, slug, descripcion, precio, imagen, proveedor, correoProveedor]) => ({
      nombre: nombre.trim(),
      slug: (slug ?? "").trim(),
      descripcion: descripcion ?? "",
      precio: precio ?? "",
      imagen: imagen ?? "",
      proveedor: proveedor ?? "",
      correoProveedor: correoProveedor ?? "",
    }));
}

const base64url = (s: string | Buffer) => Buffer.from(s).toString("base64url");

async function tokenDeGoogle(correo: string, clavePrivada: string): Promise<string> {
  const ahora = Math.floor(Date.now() / 1000);
  const cabecera = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const cuerpo = base64url(
    JSON.stringify({
      iss: correo,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: ahora,
      exp: ahora + 3600,
    }),
  );
  const firma = createSign("RSA-SHA256").update(`${cabecera}.${cuerpo}`).sign(clavePrivada);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${cabecera}.${cuerpo}.${base64url(firma)}`,
    }),
  });
  if (!res.ok) throw new Error(`Google rechazó la service account (${res.status})`);
  return (await res.json()).access_token;
}

async function leerDeLaHoja(): Promise<Producto[]> {
  const { GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error("Faltan GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_PRIVATE_KEY");
  }
  const token = await tokenDeGoogle(GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"));
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/productos!A2:G`,
    { headers: { authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error(`No se pudo leer la hoja (${res.status})`);
  return filasAProductos((await res.json()).values ?? []);
}

// Fuente de datos: la hoja real, o el fixture con FUENTE_PRODUCTOS=fixture (pruebas, ADR 0001).
export async function obtenerProductos(): Promise<Producto[]> {
  return process.env.FUENTE_PRODUCTOS === "fixture" ? (fixture as Producto[]) : leerDeLaHoja();
}
