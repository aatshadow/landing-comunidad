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
