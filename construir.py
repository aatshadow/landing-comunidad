#!/usr/bin/env python3
"""Zona Gemelos VIP · genera las cuatro landings (a/ b/ c/ d/), sus páginas de gracias y el índice de vista previa.
    python3 construir.py

Qué es esta landing (Alex, 04-10): SOLO coge los datos y mete a la gente en la comunidad de WhatsApp, donde se va a anunciar
algo. No vende ni comenta el producto, no habla de negocio, ni casos, ni capturas, ni testimonios. Solo WhatsApp.
Cada variante calca la ESTRUCTURA de una referencia (MKT Hackers A/B/D · Iman Gadzhi); el copy es siempre el mismo mensaje."""
from pathlib import Path

R = Path(__file__).parent
VIDEOS = False  # Alex, 05-10: sin vídeos en las landings «hasta próximo aviso» (vídeo de la C, de las gracias y la E entera)
P = lambda t: f'<span class="pend">⇢ {t}</span>'   # pendiente: visible en la vista previa, oculto con ?publicar=1

HEAD = lambda titulo, v, extra='': f'''<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{titulo}</title><meta name="description" content="Zona Gemelos VIP · comunidad gratuita de WhatsApp.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/zg.css"><link rel="icon" href="../assets/media/g.png">{extra}</head>
<body data-variante="{v}">'''

LOGO = '<header class="top"><div class="logo"><img src="../assets/media/g.png" alt="">Zona Gemelos VIP</div></header>'
FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 17 17 7M8 7h9v9"/></svg>'

BADGE = '<div class="badge"><span class="punto"></span>Comunidad gratuita de WhatsApp<span class="sep"></span>Se anuncia el 25 de octubre</div>'
H1 = '<h1>Algo grande llega en noviembre. <em>Solo lo vamos a anunciar dentro.</em></h1>'
SUB = ('<p class="sub">Entra gratis en la comunidad de WhatsApp de <b>Zona Gemelos VIP</b>. Ahí contamos lo que no sale en nuestras '
       'redes, y ahí vamos a anunciar algo muy top: <b>primero dentro</b>.</p>')
CHIPS = '<div class="chips"><span>Gratis</span><span>Por WhatsApp</span><span>Te sales cuando quieras</span></div>'
BOTON_TXT = 'Entrar gratis en la comunidad'


def FORM(titulo=True):
    t = '<p class="form-titulo">Entra en la comunidad de WhatsApp</p>' if titulo else ''
    return f'''<form class="form" novalidate>{t}
  <input class="campo" type="text" name="nombre" placeholder="Tu nombre" autocomplete="given-name" aria-label="Nombre">
  <div class="fila"><select class="campo" name="prefijo" aria-label="Prefijo"></select>
  <input class="campo" type="tel" name="telefono" placeholder="Número SIN el prefijo" autocomplete="tel-national" inputmode="tel" aria-label="Teléfono"></div>
  <input class="campo" type="email" name="email" placeholder="Pon un mail y confirma que no eres un bot" autocomplete="email" aria-label="Email">
  <select class="campo" name="conoce" aria-label="¿Desde cuándo nos conoces?"><option value="" selected disabled>¿Desde cuándo nos conoces?</option><option>Os acabo de conocer</option><option>Menos de 6 meses</option><option>Entre 6 meses y 1 año</option><option>Más de 1 año</option><option>Desde el principio</option></select>
  <select class="campo" name="dedica" aria-label="¿A qué te dedicas hoy?"><option value="" selected disabled>¿A qué te dedicas hoy?</option><option>Trabajo por cuenta ajena</option><option>Autónomo o tengo un negocio</option><option>Estudio</option><option>Estoy buscando trabajo</option><option>Otra cosa</option></select>
  <div class="error" role="alert"></div>
  <button class="btn ancho" type="submit">{BOTON_TXT} {FLECHA}</button>
  <p class="pie-form">Gratis y sin spam. Al registrarte aceptas la <a href="https://zonagemelosvip.com" target="_blank" rel="noopener">política de privacidad</a>.</p>
</form>'''


def CTA(modo):  # 'abre' = popup con el formulario (A) · 'baja' = lleva al formulario (B, C)
    return f'<a href="#" class="btn" data-{modo}>{BOTON_TXT} {FLECHA}</a>'


BANDA = lambda modo: f'<div class="wrap" style="text-align:center;padding:4px 0 56px">{CTA(modo)}</div>'

