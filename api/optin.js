// Puente al CRM de Zona Gemelos (función de Vercel: POST /api/optin).
// El webhook de opt-in exige el token `x-core-token`, y el repo es público: el token NO puede ir en el navegador.
// La landing manda el formulario aquí; esto le añade el token (variable de entorno CORE_OPTIN_TOKEN en Vercel),
// la IP y el navegador, y lo reenvía tal cual a n8n → contacto + oportunidad en el CRM con sus UTM.
const WEBHOOK = 'https://n8n.alexgutierrxz.com/webhook/gemelos-optin';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Solo POST.' });
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body.clientIP = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  body.userAgent = req.headers['user-agent'] || '';
  body.origin = req.headers.origin || '';
  // Sin token se reenvía igual: n8n lo rechaza y avisa solo en 🧲│gemelos-optins, así un fallo de configuración no pasa en silencio.
  try {
    const r = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-core-token': process.env.CORE_OPTIN_TOKEN || '' },
      body: JSON.stringify(body)
    });
    res.status(r.status).setHeader('Content-Type', 'application/json');
    return res.send(await r.text());
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'No se pudo contactar con el CRM.' });
  }
};
