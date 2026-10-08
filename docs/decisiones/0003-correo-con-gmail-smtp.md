# 0003. Correo con Gmail SMTP, sin dependencias

- **Fecha:** 2026-10-08
- **Estado:** Aceptada

## Contexto

La Fase 2 envía el enlace de entrada y la Fase 3 los comentarios. PROYECTO.md pedía Resend con un remitente verificado, que exige un dominio propio. El dueño prefiere usar su cuenta de Gmail (jjhoncv@gmail.com).

## Decisión

`lib/correo.ts` expone `enviarCorreo()` y envía por SMTP a `smtp.gmail.com:465` (TLS, AUTH PLAIN) con una contraseña de aplicación, usando un cliente mínimo sobre `node:tls`, sin `nodemailer`. Con `CORREO=simulado` no sale nada (Playwright arranca así el servidor, ADR 0001). El enlace es un token HMAC-SHA256 (`lib/enlace.ts`) con vencimiento de 15 minutos.

Variables: `GMAIL_USER`, `GMAIL_APP_PASSWORD` (requiere verificación en dos pasos en la cuenta) y `AUTH_SECRET` (firma de enlaces y sesiones). Van en GitHub Secrets y en las variables de Netlify.

## Por qué

No requiere dominio ni cuenta nueva y es gratis para el volumen de la prueba. Gmail limita ~500 envíos diarios y el remitente es una cuenta personal: aceptable para una prueba; si crece, se migra a un proveedor transaccional cambiando solo `enviarCorreo()`. Se evitó sumar `nodemailer` por la misma razón que en la ADR 0002.