DENTRO = '''<section><div class="wrap">
  <p class="kicker">Qué hay dentro</p><h2>Dentro, <em>antes que nadie</em></h2>
  <p class="lead">Es gratis. Lo único que te pedimos es que actives las notificaciones.</p>
  <div class="rejilla tres">
    <div class="card"><div class="n">01</div><h3>Los anuncios, primero aquí</h3><p>Lo que vamos a anunciar sale antes en la comunidad que en ningún otro sitio.</p></div>
    <div class="card"><div class="n">02</div><h3>Lo que no sale en nuestras redes</h3><p>Lo que no publicamos en YouTube ni en Instagram, lo contamos dentro.</p></div>
    <div class="card"><div class="n">03</div><h3>Sin ruido</h3><p>Solo escribimos nosotros: pocos mensajes y los que importan.</p></div>
  </div>
</div></section>'''

GEMELOS = f'''<section><div class="wrap"><div class="autor">
  <div class="foto">Foto de los Gemelos<br>{P('pedir foto en vertical')}</div>
  <div><p class="kicker" style="text-align:left">Quiénes somos</p><h2 style="text-align:left">Somos <em>los Gemelos</em></h2>
  <p class="sub" style="margin:0">Lo que no contamos en nuestras redes, lo contamos en la comunidad. Y lo próximo que anunciemos, sale ahí primero.</p></div>
</div></div></section>'''

FAQ = '''<section><div class="wrap estrecho">
  <p class="kicker">Preguntas</p><h2>Antes de que <em>lo preguntes</em></h2>
  <div class="rejilla">
    <div class="card"><h3>¿Cuesta algo?</h3><p>No. La comunidad es gratis.</p></div>
    <div class="card"><h3>¿Qué voy a recibir?</h3><p>Los anuncios antes que nadie y lo que no sale en nuestras redes.</p></div>
    <div class="card"><h3>¿Cuántos mensajes?</h3><p>Pocos. Solo escribimos nosotros.</p></div>
    <div class="card"><h3>¿Me puedo salir?</h3><p>Cuando quieras, con un toque.</p></div>
  </div>
</div></section>'''

FICHA = '''<div class="ficha"><div><small>Precio</small><strong>Gratis</strong></div><div><small>Dónde</small><strong>WhatsApp</strong></div>
  <div><small>El anuncio</small><strong>25 de octubre</strong></div><div><small>Salir</small><strong>Cuando quieras</strong></div></div>'''

RELOJ = '<div class="reloj"><div><b data-k="d">00</b><small>días</small></div><div><b data-k="h">00</b><small>horas</small></div><div><b data-k="m">00</b><small>min</small></div><div><b data-k="s">00</b><small>seg</small></div></div>'

PIE = '''<footer><div class="wrap">Zona Gemelos VIP © 2026 · <a href="https://zonagemelosvip.com" target="_blank" rel="noopener">Aviso legal</a>·<a href="https://zonagemelosvip.com" target="_blank" rel="noopener">Privacidad</a>·<a href="https://zonagemelosvip.com" target="_blank" rel="noopener">Cookies</a></div></footer>
<script src="../assets/zg.js"></script></body></html>'''

# ───────────────────────── A · LARGA (estructura de MKT Hackers A: botón → popup, bloques, botón entre bloques) ─────────────────────────
A = HEAD('Zona Gemelos VIP · A', 'A') + LOGO + f'''
<main><div class="wrap hero">{BADGE}{H1}{SUB}<div style="margin-top:30px">{CTA('abre')}</div>{CHIPS}</div>
{DENTRO}{BANDA('abre')}<div class="raya"></div>{GEMELOS}{BANDA('abre')}{FAQ}
<section style="padding-top:20px"><div class="wrap hero">{BADGE}{H1}<div style="margin-top:26px">{CTA('abre')}</div></div></section></main>
<div class="modal" role="dialog" aria-modal="true"><div class="caja"><button class="cerrar" aria-label="Cerrar">×</button>
  <p class="kicker">Comunidad gratuita</p>{FORM()}</div></div>
<div class="fijo-movil si">{CTA('abre').replace('class="btn"', 'class="btn ancho"')}</div>''' + PIE

# ───────────────────────── B · FORMULARIO ARRIBA (estructura de MKT Hackers B) ─────────────────────────
B = HEAD('Zona Gemelos VIP · B', 'B') + LOGO + f'''
<main><div class="wrap hero">{BADGE}{H1}{SUB}
  <div class="card" style="max-width:560px;margin:30px auto 0;padding:22px">{FORM(False)}</div></div>
<section style="padding-top:40px"><div class="wrap">{FICHA}</div></section>
{DENTRO}{BANDA('baja')}<div class="raya"></div>{GEMELOS}{BANDA('baja')}</main>''' + PIE

