/* Zona Gemelos VIP · masterclass gratuita del martes 10-11-2026 a las 19:00 (hora de España).
   Lo común a /masterclass/, /masterclass/gracias/, /masterclass/pase/, /directo/ y /replay/.
   Lo que no está decidido va aquí con ⇢ pendiente (y en la página, con etiqueta amarilla que oculta ?publicar=1). */
var CONFIG = {
  masterclass: '2026-11-10T19:00:00+01:00',   // martes 10 de noviembre, 19:00 hora de España (CET)
  duracionMin: 120,                            // ⇢ pendiente: duración del directo (para el calendario)
  qa: '2026-11-12T19:00:00+01:00',             // jueves 12: directo de Q&A (⇢ pendiente: hora)
  cierre: '2026-11-17T23:59:59+01:00',         // martes 17 de noviembre: cierre de plazas (a medianoche)
  webhook: '/api/optin',                       // puente al CRM (api/optin.js añade el token). Vacío = no envía nada
  reason: 'masterclass_10nov',
  gracias: '/masterclass/gracias/',
  comunidad: 'https://go.wha.link/zonagemelos',  // comunidad de WhatsApp (Funnelchat, campaña 27070)
  directo: '',          // ⇢ pendiente: plataforma del directo. Id de YouTube Live (11 caracteres), URL de Vimeo o enlace de Zoom
  replay: '',           // ⇢ pendiente: id de YouTube / URL de Vimeo de la grabación
  ofertaVisible: false, // la oferta de la sala se enseña cuando los Gemelos abran plazas (o con ?oferta=1)
  pago: '',             // ⇢ pendiente: pasarela (enlace de pago)
  agenda: ''            // ⇢ pendiente: herramienta de agenda (Calendly / Cal.com)
};

