/* Zona Gemelos VIP · lo común a las cuatro landings de la comunidad (solo WhatsApp, sin producto).
   Lo que cambia de un lanzamiento a otro vive en CONFIG. */
var CONFIG = {
  anuncio: '2026-10-25T20:00:00+02:00',     // cuándo se anuncia dentro (cuenta atrás de la D)
  webhook: '/api/optin',                     // puente al CRM de Zona Gemelos (api/optin.js añade el token). Vacío = no envía nada
  gracias: 'gracias/'                        // cada variante tiene la suya: a/gracias/ … d/gracias/
};

(function () {
  var q = new URLSearchParams(location.search);
  // la primera página por la que entró (con sus UTM), de dónde venía y cuándo: el CRM calcula el tiempo en la página
  var ENTRADA = { landingPage: location.href, referrer: document.referrer, landingPageAt: new Date().toISOString() };
  try { var g = JSON.parse(sessionStorage.getItem('zg_entrada') || 'null'); if (g) ENTRADA = g; else sessionStorage.setItem('zg_entrada', JSON.stringify(ENTRADA)); } catch (x) {}
  if (q.get('publicar') === '1') document.body.classList.add('publicar');
  var variante = document.body.dataset.variante || '?';

  /* cuenta atrás al anuncio */
  var meta = new Date(CONFIG.anuncio).getTime();
  function pinta() {
    var s = Math.max(0, Math.floor((meta - Date.now()) / 1000));
    var v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    document.querySelectorAll('.reloj').forEach(function (r) {
      Object.keys(v).forEach(function (k) { var b = r.querySelector('[data-k="' + k + '"]'); if (b) b.textContent = String(v[k]).padStart(2, '0'); });
    });
  }
  if (document.querySelector('.reloj')) { pinta(); setInterval(pinta, 1000); }

  /* modal (variante A): el formulario sale al pulsar, como en MKT Hackers A */
  var modal = document.querySelector('.modal');
  document.querySelectorAll('[data-abre]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); modal.classList.add('abierto'); var c = modal.querySelector('input[type=tel]'); c && setTimeout(function () { c.focus(); }, 50); });
  });
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.classList.contains('cerrar')) modal.classList.remove('abierto'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('abierto'); });
  }

  /* botones que bajan al formulario (B, C, D) */
  document.querySelectorAll('[data-baja]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault(); var f = document.querySelector('.form'); f.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () { f.querySelector('input[type=tel]').focus({ preventScroll: true }); }, 450);
    });
  });

  /* vídeos de los casos: al arrancar uno se para el otro */
  var vids = document.querySelectorAll('.caso video');
  vids.forEach(function (v) {
    v.addEventListener('click', function () { if (v.paused) { vids.forEach(function (o) { if (o !== v) o.pause(); }); v.controls = true; v.play(); } });
  });

  /* formularios */
  var PREFIJOS = [['+34', '🇪🇸'], ['+52', '🇲🇽'], ['+54', '🇦🇷'], ['+57', '🇨🇴'], ['+56', '🇨🇱'], ['+51', '🇵🇪'], ['+593', '🇪🇨'], ['+58', '🇻🇪'],
    ['+598', '🇺🇾'], ['+595', '🇵🇾'], ['+591', '🇧🇴'], ['+506', '🇨🇷'], ['+507', '🇵🇦'], ['+502', '🇬🇹'], ['+503', '🇸🇻'], ['+504', '🇭🇳'],
    ['+505', '🇳🇮'], ['+1', '🇺🇸'], ['+44', '🇬🇧'], ['+33', '🇫🇷'], ['+49', '🇩🇪'], ['+39', '🇮🇹'], ['+351', '🇵🇹'], ['+41', '🇨🇭'], ['+376', '🇦🇩']];
  // solo WhatsApp (Alex, 04-10): no hay elección de canal

  document.querySelectorAll('form.form').forEach(function (form) {
    var sel = form.querySelector('select[name=prefijo]');
    PREFIJOS.forEach(function (p) { var o = document.createElement('option'); o.value = p[0]; o.textContent = p[0] + ' ' + p[1]; sel.appendChild(o); });
    // el prefijo por defecto, por la zona horaria (la lección del optin de agosto: sin prefijo, GHL tiraba el contacto)
    var tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
    var porZona = { 'America/Mexico_City': '+52', 'America/Argentina/Buenos_Aires': '+54', 'America/Bogota': '+57', 'America/Santiago': '+56',
      'America/Lima': '+51', 'America/Guayaquil': '+593', 'America/Caracas': '+58', 'America/Montevideo': '+598', 'America/Asuncion': '+595' };
    sel.value = porZona[tz] || '+34';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = form.querySelector('.error'); err.textContent = '';
      var nom = form.nombre ? form.nombre.value.trim() : '';
      if (form.nombre && nom.length < 2) { err.textContent = 'Pon tu nombre.'; form.nombre.focus(); return; }
      var tel = form.telefono.value.replace(/[^\d]/g, ''), mail = form.email.value.trim();
      if (tel.length < 7) { err.textContent = 'Revisa el teléfono: sin el prefijo, solo los números.'; form.telefono.focus(); return; }
      if (form.conoce && !form.conoce.value) { err.textContent = 'Dinos desde cuándo nos conoces.'; form.conoce.focus(); return; }
      if (form.dedica && !form.dedica.value) { err.textContent = 'Dinos a qué te dedicas hoy.'; form.dedica.focus(); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(mail)) { err.textContent = 'Ese email no parece válido.'; form.email.focus(); return; }
      var datos = {
        nombre: nom, conoce: form.conoce ? form.conoce.value : '', dedica: form.dedica ? form.dedica.value : '', telefono: form.prefijo.value + tel, email: mail, canal: 'whatsapp',
        variante: variante, landing: location.pathname, timezone: tz, cid: q.get('cid') || '',
        utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '', utm_campaign: q.get('utm_campaign') || '',
        utm_content: q.get('utm_content') || '', utm_term: q.get('utm_term') || '', enviado: new Date().toISOString()
      };
      // con los nombres del contrato del webhook de opt-in (WEBHOOK-OPTIN-PARA-JUANE.md): así cada dato cae en su campo del CRM
      datos.name = datos.nombre; datos.phone = datos.telefono;
      datos.reason = 'Comunidad · nos conoce: ' + (datos.conoce || '—') + ' · se dedica a: ' + (datos.dedica || '—');
      datos.utmSource = datos.utm_source; datos.utmMedium = datos.utm_medium; datos.utmCampaign = datos.utm_campaign;
      datos.utmContent = datos.utm_content; datos.utmTerm = datos.utm_term;
      datos.fbclid = q.get('fbclid') || ''; datos.gclid = q.get('gclid') || '';
      datos.landingPage = ENTRADA.landingPage; datos.referrer = ENTRADA.referrer; datos.landingPageAt = ENTRADA.landingPageAt;
      datos.submitPage = location.href; datos.submittedAt = datos.enviado;
      datos.language = navigator.language || ''; datos.platform = navigator.platform || '';
      datos.screenWidth = screen.width; datos.screenHeight = screen.height;
      var boton = form.querySelector('button[type=submit]'); boton.disabled = true; boton.style.opacity = .7;
      var sigue = function () { location.href = CONFIG.gracias + '?v=' + variante; };
      try { localStorage.setItem('zg_registro', JSON.stringify(datos)); } catch (x) {}
      if (!CONFIG.webhook) { console.log('[ZG] vista previa, no se envía:', datos); return sigue(); }
      fetch(CONFIG.webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos), keepalive: true })
        .then(sigue, sigue);
    });
  });
})();