# ───────────────────────── C · VÍDEO ARRIBA (estructura de Iman Gadzhi · AI Income Challenge) ─────────────────────────
PORTADA_C = '''  <div class="portada" style="margin-top:14px"><div class="play"><svg viewBox="0 0 24 24" fill="#1A140A"><path d="M6 4l14 8-14 8z"/></svg></div>
    <div class="rotulo">' + P('vídeo de 30-60 s de los dos Gemelos a cámara: «algo grande llega, solo lo anunciamos dentro, entra» (por grabar)') + '</div></div>'''
C = HEAD('Zona Gemelos VIP · C', 'C', '<style>.portada{position:relative;aspect-ratio:16/9;border-radius:22px;overflow:hidden;border:1px solid var(--linea-2);background:radial-gradient(circle at 30% 20%,rgba(199,179,141,.22),transparent 55%),#0B0A08;display:grid;place-items:center}.portada .play{width:84px;height:84px;border-radius:50%;background:var(--champan);display:grid;place-items:center;box-shadow:0 0 0 12px rgba(199,179,141,.15)}.portada .play svg{width:30px;height:30px;margin-left:5px}.portada .rotulo{position:absolute;left:18px;bottom:16px;right:18px;text-align:left}.c-grid{display:grid;gap:28px;align-items:center;padding:20px 0 10px}@media(min-width:900px){.c-grid{grid-template-columns:1.15fr .85fr}.c-grid .hero{text-align:left}.c-grid .chips{justify-content:flex-start}.c-grid h1{font-size:clamp(30px,3.6vw,46px);margin-left:0}.c-grid .sub{margin:0}}</style>') + LOGO + f'''
<main><div class="wrap">
{PORTADA_C if VIDEOS else ''}
  <div class="c-grid"><div class="hero" style="padding:0">{BADGE}{H1}{SUB}{CHIPS}</div>
    <div class="card" style="padding:22px">{FORM()}</div></div>
</div>
{DENTRO}{BANDA('baja')}</main>''' + PIE

# D = la que se publica (Pere, 04-10). Solo «entra en la comunidad»: nada del producto, ni relleno.
BADGE_D = '<div class="badge"><span class="punto"></span>Comunidad gratuita de WhatsApp</div>'
H1_D = '<h1>Estamos preparando <b>lo más grande</b> que hemos hecho. <em>Entérate el primero.</em></h1>'  # titular 5 de 10 (Alex, 04-10)
SUB_D = '<p class="sub">Entra gratis en la comunidad de WhatsApp de <b>Zona Gemelos VIP</b>.</p>'

