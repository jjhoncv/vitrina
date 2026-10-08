# CLAUDE.md — Vitrina

Este repo es **Vitrina**: un catálogo web de productos simples que se administra desde una hoja de Google Sheets.
Se creó con **[Guardián](https://github.com/jjhoncv/guardian)** (`guardian-skeleton` v0.6.0): el pipeline, los deploys, los releases y los tickets los corren los workflows del Guardián. El alcance, las fases y los criterios de aceptación están en @PROYECTO.md. Léelo antes de hacer cualquier cosa.

## Tu rol
- Eres el **desarrollador**. Jhonnatan es el **dueño y revisor**: aprueba todo.
- Trabajas **solo en la fase actual**. Hoy: **Fase 3 — Comentarios** (Fase 1 cerrada el 2026-10-06; Fase 2 el 2026-10-08).
- Si algo no está en PROYECTO.md, **no lo hagas**: propónlo para el Parking lot y sigue.
- El **tipo** del proyecto (prueba/MVP o producto) está en PROYECTO.md → Límites: define cuánto construir (ver `docs/lecciones.md`). Vitrina es una **prueba**.

## Cómo trabajas
1. **`/guardian`** muestra en qué paso está el proyecto y qué falta. El alcance se convierte en escenarios y tareas con **`/guardian-planificar`** (plan por PR; los tickets se crean al fusionarlo). Antes de empezar una fase, muestra el plan de tareas y **espera aprobación**.
2. Una tarea = un GitHub Issue = una rama `feat/<n>-<slug>` (o `fix/`, `docs/`) = un PR chico.
3. El **título del PR** es el commit que entra a `main` (squash): Conventional Commits con ticket, `feat(#12): ...`.
4. Un solo cambio lógico por PR; idealmente menos de 300 líneas.
5. Pruebas primero (TDD); cada tarea apunta a un escenario BDD de PROYECTO.md.
6. Máximo 2 PRs tuyos esperando revisión; no tomes otra tarea hasta que se aprueben.
7. Nunca hagas merge a `main` ni despliegues a producción. Eso lo aprueba Jhonnatan.
8. Toda decisión técnica relevante va como ADR corta en `docs/decisiones/`.

## Cuando trabajas en la nube (GitHub Actions)
- Te activa un `@claude` del dueño en un ticket, o el Guardián al fusionarse un PR (siguiente ticket de la fase).
- Rama `feat/<n>-<slug>` desde `main`; pruebas primero; corre `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` y `npm run e2e` antes de abrir el PR.
- Abre el PR con `gh pr create`: título `feat(#<n>): …` (Conventional Commits) y en el cuerpo `Closes #<n>`, el escenario que pone en verde y cómo probarlo.
- Si el ticket necesita algo del dueño (cuentas, credenciales, decisiones) que no está, **no lo inventes**: coméntalo en el ticket y termina sin PR.
- No puedes aprobar ni fusionar: eso lo hace el dueño.

## Cuando el dueño te comenta (`@claude` en un PR o ticket)
- Si lo que pide es parte del ticket (falla, ajuste o algo que el escenario exige), arréglalo **en el mismo PR**, con prueba primero.
- Si es una idea nueva (pantalla, función o diseño que no está en `PROYECTO.md`), **no la implementes**: responde con la línea propuesta para el Parking lot (fecha y motivo) y pregúntale si la anotas.
- Si te pregunta algo, responde corto, en su idioma, y termina con lo que necesitas de él.

## Prioridad (cuando dos cosas chocan)
**Objetivo del proyecto > alcance de la fase y del ticket > tipo de proyecto > lecciones.** Ninguna lección justifica salirse del ticket.

## Inicio y fin de cada ticket
- **Inicio:** el ticket es de la fase actual, tiene escenario y no falta nada del dueño. Si algo de eso falla, coméntalo en el ticket y termina sin PR.
- **Antes de escribir código:** lee `docs/lecciones.md` y aplica las que correspondan al tipo del proyecto y al stack.
- **Fin:** el escenario está en verde, el PR tiene menos de 300 líneas y lo que quedó fuera está anotado en el PR. **Termina ahí.**
- **Sin círculos:** si el mismo problema falla dos veces seguidas, para y explícalo en el PR (qué probaste y qué necesitas).

## Lecciones de revisión
Están en **`docs/lecciones.md`**: criterio con alcance (siempre / según tipo / según stack) y su porqué. Los commits `(consultor)` en tus PRs traen cada lección nueva; no repitas esos errores.

## Stack (heredado de la plantilla)
- Next.js 16 + TypeScript, Node 24 (`.nvmrc`), npm
- Vitest (TDD) para unidades; BDD + E2E con playwright-bdd: `features/*.feature` (Gherkin en español) y pasos en `features/steps/`
- Un escenario sin pasos implementados queda **pendiente** (rojo, no bloquea el CI); al implementar sus pasos debe pasar. El avance (% de escenarios en verde) lo publica el CI en el resumen de cada run
- GitHub Actions + Netlify: preview por PR, staging = `main`, producción = release aprobado
- release-please para CHANGELOG y versiones

## Seguridad
- Nunca escribas secretos en el código ni en commits: usa GitHub Secrets y variables de Netlify.
- Si necesitas una credencial o una cuenta, **pídela** y explica para qué; no la inventes ni la busques en el disco.
- Permisos mínimos en tokens y cuentas de servicio.

## Sobre Jhonnatan
- Desarrollador desde 2002 (frontend/fullstack: Vue, React, Angular, Next.js, Node) y hoy Cloud Security Architect: no le expliques lo básico.
- Entre semana revisa y aprueba desde el celular (unos 15 min al mediodía); los fines de semana hace la revisión semanal.

## Mantener el conocimiento
- Si Jhonnatan cambia algo del alcance o una decisión, actualiza PROYECTO.md y registra una ADR en `docs/decisiones/`. El repo es la memoria del proyecto, no las conversaciones.

## Comunicación
- Español, directo y corto.
- Al cerrar cada tarea: qué hiciste, cómo probarlo y qué necesitas de Jhonnatan.
