export const ORIGEN_PRODUCCION = "https://vitrina-jjhoncv.netlify.app";

const DOMINIO = "vitrina-jjhoncv.netlify.app";
const ALIAS = new RegExp(`^[a-z0-9]([a-z0-9-]*[a-z0-9])?--${DOMINIO.replace(/\./g, "\\.")}$`);
const LOCAL = /^localhost(:\d{1,5})?$/;

/** Origen para armar enlaces: solo de una lista permitida; cualquier otro host cae en producción. */
export function origenPermitido(host: string | null | undefined): string {
  const h = (host ?? "").trim().toLowerCase();
  if (h === DOMINIO || ALIAS.test(h)) return `https://${h}`;
  if (LOCAL.test(h)) return `http://${h}`;
  return ORIGEN_PRODUCCION;
}