# ───────────────────────── D · EXPRÉS (estructura de MKT Hackers D) ─────────────────────────
D_CSS = '''<style>
body[data-variante=D] .top{padding:18px 0 6px}
body[data-variante=D] .hero{padding:8px 0 28px}
body[data-variante=D] .badge{font-size:11px;padding:7px 14px}
body[data-variante=D] h1{font-weight:400;text-transform:none;letter-spacing:-.01em;line-height:1.18;font-size:clamp(24px,6.2vw,36px);margin:16px auto 12px;max-width:640px}
body[data-variante=D] h1 b,body[data-variante=D] h1 em{font-weight:800}
body[data-variante=D] .sub{font-size:15px;max-width:520px}
body[data-variante=D] .tarjeta-d{max-width:460px;margin:20px auto 0;padding:0;overflow:hidden;text-align:left}
body[data-variante=D] .banda{background:linear-gradient(90deg,#7A1F1F,var(--rojo));color:#fff;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:12px;padding:10px;text-align:center}
body[data-variante=D] .tarjeta-d .dentro{padding:18px 16px 16px;display:grid;gap:14px}
body[data-variante=D] .form{gap:10px}
body[data-variante=D] .campo{padding:13px 12px}
body[data-variante=D] .form-titulo{text-transform:none;letter-spacing:0;font-weight:600;font-size:19px;margin-bottom:2px}
body[data-variante=D] .reloj{gap:6px;align-items:baseline}
body[data-variante=D] .reloj div{min-width:0;background:none;border:0;padding:0;display:flex;align-items:baseline;gap:2px}
body[data-variante=D] .reloj b{font-size:24px}
body[data-variante=D] .reloj small{font-size:11px;letter-spacing:0;text-transform:none}
body[data-variante=D] .cuenta{text-align:center;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.14em;color:var(--gris-2);text-transform:uppercase;margin-bottom:-6px}
@media(min-width:900px){
body[data-variante=D] .hero{padding:24px 0 48px}
body[data-variante=D] .badge{font-size:12px}
body[data-variante=D] h1{font-size:50px;max-width:820px;margin:22px auto 16px}
body[data-variante=D] .sub{font-size:18px;max-width:640px}
body[data-variante=D] .tarjeta-d{max-width:540px;margin-top:28px}
body[data-variante=D] .banda{font-size:13px;padding:12px}
body[data-variante=D] .tarjeta-d .dentro{padding:24px 24px 20px}
body[data-variante=D] .form-titulo{font-size:21px}
body[data-variante=D] .campo{padding:15px 14px}
body[data-variante=D] .reloj b{font-size:28px}
}
</style>'''
RELOJ_D = '<div class="reloj"><div><b data-k="d">00</b><small>d</small></div><div><b data-k="h">00</b><small>h</small></div><div><b data-k="m">00</b><small>m</small></div><div><b data-k="s">00</b><small>s</small></div></div>'
D = HEAD('Zona Gemelos VIP · D', 'D', D_CSS) + LOGO + f'''
<main><div class="wrap hero">{BADGE_D}{H1_D}{SUB_D}
  <div class="card tarjeta-d"><div class="banda">🔒 Solo se anuncia dentro</div>
    <div class="dentro">{FORM()}<p class="cuenta">Lo anunciamos en</p>{RELOJ_D}</div></div>
</div></main>''' + PIE


