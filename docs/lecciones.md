# Lecciones de revisión

> **Criterio, no protocolo.** Las agrega el consultor del Guardián cuando revisa tus PRs (commits marcados `(consultor)`).
> Antes de aplicar una, mira su **alcance** y el **tipo** del proyecto (`PROYECTO.md` → Límites). Si dudas, elige lo simple y explícalo en el PR.
> **Ninguna lección justifica salirse del ticket**: si pide algo fuera de él, anótalo en el PR o propónlo para el Parking lot.
>
> Ciclo de vida: nace en una revisión (con su PR de ejemplo) → si se repite o es de «Siempre», se **gradúa** a una prueba o check y sale de aquí → si deja de aplicar, se **retira**. Tope: unas 15 vivas.

## Siempre (cualquier tipo: son baratas y protegen igual)

- **Autorización en el servidor.** Cuándo: una server action o ruta actúa a nombre de un usuario. Qué: verifica la sesión en el servidor y prueba «POST sin sesión → rechazado». Por qué: esconder un botón o formulario no protege nada. _Ej.: vitrina#33._
- **URLs absolutas sin headers del visitante.** Cuándo: armas un enlace que sale del sitio (correo, redirección). Qué: origen fijo o lista permitida, nunca `Host` / `X-Forwarded-Host` tal cual. Por qué: con un host falso, el enlace (y su token) apunta al atacante. _Ej.: vitrina#20._
- **Tokens fuera de la URL final.** Cuándo: usas un token de un enlace (entrada, invitación). Qué: después de validarlo, el destino no lo lleva. Por qué: queda en la barra y en el historial. _Ej.: vitrina#24._
- **No reimplementes protocolos ni criptografía** (SMTP, OAuth, JWT…). Si hace falta una dependencia y no puedes instalarla, para y pídesela al dueño en el PR, con el paquete y el motivo. _Ej.: vitrina#20._
- **Lo que no se prueba en local** (comportamiento del hosting, correo real): dilo en el PR y dale al dueño el paso exacto para comprobarlo en el preview. _Ej.: vitrina#20, #24._

## Según el tipo de proyecto

| Lección | Prueba / MVP rápido | Producto |
|---|---|---|
| **Texto libre que se guarda o se envía** | Largo máximo validado en el servidor | Además: limpieza, moderación y límite de envíos |
| **Límite de pedidos** (login, formularios públicos) | No hace falta; anótalo en el Parking lot | Obligatorio |
| **Dependencias nuevas** | Solo si evitan reimplementar algo delicado | Elegidas con criterio: mantenimiento, licencia, tamaño |
| **Enlaces y sesiones** | Vencimiento corto basta | Un solo uso y sesiones revocables |

## Según el stack (solo si el proyecto usa esa pieza)

- **Netlify — redirecciones:** una redirección sin query conserva la query original; usa un destino con query propia. _Ej.: vitrina#24._
- **Netlify — secretos de ejecución:** van en las variables del sitio, marcadas como secretas. GitHub Secrets solo si un workflow los usa. Dile al dueño exactamente cuáles y dónde.
- **GitHub — diagramas Mermaid:** empieza con `%%{init: {"flowchart": {"htmlLabels": false, "wrappingWidth": 400}}}%%` y `wrappingWidth: 400` (sin las dos, GitHub corta el texto de las cajas largas) y usa `flowchart TD`, de arriba hacia abajo, para leerlo en el celular. _Ej.: vitrina#36._
- **Gmail SMTP:** unos 500 correos por día y riesgo de spam; sirve para una prueba. Para un producto, un proveedor transaccional.