(function () {
  var q = new URLSearchParams(location.search);
  if (q.get('publicar') === '1') document.body.classList.add('publicar');
  if (q.get('captura') === '1') document.body.classList.add('captura');  // capturas: todo visible sin esperar al scroll
  // ?ahora=2026-11-10T19:05 para probar los estados de la sala y las cuentas atrás
  var desfase = 0;
  if (q.get('ahora')) { var f = new Date(q.get('ahora')); if (!isNaN(f)) desfase = f.getTime() - Date.now(); }
  window.ZG_AHORA = function () { return Date.now() + desfase; };

  /* la entrada (primera página, con sus UTM) se conserva en toda la visita */
  var CLAVES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'cid'];
  var ENTRADA;
  try { ENTRADA = JSON.parse(sessionStorage.getItem('zg_mc_entrada') || 'null'); } catch (x) {}
  if (!ENTRADA || CLAVES.some(function (k) { return q.get(k); })) {
    ENTRADA = { landingPage: location.href, referrer: document.referrer, landingPageAt: new Date().toISOString(), utm: {} };
    CLAVES.forEach(function (k) { if (q.get(k)) ENTRADA.utm[k] = q.get(k); });
    try { sessionStorage.setItem('zg_mc_entrada', JSON.stringify(ENTRADA)); } catch (x) {}
  }
  window.ZG_UTM = function (url) {
    var u = new URL(url, location.href);
    Object.keys(ENTRADA.utm || {}).forEach(function (k) { if (!u.searchParams.get(k)) u.searchParams.set(k, ENTRADA.utm[k]); });
    return u.toString();
  };
  // enlaces internos y a la comunidad: pasan los UTM
  document.querySelectorAll('a[data-utm]').forEach(function (a) { a.href = ZG_UTM(a.getAttribute('href')); });
  document.querySelectorAll('a[data-comunidad]').forEach(function (a) { a.href = ZG_UTM(CONFIG.comunidad); a.target = '_blank'; a.rel = 'noopener'; });

  /* cuentas atrás: <div class="reloj" data-hasta="masterclass|cierre|ISO"> */
  var relojes = document.querySelectorAll('.reloj');
  function pinta() {
    relojes.forEach(function (r) {
      var h = r.dataset.hasta || 'masterclass', meta = new Date(CONFIG[h] || h).getTime();
      var s = Math.max(0, Math.floor((meta - ZG_AHORA()) / 1000));
      var v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
      Object.keys(v).forEach(function (k) { var b = r.querySelector('[data-k="' + k + '"]'); if (b) b.textContent = String(v[k]).padStart(2, '0'); });
    });
  }
  if (relojes.length) { pinta(); setInterval(pinta, 1000); }

  /* aparecer al hacer scroll */
  var rv = document.querySelectorAll('.rv, .marcador');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* barra fija en móvil: aparece cuando el botón del hero sale de pantalla */
  var fija = document.querySelector('.fija'), heroBtn = document.querySelector('.hero [data-abre]');
  if (fija && heroBtn && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { fija.classList.toggle('ver', !es[0].isIntersecting); }).observe(heroBtn);
  }

  /* modal con el formulario */
  var modal = document.querySelector('.modal');
  function abre(e) { if (e) e.preventDefault(); modal.classList.add('abierto'); var c = modal.querySelector('input[name=nombre]'); c && setTimeout(function () { c.focus(); }, 60); }
  document.querySelectorAll('[data-abre]').forEach(function (b) { b.addEventListener('click', abre); });
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.classList.contains('cerrar')) modal.classList.remove('abierto'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('abierto'); });
    if (location.hash === '#registro') abre();
  }


  /* calendario: Google + .ics generado en el navegador */
  var ini = new Date(CONFIG.masterclass), fin = new Date(ini.getTime() + CONFIG.duracionMin * 60000);
  var sala = location.origin + '/directo/';
  var z = function (d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
  var TIT = 'Masterclass gratuita de Los Gemelos · Zona Gemelos VIP';
  var DESC = 'El modelo de negocio con el que nos hicimos millonarios sin enseñar la cara y hoy en día aplicando IA. Sala: ' + sala;
  document.querySelectorAll('[data-cal=google]').forEach(function (a) {
    a.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(TIT) + '&dates=' + z(ini) + '/' + z(fin) +
      '&details=' + encodeURIComponent(DESC) + '&location=' + encodeURIComponent(sala);
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-cal=ics]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Zona Gemelos VIP//Masterclass//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
        'UID:masterclass-20261110@zonagemelosvip', 'DTSTAMP:' + z(new Date()), 'DTSTART:' + z(ini), 'DTEND:' + z(fin),
        'SUMMARY:' + TIT, 'DESCRIPTION:' + DESC, 'LOCATION:' + sala, 'URL:' + sala,
        'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:La masterclass empieza en 1 hora', 'END:VALARM',
        'BEGIN:VALARM', 'TRIGGER:-PT10M', 'ACTION:DISPLAY', 'DESCRIPTION:Empezamos en 10 minutos', 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      var l = document.createElement('a'); l.href = url; l.download = 'masterclass-los-gemelos-10-nov.ics'; document.body.appendChild(l); l.click(); l.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    });
  });

  /* datos del registro (para gracias y pase) */
  var REG = {};
  try { REG = JSON.parse(localStorage.getItem('zg_mc_registro') || '{}') || {}; } catch (x) {}
  var nombre = (q.get('nombre') || REG.nombre || '').trim();
  document.querySelectorAll('[data-nombre]').forEach(function (el) { if (nombre) el.textContent = nombre; });
  document.querySelectorAll('[data-saludo]').forEach(function (el) { if (nombre) el.textContent = nombre.split(' ')[0] + ', tu'; });
  var cod = 'ZG-1011-' + ((REG.email || nombre || 'invitado').split('').reduce(function (a, c) { return (a * 31 + c.charCodeAt(0)) >>> 0; }, 7) % 100000).toString().padStart(5, '0');
  document.querySelectorAll('[data-codigo]').forEach(function (el) { el.textContent = cod; });

  /* descargar el pase como imagen (canvas, sin librerías) */
  document.querySelectorAll('[data-descarga]').forEach(function (b) {
    b.addEventListener('click', function () {
      var W = 1080, H = 1500, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
      var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1a160f'); g.addColorStop(.45, '#0b0a07'); g.addColorStop(1, '#000');
      x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      var r = 64; x.beginPath(); x.moveTo(r + 40, 40); x.arcTo(W - 40, 40, W - 40, H - 40, r); x.arcTo(W - 40, H - 40, 40, H - 40, r); x.arcTo(40, H - 40, 40, 40, r); x.arcTo(40, 40, W - 40, 40, r); x.closePath();
      x.fillStyle = g; x.fill(); x.lineWidth = 3; x.strokeStyle = '#8C724C'; x.stroke();
      var rg = x.createRadialGradient(W / 2, 40, 0, W / 2, 40, 700); rg.addColorStop(0, 'rgba(199,179,141,.28)'); rg.addColorStop(1, 'rgba(199,179,141,0)'); x.fillStyle = rg; x.fill();
      var f = function (w, s) { return w + ' ' + s + 'px Geist, system-ui, sans-serif'; };
      x.textAlign = 'center';
      x.fillStyle = '#C7B38D'; x.font = f(700, 30); x.fillText('M A S T E R C L A S S   G R A T U I T A', W / 2, 330);
      x.fillStyle = '#F4F1EA'; x.font = f(900, 84); x.fillText('El negocio del que', W / 2, 450); x.fillText('nadie habla', W / 2, 545);
      x.fillStyle = '#a7a197'; x.font = f(500, 36); x.fillText('Zona Gemelos VIP · Carlos y Daniel', W / 2, 620);
      x.setLineDash([18, 14]); x.strokeStyle = 'rgba(199,179,141,.35)'; x.lineWidth = 3; x.beginPath(); x.moveTo(110, 720); x.lineTo(W - 110, 720); x.stroke(); x.setLineDash([]);
      x.textAlign = 'left';
      var etq = function (t, v, X, Y, s) { x.fillStyle = '#a7a197'; x.font = f(700, 26); x.fillText(t.split('').join(' '), X, Y); x.fillStyle = '#F4F1EA'; x.font = f(800, s); x.fillText(v, X, Y + s + 14); };
      etq('ASISTENTE', nombre || 'Tu nombre', 120, 810, 64);
      etq('FECHA', 'Martes 10 nov', 120, 1010, 50); etq('HORA', '19:00 (España)', 600, 1010, 50);
      etq('SALA', location.host + '/directo', 120, 1180, 40);
      x.fillStyle = '#C7B38D'; x.font = '600 30px ui-monospace, Menlo, monospace'; x.fillText(cod, 120, 1380);
      var fin2 = function () { var l = document.createElement('a'); l.download = 'pase-masterclass-los-gemelos.png'; l.href = c.toDataURL('image/png'); document.body.appendChild(l); l.click(); l.remove(); };
      var im = new Image(); im.onload = function () { x.drawImage(im, W / 2 - 75, 110, 150, 150); fin2(); }; im.onerror = fin2; im.src = '/assets/media/g.png';
    });
  });


  /* reproductor: id de YouTube (11), URL de Vimeo, enlace de Zoom u otra URL */
  function monta(el, src) {
    if (!el) return;
    if (!src) return;  // se queda el hueco «⇢ pendiente»
    var v = el.querySelector('.vacio');
    if (/^[\w-]{11}$/.test(src)) { el.insertAdjacentHTML('beforeend', '<iframe src="https://www.youtube.com/embed/' + src + '?autoplay=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>'); v && v.remove(); return; }
    var m = src.match(/vimeo\.com\/(?:event\/)?(\d+)/);
    if (m) { el.insertAdjacentHTML('beforeend', '<iframe src="https://player.vimeo.com/video/' + m[1] + '?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'); v && v.remove(); return; }
    if (v) v.innerHTML = '<div class="play"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></div><a class="btn btn-gold" target="_blank" rel="noopener" href="' + src + '">Entrar al directo →</a>';
  }
  var esSala = document.body.classList.contains('sala'), esReplay = document.body.classList.contains('replay');
  if (esSala) {
    var tick = function () {
      var vivo = ZG_AHORA() >= new Date(CONFIG.masterclass).getTime();
      document.body.classList.toggle('es-vivo', vivo); document.body.classList.toggle('es-espera', !vivo);
      if (vivo && !tick.hecho) { tick.hecho = true; monta(document.querySelector('.player[data-src=directo]'), CONFIG.directo); }
    };
    tick(); setInterval(tick, 1000);
  }
  if (esReplay) monta(document.querySelector('.player[data-src=replay]'), CONFIG.replay);
  if (CONFIG.ofertaVisible || q.get('oferta') === '1' || esReplay) document.body.classList.add('con-oferta');

  /* botones de pago y agenda: si no hay enlace, se quedan con su etiqueta ⇢ pendiente */
  [['pago', '[data-pago]'], ['agenda', '[data-agenda]']].forEach(function (p) {
    document.querySelectorAll(p[1]).forEach(function (a) {
      if (CONFIG[p[0]]) { a.href = ZG_UTM(CONFIG[p[0]]); a.target = '_blank'; a.rel = 'noopener'; var t = a.parentNode.querySelector('.pend[data-de="' + p[0] + '"]'); t && t.remove(); }
      else a.addEventListener('click', function (e) { e.preventDefault(); });
    });
  });

  /* formulario → /api/optin (mismo contrato que assets/zg.js) */
  var PREFIJOS = [['+34', '🇪🇸'], ['+52', '🇲🇽'], ['+54', '🇦🇷'], ['+57', '🇨🇴'], ['+56', '🇨🇱'], ['+51', '🇵🇪'], ['+593', '🇪🇨'], ['+58', '🇻🇪'],
    ['+598', '🇺🇾'], ['+595', '🇵🇾'], ['+591', '🇧🇴'], ['+506', '🇨🇷'], ['+507', '🇵🇦'], ['+502', '🇬🇹'], ['+503', '🇸🇻'], ['+504', '🇭🇳'],
    ['+505', '🇳🇮'], ['+1', '🇺🇸'], ['+44', '🇬🇧'], ['+33', '🇫🇷'], ['+49', '🇩🇪'], ['+39', '🇮🇹'], ['+351', '🇵🇹'], ['+41', '🇨🇭'], ['+376', '🇦🇩']];
  var tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  document.querySelectorAll('form.form').forEach(function (form) {
    var sel = form.querySelector('select[name=prefijo]');
    PREFIJOS.forEach(function (p) { var o = document.createElement('option'); o.value = p[0]; o.textContent = p[1] + ' ' + p[0]; sel.appendChild(o); });
    var porZona = { 'America/Mexico_City': '+52', 'America/Argentina/Buenos_Aires': '+54', 'America/Bogota': '+57', 'America/Santiago': '+56',
      'America/Lima': '+51', 'America/Guayaquil': '+593', 'America/Caracas': '+58', 'America/Montevideo': '+598', 'America/Asuncion': '+595' };
    sel.value = porZona[tz] || '+34';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = form.querySelector('.error'); err.textContent = '';
      var nom = form.nombre.value.trim(), tel = form.telefono.value.replace(/[^\d]/g, ''), mail = form.email.value.trim();
      if (nom.length < 2) { err.textContent = 'Pon tu nombre.'; form.nombre.focus(); return; }
      if (tel.length < 7) { err.textContent = 'Revisa el teléfono: sin el prefijo, solo los números.'; form.telefono.focus(); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(mail)) { err.textContent = 'Ese email no parece válido.'; form.email.focus(); return; }
      var u = ENTRADA.utm || {}, ahora = new Date().toISOString();
      var datos = {
        nombre: nom, telefono: form.prefijo.value + tel, email: mail, canal: 'whatsapp', fuente: CONFIG.reason,
        variante: 'masterclass', landing: location.pathname, timezone: tz, cid: u.cid || '',
        utm_source: u.utm_source || '', utm_medium: u.utm_medium || '', utm_campaign: u.utm_campaign || '', utm_content: u.utm_content || '', utm_term: u.utm_term || '',
        enviado: ahora
      };
      // nombres del contrato del webhook de opt-in (WEBHOOK-OPTIN-PARA-JUANE.md)
      datos.name = nom; datos.phone = datos.telefono; datos.reason = CONFIG.reason;
      datos.utmSource = datos.utm_source; datos.utmMedium = datos.utm_medium; datos.utmCampaign = datos.utm_campaign;
      datos.utmContent = datos.utm_content; datos.utmTerm = datos.utm_term; datos.fbclid = u.fbclid || ''; datos.gclid = u.gclid || '';
      datos.landingPage = ENTRADA.landingPage; datos.referrer = ENTRADA.referrer; datos.landingPageAt = ENTRADA.landingPageAt;
      datos.submitPage = location.href; datos.submittedAt = ahora;
      datos.language = navigator.language || ''; datos.platform = navigator.platform || ''; datos.screenWidth = screen.width; datos.screenHeight = screen.height;
      var boton = form.querySelector('button[type=submit]'); boton.disabled = true; boton.querySelector('span').textContent = 'Reservando tu plaza…';
      try { localStorage.setItem('zg_mc_registro', JSON.stringify({ nombre: nom, email: mail, telefono: datos.telefono, enviado: ahora })); } catch (x) {}
      var sigue = function () { location.href = ZG_UTM(CONFIG.gracias); };
      if (!CONFIG.webhook) { console.log('[ZG] vista previa, no se envía:', datos); return sigue(); }
      var t = setTimeout(sigue, 4000);  // si el CRM tarda, no dejamos a nadie esperando
      fetch(CONFIG.webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos), keepalive: true })
        .then(function () { clearTimeout(t); sigue(); }, function () { clearTimeout(t); sigue(); });
    });
  });
})();