# ───────────────────────── E · PUENTE CON VÍDEO (Alex, 05-10) ─────────────────────────
# La primera redirección a la comunidad: SIN formulario. Al entrar se abre el vídeo de los Gemelos en un pop-up y debajo
# el botón va directo al link de la campaña de Funnelchat (que reparte entre comunidades y filtra bots).
COMUNIDAD = 'https://go.wha.link/zonagemelos'
E_CSS = '''<style>
body[data-variante=E] .hero{padding:10px 0 40px}
body[data-variante=E] h1{font-size:clamp(30px,6vw,56px)}
.ve{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;
  background:rgba(0,0,0,.84);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity .35s}
.ve.abierto{opacity:1;pointer-events:auto}
.ve .caja{width:100%;max-width:420px;max-height:calc(100dvh - 32px);display:flex;flex-direction:column;gap:14px;
  transform:translateY(18px) scale(.97);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.ve.abierto .caja{transform:none}
.ve .marco{position:relative;aspect-ratio:9/16;max-height:calc(100dvh - 190px);margin:0 auto;width:100%;border-radius:20px;overflow:hidden;
  border:1px solid var(--linea-2);background:radial-gradient(circle at 30% 20%,rgba(199,179,141,.22),transparent 55%),#0B0A08;
  box-shadow:0 30px 90px -20px rgba(199,179,141,.35)}
.ve video,.ve iframe{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border:0}
.ve .vacio{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:24px;color:var(--gris-2);
  font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.ve .sonido{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;border:0;cursor:pointer;
  background:rgba(0,0,0,.6);color:#fff;font:600 13px 'Geist',sans-serif;padding:10px 16px;border-radius:999px;backdrop-filter:blur(4px);white-space:nowrap}
.ve .sonido svg{width:16px;height:16px}
.ve .cerrar{position:absolute;top:-6px;right:-4px;width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.7);border:1px solid var(--linea-2);
  color:var(--blanco);font-size:22px;z-index:2}
.ve .directo{position:absolute;top:14px;left:14px;display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.55);border-radius:999px;
  padding:6px 12px;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--champan)}
.ve .btn{animation:llama 2.4s ease-in-out infinite}
.ve.fin .btn{animation:llama .9s ease-in-out infinite}
@keyframes llama{0%,100%{box-shadow:0 10px 40px -10px rgba(199,179,141,.55)}50%{box-shadow:0 10px 50px -4px rgba(199,179,141,.95)}}
.otra{background:none;border:0;color:var(--gris);font:500 14px 'Geist',sans-serif;text-decoration:underline;cursor:pointer;margin-top:16px}
</style>'''
ALTAVOZ = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>'
E_JS = '''<script>
/* El vídeo: VIDEO = ruta a un .mp4 vertical (p. ej. 'video.mp4' en esta carpeta) o el id de YouTube (11 caracteres). */
var VIDEO = '';  // ⇢ PENDIENTE: vídeo de los Gemelos
var COMUNIDAD = '%s';
(function () {
  var ve = document.querySelector('.ve'), marco = ve.querySelector('.marco'), q = location.search;
  document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = COMUNIDAD + q; });  // los UTM viajan al link
  var abre = function () { ve.classList.add('abierto'); }, cierra = function () { ve.classList.remove('abierto'); var v = marco.querySelector('video'); v && v.pause(); };
  if (/^[\\w-]{11}$/.test(VIDEO)) {
    marco.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + VIDEO + '?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
  } else if (VIDEO) {
    marco.innerHTML = '<video src="' + VIDEO + '" autoplay muted playsinline preload="auto"></video><span class="directo"><span class="punto"></span>Mensaje de los Gemelos</span>'
      + '<button class="sonido" type="button">%s Toca para activar el sonido</button>';
    var v = marco.querySelector('video'), s = marco.querySelector('.sonido');
    s.addEventListener('click', function () { v.muted = false; v.currentTime = 0; v.play(); s.remove(); });
    v.addEventListener('ended', function () { ve.classList.add('fin'); });
  }
  setTimeout(abre, 350);  // de entrada: el vídeo sale solo, en pop-up
  ve.addEventListener('click', function (e) { if (e.target === ve || e.target.classList.contains('cerrar')) cierra(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cierra(); });
  document.querySelector('.otra').addEventListener('click', function () { abre(); var v = marco.querySelector('video'); v && v.play(); });
})();
</script>''' % (COMUNIDAD, ALTAVOZ)
BOTON_WA = f'<a class="btn ancho" data-wa href="{COMUNIDAD}">Entrar en la comunidad {FLECHA}</a>'
E = HEAD('Zona Gemelos VIP · Nueva comunidad', 'E', E_CSS) + LOGO + f'''
<main><div class="wrap hero estrecho">
  <div class="badge"><span class="punto"></span>Comunidad gratuita de WhatsApp</div>
  <h1>Los Gemelos hemos creado una <em>nueva comunidad</em></h1>
  <p class="sub">Vamos a lanzar algo <b>súper grande</b> a finales de octubre, y lo contamos primero ahí dentro. No te lo pierdas.</p>
  <div style="max-width:460px;margin:30px auto 0">{BOTON_WA}</div>
  {CHIPS}
  <button class="otra" type="button">Volver a ver el vídeo</button>
</div></main>
<div class="ve" role="dialog" aria-modal="true" aria-label="Vídeo de los Gemelos"><div class="caja">
  <div style="position:relative"><button class="cerrar" aria-label="Cerrar">×</button>
    <div class="marco"><div class="vacio">Vídeo de los Gemelos (vertical, 20-40 s)<br><br>{P('por grabar: ver guion en el README')}</div></div></div>
  {BOTON_WA}
</div></div>''' + E_JS + PIE


# ───────────────────────── GRACIAS (una por variante: a/gracias/ … d/gracias/) ─────────────────────────
# Cada variante tiene la suya para que el píxel y la analítica cuenten el registro por variante (como MKT Hackers).
# Su único trabajo: que el registrado ENTRE en la comunidad. Sin ese clic no le llega nada.
VIDEO_GRACIAS = '<div class="foto" style="aspect-ratio:16/9;margin-top:36px">Vídeo de 30 s de los Gemelos: «entra y activa las notificaciones»<br>' + P('por grabar') + '</div>'


def GRACIAS(v):
    return (HEAD(f'Zona Gemelos VIP · Último paso ({v})', f'{v}-gracias') + LOGO + f'''
<main><div class="wrap hero estrecho">
  <div class="badge"><span class="punto"></span>Registro hecho · te falta un paso</div>
  <h1>Te falta <em>un paso</em></h1>
  <p class="sub">Entra ahora en la comunidad de WhatsApp: es ahí donde lo anunciamos todo. <b>Sin este paso no te llega nada.</b></p>
  <div style="margin-top:28px;max-width:460px;margin-left:auto;margin-right:auto"><a class="btn ancho" id="ir-wa" href="#">Entrar en la comunidad de WhatsApp {FLECHA}</a></div>
  <div class="rejilla tres" style="margin-top:40px;text-align:left">
    <div class="card"><div class="n">01</div><h3>Entra en la comunidad</h3><p>Con el botón de arriba. Tarda cinco segundos.</p></div>
    <div class="card"><div class="n">02</div><h3>Activa las notificaciones</h3><p>Lo importante solo se anuncia dentro, y una vez.</p></div>
    <div class="card"><div class="n">03</div><h3>Guarda nuestro número</h3><p>Así te llegan los mensajes y no se pierden.</p></div>
  </div>
{VIDEO_GRACIAS if VIDEOS else ''}
</div></main>
<script>
var WHATSAPP = '{COMUNIDAD}';  // campaña de Funnelchat «Zona Gemelos VIP» (reparte entre comunidades, anti-bots)
document.getElementById('ir-wa').href = WHATSAPP;
// aquí van el evento Lead del píxel y el de analítica, con la variante: {v}
</script>''' + PIE).replace('../assets/', '../../assets/')


