# Vitrina

## 1. Problema

Quiero comprobar con personas reales que un catálogo web sencillo funciona: que los clientes vean los productos y que sus comentarios lleguen directo al proveedor. Quiero validarlo antes de invertir en una base de datos y un panel de administración. Hoy no tengo nada que mostrar.

## 2. Qué es

Un catálogo web de productos simples que se administra desde una hoja de Google Sheets. Cada producto tiene su propia landing con URL amigable. Los usuarios autorizados entran con un enlace que reciben por correo y pueden comentar un producto. El comentario llega por correo al usuario y al proveedor, y queda publicado en la página.

## 3. Qué NO es

- No es un marketplace: no hay carrito, pagos ni vendedores que se registren.
- No tiene panel de administración: la hoja es el administrador.
- No hay registro abierto: solo entran los usuarios que el dueño pone en la hoja.
- No tiene base de datos: eso es para cuando la prueba funcione.

## 4. Valor

Con un link puedo mostrar un catálogo real que aparece en buscadores, que actualizo editando una hoja y que conecta a clientes con proveedores por correo.

## 5. Cómo sé que funcionó

En **3 semanas** desde que se publica la Fase 3, al menos **5 usuarios distintos** de la hoja dejan un comentario cada uno, y **el proveedor confirma que le llegaron los correos**.

## 6. Límites

- **Tiempo:** 6 semanas en total, unas 2 por fase. Si se pasa, se achica o se para.
- **Tipo:** prueba. Nada de base de datos, panel ni registro abierto hasta validarla.
- **Cuentas que se van a pedir:**
  - Fase 1: service account de Google Cloud con acceso a la hoja.
  - Fases 2 y 3: cuenta de Resend con un remitente verificado.

## 7. Fases

### Fase 1 — Catálogo público
- Portada con todos los productos (foto, nombre y precio) y una landing por producto en `/productos/<slug>`, con título y descripción para SEO, y `sitemap.xml`. Todo se lee de la pestaña `productos`.

**Valor:** ya se puede compartir el catálogo y aparece en Google.

### Fase 2 — Entrar con enlace por correo
- El usuario escribe su correo. Si está en la pestaña `usuarios`, recibe un enlace que vence en 15 minutos y con el que entra. También puede salir.

**Valor:** el sitio sabe quién es cada visitante autorizado.

### Fase 3 — Comentarios
- Un usuario que entró comenta en la landing. El comentario se guarda en la pestaña `comentarios`, se envía por correo al usuario y al proveedor, y se publica en la página.

**Valor:** el cliente le habla al proveedor desde el catálogo. Esto completa la prueba.

**Pestañas de la hoja:**
- `productos`: nombre, slug, descripción, precio, imagen (URL), proveedor, correo del proveedor
- `usuarios`: nombre, correo
- `comentarios`: la llena el sitio

## 8. Criterios de aceptación

```gherkin
# Fase 1
Escenario: Ver el catálogo
  Dado que la hoja tiene los productos "Taza de cerámica" y "Libreta A5"
  Cuando entro a la portada
  Entonces veo los dos productos con su foto, nombre y precio

Escenario: Abrir la landing de un producto
  Dado que la hoja tiene el producto "Taza de cerámica" con slug "taza-de-ceramica"
  Cuando hago clic en "Taza de cerámica"
  Entonces estoy en "/productos/taza-de-ceramica"
  Y veo su descripción, precio y proveedor

Escenario: Título para buscadores
  Cuando entro a "/productos/taza-de-ceramica"
  Entonces el título de la página es "Taza de cerámica | Vitrina"

Escenario: Producto que no existe
  Cuando entro a "/productos/no-existe"
  Entonces veo "Producto no encontrado"

Escenario: Sitemap con los productos
  Cuando entro a "/sitemap.xml"
  Entonces veo la URL "/productos/taza-de-ceramica"

# Fase 2
Escenario: Pedir el enlace de entrada
  Dado que "ana@ejemplo.com" está en la hoja de usuarios
  Cuando escribo "ana@ejemplo.com" y pido el enlace
  Entonces veo "Te enviamos un enlace a ana@ejemplo.com"

Escenario: Correo sin acceso
  Dado que "otro@ejemplo.com" no está en la hoja de usuarios
  Cuando escribo "otro@ejemplo.com" y pido el enlace
  Entonces veo "Este correo no tiene acceso"

Escenario: Entrar con el enlace
  Dado que Ana pidió su enlace
  Cuando abre el enlace
  Entonces ve "Hola, Ana" en la cabecera

Escenario: Enlace vencido
  Dado que Ana pidió su enlace hace más de 15 minutos
  Cuando abre el enlace
  Entonces ve "El enlace venció, pide uno nuevo"

Escenario: Salir
  Dado que Ana entró
  Cuando hace clic en "Salir"
  Entonces ve "Entrar" en la cabecera

# Fase 3
Escenario: Comentar un producto
  Dado que Ana entró y está en la landing de "Taza de cerámica"
  Cuando escribe "¿Viene en azul?" y envía
  Entonces ve "Enviamos tu comentario a ti y al proveedor"
  Y ve su comentario publicado con su nombre y la fecha

Escenario: Comentario visible para todos
  Dado que Ana comentó "¿Viene en azul?" en "Taza de cerámica"
  Cuando un visitante sin sesión entra a esa landing
  Entonces ve el comentario de Ana

Escenario: Sin sesión no se comenta
  Dado que no entré
  Cuando estoy en la landing de "Taza de cerámica"
  Entonces veo "Entra para comentar" y no veo el formulario

Escenario: Comentario vacío
  Dado que Ana entró y está en la landing de "Taza de cerámica"
  Cuando envía un comentario vacío
  Entonces ve "Escribe un comentario"
```

## 9. Parking lot

- Base de datos real (2026-10-05): primero hay que validar la prueba.
- Panel de administración propio (2026-10-05): la hoja cumple ese papel por ahora.
- Registro abierto de usuarios (2026-10-05): en la prueba, los usuarios los pone el dueño.
- Moderar u ocultar comentarios (2026-10-05): por ahora se publican directo.
- Buscador y categorías (2026-10-05): la portada empieza como un listado simple.

## 10. Decisiones tomadas

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-10-05 | Nombre: Vitrina | El proyecto es un catálogo, no una lista de lecturas |
| 2026-10-05 | Es una prueba, no un proyecto real | Validar con personas reales antes de invertir más |
| 2026-10-05 | Datos en Google Sheets, sin base de datos | Es una prueba y el dueño edita todo desde la hoja |
| 2026-10-05 | Entrada con enlace por correo, sin contraseñas | Así no hay claves visibles en la hoja |
| 2026-10-05 | Los comentarios se publican y se envían por correo | Pedido del dueño |
| 2026-10-05 | Éxito: 5 usuarios comentan en 3 semanas tras la Fase 3 | Métrica medible y con plazo |
| 2026-10-05 | Límite: 6 semanas en total | Si se pasa, se achica o se para |
| 2026-10-05 | Los escenarios usan datos de prueba (fixtures/mocks) y los correos se simulan; `@smoke` solo en escenarios que no dependen de productos específicos ([ADR 0001](docs/decisiones/0001-datos-de-prueba-en-escenarios.md)) | El CI no depende de la hoja real ni envía correos, y el smoke contra producción no se rompe cuando el dueño edita la hoja |
