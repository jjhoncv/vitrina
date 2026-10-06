# 0001. Datos de prueba en los escenarios y correos simulados

- **Fecha:** 2026-10-05
- **Estado:** Aceptada

## Contexto

Los escenarios BDD hablan de productos y usuarios concretos («Taza de cerámica», «ana@ejemplo.com»), y en las fases 2 y 3 se envían correos. La hoja real la edita el dueño en cualquier momento, y el CI no debe mandar correos de verdad.

## Decisión

Los escenarios corren con datos de prueba: productos, usuarios y comentarios salen de fixtures o mocks en vez de la hoja real, y los correos se simulan con un mailer falso que guarda lo enviado (por ejemplo, el enlace de entrada). Solo llevan `@smoke`, que corre contra producción, los escenarios que no dependen de productos específicos ni envían correos: hoy, «Producto que no existe» y «Correo sin acceso».

## Por qué

Así el CI es determinista y no necesita credenciales de Google ni de Resend, y el smoke de producción no se rompe cuando cambia la hoja. Se descartó correr los E2E contra una hoja de pruebas real: sería más lento, necesitaría credenciales en cada PR y podría fallar por cambios externos.
