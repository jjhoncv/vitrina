# 0002. Fuente de datos de productos: Sheets API con service account, sin dependencias

- **Fecha:** 2026-10-06
- **Estado:** Aceptada

## Contexto

La portada lee la pestaña `productos` de Google Sheets. Los escenarios deben correr sin credenciales (ADR 0001).

## Decisión

`lib/productos.ts` expone `obtenerProductos()`. Por defecto lee la hoja con la API REST de Sheets v4, autenticando con una service account (JWT firmado con `node:crypto`, sin `googleapis`). Con `FUENTE_PRODUCTOS=fixture` devuelve `mocks/fixtures/productos.json`; Playwright arranca el servidor con esa variable. Variables de la fuente real: `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`.

## Por qué

Una sola función chica y sin dependencias nuevas; el CI es determinista. Se descartó `googleapis` por su tamaño para un solo GET.
