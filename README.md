# Landings de la comunidad · Zona Gemelos VIP (04-10-2026)

**Qué son (Alex, 04-10):** solo cogen los datos y meten a la gente en la **comunidad de WhatsApp**, donde se va a anunciar algo.
**No venden ni comentan el producto, no hablan de negocio**: nada de casos, capturas, testimonios, cifras, afiliados ni píldoras.
**Solo WhatsApp.** Mensaje único: «Algo grande llega en noviembre. Solo lo vamos a anunciar dentro.»

| Variante | Estructura de | Qué tiene | Tráfico |
|---|---|---|---|
| `a/` · Larga | MKT Hackers optin-a | botón → formulario en popup · qué hay dentro · quiénes somos · preguntas · botón entre cada bloque | frío (YouTube) |
| `b/` · Formulario arriba | MKT Hackers optin-b | formulario en el hero · ficha (gratis · WhatsApp · 25 oct · salir) · qué hay dentro · quiénes somos | mixto |
| `c/` · Vídeo arriba | Iman Gadzhi · AI Income Challenge | vídeo de los Gemelos · titular + formulario al lado · qué hay dentro | quien llega de un vídeo |
| `d/` · Exprés | MKT Hackers optin-d | una pantalla: titular · cuenta atrás al anuncio · formulario (Alex: «perfecta») | caliente |

| `e/` · Puente con vídeo (05-10) | redirección directa | **sin formulario**: al entrar se abre el vídeo de los Gemelos en pop-up · botón directo a `go.wha.link/zonagemelos` (campaña de Funnelchat, pasa los UTM) | primera redirección a la comunidad |

**E · el vídeo:** `VIDEO` en el `<script>` de E dentro de `construir.py` — ruta a un `.mp4` vertical en `e/` o el id de YouTube.
Arranca en silencio (los navegadores no dejan autoplay con sonido) con «Toca para activar el sonido»; al acabar, el botón late más.
Guion (Alex, 05-10), 20-40 s, vertical, los dos a cámara: *«Los Gemelos hemos creado una nueva comunidad. Vamos a lanzar algo
súper grande a finales de octubre: no te lo pierdas. Haz clic en el link de abajo y entra.»*

**Cada variante (A-D) tiene su página de gracias** (`a/gracias/` … `d/gracias/`) para medir el registro por variante: «Te falta un paso» +
un botón a la comunidad de WhatsApp.

## Vista previa
`python3 -m http.server 5620 --bind 127.0.0.1` desde esta carpeta → http://127.0.0.1:5620/

## Cómo se edita
Todo el HTML sale de `construir.py` → `python3 construir.py`. Fecha del anuncio y webhook en `assets/zg.js` (`CONFIG`);
enlace de WhatsApp en `WHATSAPP` de las páginas de gracias.

## Formulario
Prefijo (por defecto según la zona horaria) + teléfono · email («confirma que no eres un bot»). Envía teléfono, email, variante,
landing, timezone, `cid` (id de contacto de ManyChat, nunca datos personales en la URL) y los UTM.
**Sin `webhook` no envía nada**: guarda en el navegador y salta a la página de gracias.

## Pendiente antes de publicar (etiquetas amarillas ⇢; `?publicar=1` las oculta)
Foto de los Gemelos · vídeo de C (30-60 s) y de gracias (30 s) · enlace de la comunidad de WhatsApp · webhook (n8n →
ActiveCampaign + ManyChat) · píxel por página de gracias · aviso legal propio · dominio.
