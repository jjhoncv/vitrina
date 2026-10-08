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

const SCOPE_LECTURA = "https://www.googleapis.com/auth/spreadsheets.readonly";
const SCOPE_ESCRITURA = "https://www.googleapis.com/auth/spreadsheets";

async function tokenDeGoogle(correo: string, clavePrivada: string, scope: string): Promise<string> {
  const ahora = Math.floor(Date.now() / 1000);
  const cabecera = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const cuerpo = base64url(
    JSON.stringify({
      iss: correo,
      scope,
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

function credenciales() {
  const { GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error("Faltan GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_PRIVATE_KEY");
  }
  return { hoja: GOOGLE_SHEET_ID, correo: GOOGLE_SERVICE_ACCOUNT_EMAIL, clave: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n") };
}

/** Agrega una fila al final de una pestaña. RAW: la hoja no interpreta fórmulas del visitante. */
export async function agregarFila(pestana: string, fila: string[]): Promise<void> {
  const { hoja, correo, clave } = credenciales();
  const token = await tokenDeGoogle(correo, clave, SCOPE_ESCRITURA);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${hoja}/values/${pestana}!A:E:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ values: [fila] }),
    },
  );
  if (!res.ok) throw new Error(`No se pudo escribir en la hoja (${res.status})`);
}

/** Lee un rango de la hoja (p. ej. `productos!A2:G`) con la service account. */
export async function leerRango(rango: string): Promise<string[][]> {
  const { hoja, correo, clave } = credenciales();
  const token = await tokenDeGoogle(correo, clave, SCOPE_LECTURA);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${hoja}/values/${rango}`,
    { headers: { authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error(`No se pudo leer la hoja (${res.status})`);
  return (await res.json()).values ?? [];
}

const leerDeLaHoja = async () => filasAProductos(await leerRango("productos!A2:G"));

// Fuente de datos: la hoja real, o el fixture con FUENTE_PRODUCTOS=fixture (pruebas, ADR 0001).
export async function obtenerProductos(): Promise<Producto[]> {
  return process.env.FUENTE_PRODUCTOS === "fixture" ? (fixture as Producto[]) : leerDeLaHoja();
}
