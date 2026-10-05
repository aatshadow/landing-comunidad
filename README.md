# Landing de la comunidad · Zona Gemelos VIP

Web estática, sin build: se sirve tal cual desde la raíz.

| Ruta | Qué es |
|---|---|
| `/` (`index.html`) | La landing. «Entrar en la comunidad» abre el formulario en un pop-up: nombre · prefijo + teléfono · email · «¿Desde cuándo nos conoces?» · «¿A qué te dedicas hoy?» |
| `/gracias/` | Después de enviar: botón a la comunidad de WhatsApp → `https://go.wha.link/zonagemelos` (campaña de Funnelchat) |
| `assets/` | `zg.css` (estilos), `zg.js` (formulario), logo |

## Conectar el formulario
En `assets/zg.js` → `CONFIG.webhook`. **Vacío = no envía nada** (solo guarda en el navegador y salta a gracias).
Envía un POST JSON con: `nombre, telefono, email, conoce, dedica, canal, variante, landing, timezone, cid,
utm_source, utm_medium, utm_campaign, utm_content, utm_term, enviado`.

Los UTM salen del link con el que llega la persona (p. ej. `/?utm_source=youtube&utm_content=<vídeo>`).
