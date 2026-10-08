# 0004. Sesión en una cookie firmada, sin base de datos

- **Fecha:** 2026-10-08
- **Estado:** Aceptada

## Contexto

Al abrir el enlace de entrada (`/entrar/verificar`), el sitio debe recordar quién es el visitante. No hay base de datos (PROYECTO.md §3).

## Decisión

La sesión es una cookie `sesion` (`HttpOnly`, `SameSite=Lax`, `Secure` en https, 7 días) con el nombre y el correo firmados con `AUTH_SECRET` (`lib/sesion.ts`). Usa el mismo firmador que los enlaces (`lib/enlace.ts`); el campo `u` ("enlace" o "sesion") evita que un token sirva en el lugar del otro. El enlace vencido, inválido o de un correo que ya no está en la hoja redirige a `/entrar?error=vencido`. La cabecera del layout lee la cookie y muestra «Hola, <nombre>».

## Por qué

Sin estado en el servidor, sin dependencias. Costo: no se puede revocar una sesión antes de que venza (salvo cambiar `AUTH_SECRET`); aceptable para una prueba. El enlace no se invalida tras usarse (vence a los 15 minutos); un solo uso exigiría guardar estado.