# ───────────────────────── ÍNDICE DE VISTA PREVIA ─────────────────────────
VARS = [('a', 'A · Larga', 'MKT Hackers A', 'Botón que abre el formulario en un popup, qué hay dentro, quiénes somos, preguntas, y un botón entre cada bloque. Para tráfico frío (descripción de YouTube).'),
        ('b', 'B · Formulario arriba', 'MKT Hackers B', 'El formulario en la primera pantalla, ficha (gratis · WhatsApp · 25 de octubre), qué hay dentro y quiénes somos. Para tráfico mixto.'),
        ('c', 'C · Vídeo arriba' if VIDEOS else 'C · Titular + formulario', 'Iman Gadzhi · AI Income Challenge', ('Vídeo de los Gemelos a lo ancho, titular' if VIDEOS else 'Sin vídeo de momento: titular') + ' y formulario al lado, qué hay dentro. Para quien llega desde un vídeo.'),
        ('d', 'D · Exprés', 'MKT Hackers D', 'Una sola pantalla: titular, cuenta atrás al anuncio y formulario. Para tráfico caliente (base, stories, ManyChat).')] + ([
        ('e', 'E · Puente con vídeo (en la recámara)', 'redirección directa', 'Guardada para más adelante. Sin formulario: al entrar sale el vídeo de los Gemelos en un pop-up y el botón lleva directo a go.wha.link/zonagemelos. Para la primera redirección.')] if VIDEOS else [])
I = '''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Zona Gemelos VIP · Landings A B C D E</title><link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;800;900&family=Geist+Mono&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/zg.css"><link rel="icon" href="assets/media/g.png"></head><body>
<header class="top"><div class="logo"><img src="assets/media/g.png" alt="">Zona Gemelos VIP</div></header>
<main><div class="wrap"><div class="hero"><p class="kicker">Vista previa · A/B/C/D + puente E</p><h1 style="font-size:clamp(30px,5vw,52px)">Landings de la <em>comunidad</em></h1>
<p class="sub">Un solo mensaje en las cuatro: entra en la comunidad de WhatsApp, dentro anunciamos algo. Sin producto. Cambia solo la estructura.</p></div>
<div class="rejilla dos" style="margin-top:34px">''' + ''.join(f'''<div class="card"><div class="n">{t}</div><h3>Estructura de: {ref}</h3><p>{d}</p>
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><a class="btn" style="padding:12px 16px;font-size:12px" href="{k}/">Ver landing</a>
''' + ('' if k == 'e' else f'<a class="btn" style="padding:12px 16px;font-size:12px;background:transparent;color:var(--champan);border:1px solid var(--linea-2);box-shadow:none" href="{k}/gracias/">Su página de gracias</a>') + '</div></div>' for k, t, ref, d in VARS) + '''</div>
<p class="aviso" style="margin-top:30px">Las etiquetas amarillas ⇢ marcan lo que falta (foto, vídeos, enlace de WhatsApp). Se ocultan con <b>?publicar=1</b>. Sin <code>webhook</code> en <code>assets/zg.js</code> el formulario no envía nada: guarda en el navegador y salta a la página de gracias.</p>
</div></main></body></html>'''

for ruta, html in [('a/index.html', A), ('b/index.html', B), ('c/index.html', C), ('d/index.html', D), ('index.html', I)] + ([('e/index.html', E)] if VIDEOS else []) + [(f'{v}/gracias/index.html', GRACIAS(v.upper())) for v in 'abcd']:
    (R / ruta).parent.mkdir(parents=True, exist_ok=True)
    (R / ruta).write_text(html, encoding='utf-8')
    print('✓', ruta, f'{len(html) / 1024:.1f} KB')
