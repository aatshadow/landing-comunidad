# Landing de la comunidad · Zona Gemelos VIP

Web estática, sin build: se sirve tal cual desde la raíz.

| Ruta | Qué es |
|---|---|
| `/` (`index.html`) | La landing. «Entrar en la comunidad» abre el formulario en un pop-up: nombre · prefijo + teléfono · email · «¿Desde cuándo nos conoces?» · «¿A qué te dedicas hoy?» |
| `/gracias/` | Después de enviar: botón a la comunidad de WhatsApp → `https://go.wha.link/zonagemelos` (campaña de Funnelchat) |
| `assets/` | `zg.css` (estilos), `zg.js` (formulario), logo |

| `api/optin.js` | Función de Vercel (`POST /api/optin`): recibe el formulario y lo reenvía al CRM de Zona Gemelos con el token |

## Conectar con el CRM (lo único que hay que hacer)
1. Importar el repo en **Vercel** (proyecto estático; la función de `api/` la detecta sola).
2. En *Settings → Environment Variables* crear **`CORE_OPTIN_TOKEN`** con el token del webhook de opt-in
   (el mismo que ya usa tu backend; **se pasa aparte**, nunca en el repo: el repo es público).
3. Redeploy. Cada registro entra en el CRM con sus UTM, motivo, página de entrada, IP y dispositivo.

Sin la variable, el CRM rechaza el lead y avisa solo en 🧲│gemelos-optins. Si la web no va en Vercel, el formulario
tiene que apuntar (`CONFIG.webhook` en `assets/zg.js`) a un backend que haga lo mismo que `api/optin.js`.

## Links con UTM (YouTube)
```
https://<dominio>/?utm_source=youtube&utm_medium=video&utm_campaign=comunidad_oct26&utm_content=<ID del vídeo>&utm_term=<sitio>
```
- `utm_content` = el **ID del vídeo** (lo de después de `watch?v=`, 11 caracteres): dice en qué vídeo se registró.
- `utm_term` = dónde estaba el link: `descripcion` · `comentario` · `short`.
- Cambiar `utm_campaign` en cada lanzamiento.

## Qué manda el formulario
POST JSON con los nombres del contrato del webhook: `name, phone, email, reason, utmSource, utmMedium, utmCampaign,
utmContent, utmTerm, gclid, fbclid, landingPage, referrer, landingPageAt, submitPage, submittedAt, language, timezone,
platform, screenWidth, screenHeight` (+ los mismos en castellano: `nombre, telefono, conoce, dedica, utm_*`).
Al cambiar `assets/zg.js` o `zg.css`, sube la `?v=` de los `<script>`/`<link>` para que el navegador baje la nueva.

---

# Masterclass gratuita · martes 10 de noviembre de 2026, 19:00 (hora de España)

Mismo repo, mismo despliegue. Estilo y lógica comunes en `assets/mc.css` y `assets/mc.js` (no tocan la landing de la comunidad).

| Ruta | Qué es |
|---|---|
| `/masterclass/` | Registro. Larga: promesa, cuenta atrás, el reto de los 100K, la historia en 4 pasos, qué te vas a llevar, para quién es, creencias, quiénes somos, FAQ. El formulario (pop-up) manda a `/api/optin` con `reason: "masterclass_10nov"` y salta a gracias |
| `/masterclass/gracias/` | «Tu plaza está reservada» + 3 pasos: comunidad de WhatsApp (`go.wha.link/zonagemelos` con los UTM) · calendario (Google + `.ics` con avisos 1 h y 10 min) · pase |
| `/masterclass/pase/` | Entrada digital con el nombre del registro (localStorage) y cuenta atrás; «Descargar mi pase» genera un PNG en el navegador |
| `/directo/` | Sala. Antes de la hora: cuenta atrás + recordatorio de comunidad. A la hora: reproductor + «EN DIRECTO». Debajo, la oferta (oculta hasta abrir plazas) |
| `/replay/` | Grabación + textos de los anuncios 1 y 2 + «Agenda una llamada» + oferta + cuenta atrás al cierre (17-11, medianoche) |

Todo el contenido sale del documento maestro del lanzamiento (`lanzamiento-nov/LANZAMIENTO-FUENTE-DE-VERDAD.md`, fuera del repo).

## CONFIG (arriba de `assets/mc.js`) · lo que queda por rellenar

| Clave | Qué poner | Estado |
|---|---|---|
| `directo` | Id de YouTube Live (11 caracteres), URL de Vimeo o enlace de Zoom | ⇢ pendiente: plataforma del directo |
| `replay` | Id de YouTube o URL de Vimeo de la grabación | ⇢ pendiente |
| `ofertaVisible` | `true` cuando los Gemelos abran plazas en el directo (o `?oferta=1` en la URL) | `false` |
| `pago` | Enlace de pago de la pasarela | ⇢ pendiente: pasarela |
| `agenda` | Enlace de Calendly / Cal.com para la llamada de 20 min | ⇢ pendiente: herramienta de agenda |
| `duracionMin` | Duración del directo (calendario) | 120 provisional |
| `qa` | Directo de Q&A, jueves 12-11 | hora ⇢ pendiente |
| `cierre` | Cierre de plazas | `2026-11-17T23:59:59+01:00` |

Más huecos en las páginas (etiqueta amarilla): fotos de Carlos y Daniel (`/masterclass/`), bonus de los 20 primeros (la tabla de la oferta dice «clase reducida online» y los anuncios 3 y 11 dicen «evento presencial en nuestra casa»), aviso legal propio.

## Parámetros útiles
- `?publicar=1` oculta las etiquetas amarillas.
- `?oferta=1` enseña la oferta en la sala.
- `?ahora=2026-11-10T19:05:00+01:00` simula la hora (estado de la sala y cuentas atrás).
- `?nombre=Laura` pone el nombre en gracias/pase sin registrarse.
- `#registro` abre el pop-up de registro al entrar.

Los UTM de la primera página se guardan en la visita y viajan a gracias, pase, sala, comunidad y enlaces de pago/agenda.
Al cambiar `mc.css` o `mc.js`, sube la `?v=` en las cinco páginas.
