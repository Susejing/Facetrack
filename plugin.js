// FaceTrack — Facebook en Kino · github.com/Susejing/Facetrack
// Copyright (C) 2026 Susejing
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// FaceTrack 0.1.5 — Facebook en Kino: vídeos públicos, nada más.
//
// Novedades de la 0.1.5 (la caza mayor): el cuarto informe clavó la
// verdad — la cara que abre la puerta entrega la página del reel VACÍA
// de vídeo (445 mil letras sin un solo enlace de MP4, cero bloques JS,
// sin muro de sesión). Facebook reparte a veces la casa vacía según la
// cara. LA CAZA MAYOR: cuando una página abre pero viene sin señal de
// vídeo (marcaVideo: playable_url / browser_native / progressive por
// cualquier rincón), se sube la escalera DESDE ABAJO — navegador,
// galletas, simple, móviles — y solo se acepta la cara que entregue la
// página CON vídeo; la cara ganadora queda recordada. La usan la
// búsqueda (en la dirección final del enlace) y el reproductor (en cada
// dirección de vídeo). Y el detective 2.0: el informe "debug" ahora
// prueba en vivo el enlace, el REEL DIRECTO con todas las caras y la
// puerta trasera TAHOE — una sola captura dice qué cara (si alguna)
// trae el vídeo.
//
// Novedades de la 0.1.4 (el tercer informe: la puerta se abre pero la
// casa viene vacía): la escalera funcionó y la página del reel bajó
// entera, PERO con cero MP4 adentro — Facebook le entrega a veces una
// versión VACÍA de la página a la cara que abre. Tres trucos nuevos:
// (1) LOS BLOQUES JS: además de los data-sjs, se cazan los bloques
// handleServerJS / bigPipe.onPageletArrive / s.handle (con claves sin
// comillas y comillas simples, convertidas a JSON) — ahí vive el
// VideoConfig con los MP4 cuando el data-sjs viene vacío (el mismo
// respaldo que usa el extractor de yt-dlp); (2) LA SEGUNDA VUELTA: si
// una página abre pero trae el vídeo vacío, se vuelve a abrir empezando
// la escalera desde abajo (navegador, galletas...) — otra cara puede
// entregar la página buena; (3) LA PUERTA TRASERA: al reproducir se
// prueba también la dirección antigua video/tahoe/async/<id>, que
// contesta en JSON cuando las páginas de vídeo vienen vacías. El
// informe "debug" ahora cuenta los bloques js y dice si el enlace del
// vídeo (playable_url) anda suelto por el HTML crudo.
//
// Novedades de la 0.1.3 (el segundo informe del teléfono encontró al
// culpable): la escalera de la 0.1.2 funcionó — una cara pasó y la página
// del vídeo bajó entera (445 mil caracteres) — pero "vídeos: 0": la página
// era un REEL, y en los reels el vídeo vive en un nodo interior que llega
// SIN su número de identificación (lo lleva el nodo papá). El cazador
// viejo exigía ese número y tiraba el vídeo a la basura. Ahora: (1) el
// caminador PRESTA la cédula del papá al vídeo sin id (y si tampoco hay
// papá con cédula, inventa una a partir del enlace del MP4); (2) el
// respaldo a ojo en el HTML crudo también busca las marcas doble-escapadas
// (\"playable_url\"); (3) al reproducir un id se prueban también las
// direcciones de reel (www./reel/<id> y m./reel/<id>): los reels no siempre
// responden en video.php.
//
// Novedades de la 0.1.2 (el informe del teléfono dijo la verdad): al
// abrir el enlace compartido, Facebook respondió "HTTP 400": rechazo en
// la puerta, ni siquiera muro de sesión. Suele ser la CARA con que uno
// se presenta (los encabezados del navegador) o la galleta que falta.
// Ahora toda petición a Facebook sube por una ESCALERA de caras: la de
// Chrome (como antes), la de Chrome con una galleta de bienvenida
// (se visita primero la raíz de Facebook para que le den la galleta),
// la simple sin encabezados propios, y las versiones móviles (m.). El
// peldaño que funciona queda RECORDADO, y la próxima petición entra
// directo por él. El informe "debug" muestra la escalera completa con
// lo que respondió cada peldaño.
//
// Novedades de la 0.1.1 (primeras pruebas del teléfono): el Inicio sin
// páginas guardadas ya no lanza error (Kino muestra su aviso propio de
// "sin catálogos"); los enlaces se abren con margen dentro del presupuesto
// del buscador; si la página del enlace compartido no trae el vídeo, se
// rescata el id de la dirección final a la que redirige; el caminador del
// JSON lleva tope de profundidad (los árboles de Facebook son profundos);
// y "debug" hace una prueba EN VIVO del último enlace pegado, paso a
// paso, para saber qué le respondió Facebook al teléfono.
//
// Cómo funciona: Facebook entrega sus vídeos públicos como MP4 directo
// escondidos en la página, dentro de bloques JSON <script data-sjs>
// (el mismo que usa su web). Los enlaces de calidad alta están en
// browser_native_hd_url y los ligeros en browser_native_sd_url, con
// respaldo en playable_url y en el repartidor nuevo (progressive_urls).
// Esos enlaces van FIRMADOS y CADUCAN al rato: por eso se resuelven al
// momento de dar play, como hace TubeKino con YouTube.
//
// Qué trae la 0.1.0:
//  • Pega un enlace de Facebook en el buscador de Kino (fb.watch,
//    /watch/?v=, /videos/, /reel/, /share/v/...) y el vídeo sale directo.
//  • Escribe el nombre de una página (lo que va tras facebook.com/) y
//    salen sus vídeos.
//  • En Ajustes guardas hasta 6 páginas tuyas y cada una es una fila
//    del Inicio.
//
// Honestidad: Facebook cambia sus tripas cada cierto tiempo (los nombres
// de los campos ya cambiaron una vez); si un día un vídeo no sale, el
// plugin avisa con un mensaje claro en vez de quedarse mudo. La búsqueda
// general de Facebook pide iniciar sesión: por ahora se buscan enlaces
// pegados y páginas por nombre; el modo con tu cuenta (tu algoritmo, lo
// que sueles ver) llegará después con la ventanita de sesión.
//
// Truco de descarga: los MP4 de Facebook limitan la velocidad cuando se
// piden con el navegador normal; el reproductor los pide presentándose
// como "facebookexternalhit/1.1" (el rastreador de vistas previas del
// propio Facebook), que no está limitado.

const VERSION = "0.1.5";

// La cara con la que se piden las páginas (un Chrome de escritorio).
const UA_PAGINA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
// La cara con la que el reproductor pide los MP4 (sin límite de velocidad).
const UA_VIDEO = "facebookexternalhit/1.1";

// Diagnóstico de la última jugada (se ve buscando "debug").
let trazaBusqueda = "";
let trazaHome = "";
let trazaResolve = "";
let trazaError = "";

// Caché de los vídeos de cada página pedida (30 min): el Inicio y el
// "Ver más" de una misma fila no gastan dos descargas iguales.
var cachePag = {};

// ---------- pedir páginas: la escalera contra el HTTP 400 ----------

// La cara de Chrome con la que se presentan las peticiones.
const ENCABEZADOS = {
  "User-Agent": UA_PAGINA,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "es-ES,es;q=0.9,es-419;q=0.8,en;q=0.7"
};

// Una petición sola, con o sin cara propia.
async function pedirSimple(url, tope, tiempoMs, conEncabezados) {
  const opciones = { timeoutMs: tiempoMs || 9000, maxBytes: tope || 1200000 };
  if (conEncabezados) opciones.headers = ENCABEZADOS;
  const r = await kino.fetch(url, opciones);
  if (!r.ok) throw kino.error("unavailable", "HTTP " + r.status + " en " + url.slice(0, 90));
  return r;
}

// La dirección móvil equivalente (a veces responde donde www dice que no).
function versionMovil(url) {
  return String(url).replace("://www.facebook.com/", "://m.facebook.com/");
}

// Abre una página de Facebook subiendo por la escalera de caras hasta que
// una deje pasar. Devuelve { r, traza }: r es null si ninguna pudo, y la
// traza dice qué respondió cada peldaño (se ve en "debug"). Con
// reiniciar=true se ignora la cara recordada y se empieza desde abajo:
// a veces una cara abre la puerta pero entrega una página VACÍA (sin
// vídeo), y otra cara entrega la página buena.
async function abrirFacebook(url, tope, tiempoMs, sinMovil, reiniciar) {
  let via = "";
  try { via = reiniciar ? "" : String(kino.storage.get("fbVia") || ""); } catch (e) { /* sin almacén */ }
  const todas = [
    { nombre: "navegador", enc: true, calentar: false, movil: false },
    { nombre: "galletas", enc: true, calentar: true, movil: false },
    { nombre: "simple", enc: false, calentar: false, movil: false },
    { nombre: "m.navegador", enc: true, calentar: false, movil: true },
    { nombre: "m.simple", enc: false, calentar: false, movil: true }
  ];
  const variantes = [];
  for (let i = 0; i < todas.length; i++) {
    if (todas[i].movil && sinMovil) continue;
    if (todas[i].nombre === via && !reiniciar) variantes.unshift(todas[i]);
    else variantes.push(todas[i]);
  }
  const traza = [];
  for (let i = 0; i < variantes.length; i++) {
    const v = variantes[i];
    const destino = v.movil ? versionMovil(url) : url;
    try {
      if (v.calentar) {
        // La galleta de bienvenida: visitar la raíz para que le den una
        // galleta a la jarra antes de pedir el vídeo.
        try { await pedirSimple("https://www.facebook.com/", 20000, 5000, true); } catch (e) { /* la que se pueda */ }
      }
      const r = await pedirSimple(destino, tope, tiempoMs, v.enc);
      traza.push(v.nombre + ":" + r.status);
      if (r.ok) {
        try { kino.storage.set("fbVia", v.nombre); } catch (e) { /* sin almacén */ }
        return { r: r, traza: traza };
      }
    } catch (e) {
      const m = /HTTP (\d+)/.exec(String(e && e.message ? e.message : String(e)));
      traza.push(v.nombre + ":" + (m ? m[1] : "x"));
    }
  }
  return { r: null, traza: traza };
}

// ¿El HTML crudo trae señal de vídeo? (algún enlace de MP4 por cualquier
// rincón: playable_url, browser_native, progressive)
function marcaVideo(html) {
  return typeof html === "string" && (
    html.indexOf("playable_url") >= 0 ||
    html.indexOf("browser_native_hd_url") >= 0 ||
    html.indexOf("browser_native_sd_url") >= 0 ||
    html.indexOf("progressive_url") >= 0);
}

// LA CAZA MAYOR: sube la escalera DESDE ABAJO (navegador, galletas,
// simple, móviles) y solo acepta una página que traiga señal de vídeo —
// una cara puede abrir la puerta y entregar la casa VACÍA; la caza sigue
// subiendo hasta la cara que entregue la casa buena. La cara que gana
// queda recordada (fbVia) para las siguientes. Devuelve
// { ok, cara, texto, traza }: ok=false si ninguna cara trajo vídeo.
async function cazarConVideo(url, tope, tiempoMs, traza) {
  const todas = [
    { nombre: "navegador", enc: true, calentar: false, movil: false },
    { nombre: "galletas", enc: true, calentar: true, movil: false },
    { nombre: "simple", enc: false, calentar: false, movil: false },
    { nombre: "m.navegador", enc: true, calentar: false, movil: true },
    { nombre: "m.simple", enc: false, calentar: false, movil: true }
  ];
  for (let i = 0; i < todas.length; i++) {
    const v = todas[i];
    const destino = v.movil ? versionMovil(url) : url;
    try {
      if (v.calentar) {
        try { await pedirSimple("https://www.facebook.com/", 20000, 5000, true); } catch (e) { /* la que se pueda */ }
      }
      const r = await pedirSimple(destino, tope, tiempoMs, v.enc);
      const texto = r.text();
      traza.push(v.nombre + ":" + r.status);
      if (r.ok && marcaVideo(texto)) {
        try { kino.storage.set("fbVia", v.nombre); } catch (e) { /* sin almacén */ }
        return { ok: true, cara: v.nombre, texto: texto, traza: traza };
      }
    } catch (e) {
      const m = /HTTP (\d+)/.exec(String(e && e.message ? e.message : String(e)));
      traza.push(v.nombre + ":" + (m ? m[1] : "x"));
    }
  }
  return { ok: false, traza: traza };
}

// La puerta trasera tahoe contesta "for (;;);{...}": se pela el prefijo
// y se viste de bloque data-sjs para que el cazador lo lea igual.
function pelarTahoe(url, texto) {
  if (String(url).indexOf("/tahoe/") < 0) return texto;
  const pos = texto.indexOf("{");
  if (pos > 0) return '<script type="application/json" data-sjs>' + texto.slice(pos) + "</script>";
  return texto;
}

// Quita el escape de un pedazo de cadena tal como viene en el JSON
// (https:\/\/, \u0025...). Si no se puede, al menos se desenreda lo común.
function soltar(s) {
  if (!s) return "";
  try { return JSON.parse('"' + s + '"'); } catch (e) { /* abajo */ }
  return String(s)
    .replace(/\\\//g, "/")
    .replace(/\\u([0-9a-fA-F]{4})/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); });
}

// ---------- cazar vídeos en la página ----------

// Los bloques <script data-sjs>{...}</script> de Facebook: ahí vive el
// JSON con los vídeos (la misma ruta que sigue el extractor de yt-dlp,
// la referencia viva de Facebook).
function bloquesSjs(html) {
  const fuera = [];
  const rx = /<script[^>]*\bdata-sjs\b[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = rx.exec(html)) !== null) {
    const cuerpo = m[1].trim();
    if (cuerpo.length < 2 || cuerpo.charAt(0) !== "{") continue;
    try { fuera.push(JSON.parse(cuerpo)); } catch (e) { /* bloque roto: al siguiente */ }
  }
  return fuera;
}

// La llave que cierra la que abre en la posición ini: cuenta la profundidad
// y respeta las cadenas (para no confundirse con llaves dentro de textos).
function cierreDe(s, ini) {
  let prof = 0;
  let enCadena = "";
  for (let i = ini; i < s.length; i++) {
    const ch = s.charAt(i);
    if (enCadena) {
      if (ch === "\\") { i++; continue; }
      if (ch === enCadena) enCadena = "";
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { enCadena = ch; continue; }
    if (ch === "{") prof++;
    else if (ch === "}") {
      prof--;
      if (prof === 0) return i;
    }
  }
  return -1;
}

// Un objeto JS (con claves sin comillas, comillas simples...) convertido a
// JSON. Si no se deja, devuelve null.
function jsonDeJs(s) {
  try { return JSON.parse(s); } catch (e) { /* a convertir */ }
  let t = String(s);
  t = t.replace(/'(?:[^'\\\n]|\\.)*'/g, function (x) { return '"' + x.slice(1, -1).replace(/"/g, '\\"') + '"'; });
  t = t.replace(/([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)(\s*:)/g, '$1"$2"$3');
  t = t.replace(/,\s*([}\]])/g, "$1");
  try { return JSON.parse(t); } catch (e) { return null; }
}

// Los bloques JS que NO son data-sjs: handleServerJS, bigPipe.onPageletArrive
// y s.handle. Ahí vive el VideoConfig con los MP4 cuando la página viene
// "vacía" (el mismo respaldo que usa el extractor de yt-dlp).
function bloquesJs(html) {
  const fuera = [];
  const marcas = [
    /handleServerJS\s*\(\s*\{/g,
    /bigPipe\.onPageletArrive\s*\(\s*\{/g,
    /\bs\.handle\s*\(\s*\{/g
  ];
  for (let m = 0; m < marcas.length; m++) {
    marcas[m].lastIndex = 0;
    let hit;
    while ((hit = marcas[m].exec(html)) !== null) {
      const ini = html.indexOf("{", hit.index + hit[0].length - 1);
      if (ini < 0) break;
      const fin = cierreDe(html, ini);
      if (fin < 0 || fin - ini > 2000000) break;
      const obj = jsonDeJs(html.slice(ini, fin + 1));
      if (obj) fuera.push(obj);
      marcas[m].lastIndex = fin;
    }
  }
  return fuera;
}

// ¿Es este objeto un vídeo de Facebook?
function esVideo(n) {
  if (!n || typeof n !== "object" || Array.isArray(n)) return false;
  if (n.__typename === "Video") return true;
  // Algunas páginas traen el vídeo sin la etiqueta, pero con enlaces.
  // LOS REELS llegan así y SIN id: el id lo lleva el nodo papá, y el
  // caminador se lo presta — no se vuelve a exigir aquí.
  if (n.browser_native_hd_url || n.browser_native_sd_url || n.playable_url || n.progressive_urls) return true;
  return false;
}

// Camina el JSON en busca de vídeos (con tope de nodos y de profundidad:
// los árboles de Facebook son hondos, pero no hay vídeo a más de 200 pisos).
// ctxId es la cédula del nodo papá. ctxVideo es el vídeo papá SIN enlaces
// (el caso del reel): cuando un hijo suyo trae los enlaces, se los sube
// con la cédula del vídeo, no la de cualquier nodo del camino.
function caminar(nodo, fuera, cuenta, profundidad, ctxId, ctxVideo) {
  if (!nodo || typeof nodo !== "object" || cuenta.n > 250000) return;
  if (profundidad > 200) return;
  cuenta.n = cuenta.n + 1;
  if (Array.isArray(nodo)) {
    for (let i = 0; i < nodo.length; i++) caminar(nodo[i], fuera, cuenta, profundidad + 1, ctxId, ctxVideo);
    return;
  }
  let miId = "";
  if (typeof nodo.id === "string" || typeof nodo.id === "number") miId = String(nodo.id);
  if (!miId && (typeof nodo.videoId === "string" || typeof nodo.videoId === "number")) miId = String(nodo.videoId);
  let videoPapa = ctxVideo;
  if (esVideo(nodo)) {
    const u = urlsDeVideo(nodo);
    if (u.hd || u.sd) {
      if (ctxVideo) {
        // El vídeo del reel: el hijo trae los enlaces, el papá la cédula
        // y el título. Se hereda del papá lo que falte.
        nodo.__id = ctxVideo.__id || miId || ctxId || "";
        for (const k in ctxVideo) {
          if (k.charAt(0) === "_") continue;
          if (ctxVideo[k] !== undefined && ctxVideo[k] !== null &&
              (nodo[k] === undefined || nodo[k] === null)) nodo[k] = ctxVideo[k];
        }
      } else {
        nodo.__id = miId || ctxId || "";
      }
      fuera.push(nodo);
      videoPapa = null;
    } else {
      // Vídeo sin enlaces propios: sus hijos con enlaces le pertenecen.
      nodo.__id = miId || ctxId || "";
      fuera.push(nodo);
      videoPapa = nodo;
    }
  }
  for (const k in nodo) caminar(nodo[k], fuera, cuenta, profundidad + 1, miId || ctxId, videoPapa);
}

// Todos los vídeos de una página, sin repetir id. Si el mismo id aparece
// en dos nodos (el reel: el papá con la cédula, el hijo con los enlaces),
// gana el que trae los enlaces, heredando del otro lo que le falte.
// Se caminan los bloques data-sjs Y los bloques JS (handleServerJS y
// compañía), donde vive el VideoConfig cuando el data-sjs viene vacío.
function videosDeHtml(html) {
  const nodos = [];
  const cuenta = { n: 0 };
  const bloques = bloquesSjs(html).concat(bloquesJs(html));
  for (let i = 0; i < bloques.length; i++) caminar(bloques[i], nodos, cuenta, 0, "");
  const porId = {};
  const orden = [];
  for (let i = 0; i < nodos.length; i++) {
    let id = String(nodos[i].id || nodos[i].videoId || nodos[i].__id || "");
    const u = urlsDeVideo(nodos[i]);
    if (!id) {
      // Ni cédula propia ni prestada: se inventa una a partir del MP4,
      // solo para no repetir el mismo vídeo en la lista.
      const base = u.hd || u.sd || "";
      id = base ? "fb" + hashDe(base).slice(0, 12) : "";
    }
    if (!id) continue;
    if (!porId[id]) {
      porId[id] = { nodo: nodos[i], urls: u };
      orden.push(id);
    } else {
      const prev = porId[id];
      if ((!prev.urls.hd && !prev.urls.sd) && (u.hd || u.sd)) {
        const nuevo = nodos[i];
        for (const k in prev.nodo) {
          if (k.charAt(0) === "_") continue;
          if (prev.nodo[k] !== undefined && prev.nodo[k] !== null &&
              (nuevo[k] === undefined || nuevo[k] === null)) nuevo[k] = prev.nodo[k];
        }
        prev.nodo = nuevo;
        prev.urls = u;
      }
    }
  }
  const fuera = [];
  for (let i = 0; i < orden.length; i++) {
    const e = porId[orden[i]];
    e.nodo.__id = orden[i];
    fuera.push(e.nodo);
  }
  return fuera;
}

// Respaldo plano: si el JSON no se dejó leer, los enlaces también se
// encuentran a ojo en el HTML crudo. Las marcas a veces vienen
// doble-escapadas (\"playable_url\"): se des-escapa y se caza otra vez.
function urlsCrudas(html) {
  const fuera = { hd: "", sd: "" };
  const cazas = [html];
  try {
    cazas.push(html
      .replace(/\\"/g, '"')
      .replace(/\\\\u([0-9a-fA-F]{4})/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); }));
  } catch (e) { /* se caza sobre el original */ }
  for (let c = 0; c < cazas.length; c++) {
    const rx = /"(browser_native_hd_url|browser_native_sd_url|playable_url_quality_hd|playable_url)":"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = rx.exec(cazas[c])) !== null) {
      const u = soltar(m[2]);
      if (!u || u.indexOf("http") !== 0) continue;
      if (/\.mpd(\?|$)/i.test(u) || /\.m3u8(\?|$)/i.test(u)) continue;
      if (m[1] === "browser_native_hd_url" || m[1] === "playable_url_quality_hd") {
        if (!fuera.hd) fuera.hd = u;
      } else {
        if (!fuera.sd) fuera.sd = u;
      }
    }
  }
  return fuera;
}

// Los enlaces de un vídeo, en orden de calidad: el repartidor viejo
// (browser_native_* / playable_url) y el nuevo (progressive_urls).
function urlsDeVideo(v) {
  if (!v || typeof v !== "object") return { hd: "", sd: "" };
  const campo = function (k) {
    if (typeof v[k] === "string" && v[k]) return v[k];
    const legado = v.videoDeliveryLegacyFields;
    if (legado && typeof legado[k] === "string" && legado[k]) return legado[k];
    return "";
  };
  let hd = campo("browser_native_hd_url") || campo("playable_url_quality_hd");
  let sd = campo("browser_native_sd_url") || campo("playable_url");
  const frag = v.videoDeliveryResponseFragment && v.videoDeliveryResponseFragment.videoDeliveryResponseResult;
  const prog = frag && Array.isArray(frag.progressive_urls) ? frag.progressive_urls : [];
  for (let i = 0; i < prog.length; i++) {
    const p = prog[i] || {};
    const u = typeof p.progressive_url === "string" ? p.progressive_url : "";
    if (!u || u.indexOf("http") !== 0 || /\.mpd(\?|$)/i.test(u) || /\.m3u8(\?|$)/i.test(u)) continue;
    const cal = (p.metadata && typeof p.metadata.quality === "string" ? p.metadata.quality : "").toUpperCase();
    if (cal.indexOf("HD") >= 0 || cal.indexOf("1080") >= 0 || cal.indexOf("720") >= 0) {
      if (!hd) hd = u;
    } else {
      if (!sd) sd = u;
    }
  }
  if (hd && /\.mpd(\?|$)/i.test(hd)) hd = "";
  if (sd && /\.mpd(\?|$)/i.test(sd)) sd = "";
  return { hd: hd, sd: sd };
}

// ---------- datos bonitos de un vídeo ----------

function textoDe(x) {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (typeof x.text === "string") return x.text;
  return "";
}

function tituloDe(v) {
  const cs = v.creation_story;
  const caminos = [
    v.name,
    v.savable_description,
    cs && cs.comet_sections && cs.comet_sections.message && cs.comet_sections.message.story && cs.comet_sections.message.story.message,
    v.message,
    cs && cs.message
  ];
  for (let i = 0; i < caminos.length; i++) {
    const t = textoDe(caminos[i]).trim();
    if (t) return t;
  }
  return "";
}

function duenoDe(v) {
  const cs = v.creation_story;
  const sfvc = cs && cs.short_form_video_context && cs.short_form_video_context.video_owner;
  return textoDe(v.owner && v.owner.name) || textoDe(sfvc && sfvc.name);
}

function posterDe(v) {
  const c1 = v.thumbnailImage && v.thumbnailImage.uri;
  const c2 = v.preferred_thumbnail && v.preferred_thumbnail.image && v.preferred_thumbnail.image.uri;
  if (typeof c1 === "string" && c1) return c1;
  if (typeof c2 === "string" && c2) return c2;
  return "";
}

function haceTexto(segundos) {
  if (!segundos || segundos <= 0) return "";
  const paso = Math.floor(Date.now() / 1000) - segundos;
  if (paso < 0) return "";
  if (paso < 3600) return "hace " + Math.max(1, Math.floor(paso / 60)) + " min";
  if (paso < 86400) return "hace " + Math.floor(paso / 3600) + " h";
  if (paso < 2592000) return "hace " + Math.floor(paso / 86400) + " días";
  return "hace " + Math.floor(paso / 2592000) + " meses";
}

// Un nodo de vídeo convertido en tarjeta de Kino.
function itemDeVideo(v, nombrePagina, posterRespaldo) {
  const id = String(v.id || v.videoId || v.__id || "");
  if (!id) return null;
  const urls = urlsDeVideo(v);
  // Sin enlaces solo se acepta si el nodo es un Video de verdad:
  // al reproducir se vuelve a pedir la página de todas formas.
  if (!urls.hd && !urls.sd && v.__typename !== "Video") return null;
  const titulo = tituloDe(v).trim();
  const dueno = (duenoDe(v) || nombrePagina || "").trim();
  const item = {
    id: "fbv." + id,
    ref: "v:" + id,
    title: (titulo || "Video de Facebook").slice(0, 140),
    kind: "movie"
  };
  const poster = posterDe(v) || posterRespaldo || "";
  if (poster) item.poster = poster;
  if (dueno) item.originalTitle = dueno.slice(0, 120);
  const partes = [];
  if (dueno) partes.push("Página: " + dueno);
  const hace = haceTexto(typeof v.creation_time === "number" ? v.creation_time : 0);
  if (hace) partes.push(hace);
  const desc = textoDe(v.savable_description).trim();
  if (desc && desc !== titulo) partes.push(desc);
  if (partes.length) item.overview = partes.join(" · ").slice(0, 300);
  const ms = typeof v.playable_duration_in_ms === "number" ? v.playable_duration_in_ms : 0;
  if (ms >= 60000) item.runtimeMinutes = Math.min(1000, Math.round(ms / 60000));
  if (typeof v.creation_time === "number" && v.creation_time > 0) {
    item.year = new Date(v.creation_time * 1000).getUTCFullYear();
  }
  return item;
}

// ---------- meta etiquetas (respaldo) ----------

function metaOg(html, propiedad) {
  const rx1 = new RegExp('<meta[^>]+property=["\']' + propiedad + '["\'][^>]+content=["\']([^"\']*)["\']', "i");
  const m1 = rx1.exec(html);
  if (m1) return soltar(m1[1]);
  const rx2 = new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]+property=["\']' + propiedad + '["\']', "i");
  const m2 = rx2.exec(html);
  return m2 ? soltar(m2[1]) : "";
}

// ---------- enlaces pegados ----------

// ¿Es esto un enlace de Facebook? Acepta con y sin https://.
function enlaceFacebook(q) {
  let s = String(q || "").trim();
  if (!s) return null;
  // El enlace puede venir rodeado de palabras: se saca de donde esté.
  const m = /https?:\/\/(?:www\.|m\.|web\.|mbasic\.)?(?:facebook\.com|fb\.watch|fb\.me)\/[^\s"'<>]+/i.exec(s);
  if (m) return m[0].replace(/[,.;:!?)»"']+$/, "");
  if (/^(?:www\.|m\.|web\.|mbasic\.)?(?:facebook\.com|fb\.watch|fb\.me)\//i.test(s)) return "https://" + s;
  return null;
}

// El id de vídeo escondido en una dirección de Facebook (si lo hay):
// watch/?v=..., video.php?v=..., /videos/<id>, /reel/<id>.
function idDeUrl(url) {
  const u = String(url || "");
  const rutas = [
    /[?&]v=([A-Za-z0-9_-]{5,40})/,
    /\/videos\/([A-Za-z0-9_-]{5,40})/,
    /\/reel\/([A-Za-z0-9_-]{5,40})/,
    /\/video\/([A-Za-z0-9_-]{5,40})/
  ];
  for (let i = 0; i < rutas.length; i++) {
    const m = rutas[i].exec(u);
    if (m) return m[1];
  }
  return "";
}

// ¿Pinta a muro de sesión la página que llegó?
function pintaMuro(html) {
  return html.indexOf("login_form") >= 0 || html.indexOf("Log into Facebook") >= 0 ||
    html.indexOf("Iniciar sesión en Facebook") >= 0;
}

// El ítem de un enlace pegado: se abre la página y se lee su vídeo.
async function itemDeEnlace(url) {
  trazaBusqueda = "enlace pegado: " + url.slice(0, 80);
  const t0 = Date.now();
  // El enlace se guarda ANTES de abrirlo: aunque falle, el informe
  // "debug" lo tiene para su prueba en vivo.
  try { kino.storage.set("fbUltimo", url); } catch (e) { /* sin almacén */ }
  const ab = await abrirFacebook(url, 1200000, 9000, false);
  if (!ab.r) {
    trazaError = "ninguna cara pudo abrir el enlace: " + ab.traza.join(", ");
    throw kino.error("not_found", "no se pudo abrir " + url.slice(0, 80), {
      userMessage: "Facebook no dejó abrir ese enlace desde la app. Prueba de nuevo en un rato; escribiendo debug sale el informe."
    });
  }
  let html = ab.r.text();
  let videos = videosDeHtml(html);
  let posterOg = metaOg(html, "og:image");
  trazaBusqueda = "enlace: escalera " + ab.traza.join(" → ") + " · " + html.length +
    " caracteres · " + videos.length + " vídeo(s) · muro: " + (pintaMuro(html) ? "sí" : "no");
  // La página abrió pero vino VACÍA de vídeo (el caso del reel): la caza
  // mayor en la dirección final, con todas las caras desde abajo.
  const idFinal0 = idDeUrl(ab.r.url || url);
  if (videos.length === 0 && idFinal0 && Date.now() - t0 < 9000) {
    const tra = [];
    const caza = await cazarConVideo("https://www.facebook.com/reel/" + encodeURIComponent(idFinal0), 1200000, 7000, tra);
    trazaBusqueda = trazaBusqueda + " ‖ caza: " + (caza.ok ? caza.cara + " trajo el vídeo" : tra.join(","));
    if (caza.ok) {
      html = caza.texto;
      videos = videosDeHtml(html);
      posterOg = posterOg || metaOg(html, "og:image");
    }
  }
  if (videos.length > 0) {
    const it = itemDeVideo(videos[0], "", posterOg);
    if (it) return [it];
  }
  // Los /share/ a veces redirigen a una dirección con el id: se rescata de ahí.
  const idFinal = idDeUrl(ab.r.url || url);
  const og = metaOg(html, "og:video:secure_url") || metaOg(html, "og:video:url") || metaOg(html, "og:video");
  const tituloOg = metaOg(html, "og:title") || "Video de Facebook";
  if (idFinal) {
    trazaBusqueda = trazaBusqueda + " → id rescatado de la dirección final";
    return [{
      id: "fbv." + idFinal,
      ref: "v:" + idFinal,
      title: tituloOg.slice(0, 140),
      kind: "movie",
      poster: posterOg || undefined,
      overview: "Enlace pegado · se resuelve al reproducir"
    }];
  }
  if (og) {
    return [{
      id: "fbv." + hashDe(og),
      ref: "u:" + url,
      title: tituloOg.slice(0, 140),
      kind: "movie",
      poster: posterOg || undefined,
      overview: "Enlace pegado · se resuelve al reproducir"
    }];
  }
  trazaError = "la página del enlace no trajo vídeo (" + html.length + " caracteres" +
    (pintaMuro(html) ? ", muro de sesión" : "") + ")";
  throw kino.error("not_found", "sin vídeo en " + url.slice(0, 90), {
    userMessage: "Ese enlace no trajo un vídeo: puede ser privado, haberse borrado o pedir iniciar sesión. Escribe debug para el informe."
  });
}

// ---------- páginas por nombre ----------

function slugDe(s) {
  let u = String(s || "").trim();
  if (!u) return "";
  let m = /^https?:\/\/[^\/]+\/([^\/?#]+)/i.exec(u);
  if (m) u = m[1];
  else {
    const m2 = /^(?:www\.|m\.|web\.)?facebook\.com\/([^\/?#]+)/i.exec(u);
    if (m2) u = m2[1];
  }
  u = u.replace(/\/+$/, "");
  if (!/^[A-Za-z0-9.\-_]{2,60}$/.test(u)) return "";
  // Direcciones que NO son páginas de nadie.
  if (/^(?:watch|reel|share|video|videos|story|stories|groups|marketplace|events|pages|login|profile|people|public|hashtag|search|gaming|reels)$/i.test(u)) return "";
  return u;
}

// Los vídeos de una página (con caché de 30 min). Si la pestaña de vídeos
// no trae nada, se prueba la raíz de la página: los vídeos de sus
// publicaciones también viven en el JSON.
async function videosDePagina(slug) {
  const c = cachePag[slug];
  if (c && Date.now() - c.t < 1800000) return c.nodos;
  let nodos = [];
  const urls = [
    "https://www.facebook.com/" + slug + "/videos/",
    "https://www.facebook.com/" + slug + "/"
  ];
  const inicio = Date.now();
  for (let i = 0; i < urls.length && nodos.length === 0; i++) {
    // El buscador tiene un presupuesto: si la primera dirección ya lo gastó,
    // no se espera a la segunda (mejor un aviso honesto que un timeout).
    if (i > 0 && Date.now() - inicio > 6000) break;
    const ab = await abrirFacebook(urls[i], 1200000, 9000, false);
    if (ab.r) nodos = videosDeHtml(ab.r.text());
  }
  // Los más nuevos primero cuando se sabe cuándo se publicaron.
  nodos.sort(function (a, b) {
    const ta = typeof a.creation_time === "number" ? a.creation_time : 0;
    const tb = typeof b.creation_time === "number" ? b.creation_time : 0;
    return tb - ta;
  });
  cachePag[slug] = { nodos: nodos, t: Date.now() };
  const claves = Object.keys(cachePag);
  if (claves.length > 8) {
    claves.sort(function (x, y) { return cachePag[x].t - cachePag[y].t; });
    while (claves.length > 8) delete cachePag[claves.shift()];
  }
  return nodos;
}

async function itemsDePagina(slug, limite, nombrePagina) {
  const nodos = await videosDePagina(slug);
  const items = [];
  for (let i = 0; i < nodos.length && items.length < limite; i++) {
    const it = itemDeVideo(nodos[i], nombrePagina, "");
    if (it) items.push(it);
  }
  return items;
}

// Las páginas guardadas en Ajustes (hasta 6).
function paginasGuardadas() {
  const fuera = [];
  for (let i = 1; i <= 6; i++) {
    const bruto = String(kino.config.get("pag" + i) || "").trim();
    if (!bruto) continue;
    const slug = slugDe(bruto);
    if (!slug) continue;
    fuera.push({ slug: slug, nombre: String(kino.config.get("fila" + i) || "").trim() });
  }
  return fuera;
}

// ---------- el buscador de Kino ----------

export async function search(query) {
  const q = query && query.q ? String(query.q).trim() : "";
  if (!q) return [];

  // Informe técnico (como en TubeKino): escribir "debug" o "estado".
  const ql = q.toLowerCase();
  if (ql === "debug" || ql === "estado") return await informeDebug();

  // ¿Enlace pegado de Facebook?
  const enlace = enlaceFacebook(q);
  if (enlace) return await itemDeEnlace(enlace);

  // ¿Nombre de una página? (los nombres de Facebook no llevan espacios)
  if (/^[A-Za-z0-9.\-_]{2,60}$/.test(q)) {
    trazaBusqueda = "página: " + q;
    const items = await itemsDePagina(q, 30, "");
    if (items.length > 0) return items;
    throw kino.error("not_found", "página sin vídeos: " + q, {
      userMessage: "No encontré vídeos públicos de esa página (o no existe). El nombre es lo que va tras facebook.com/, sin espacios."
    });
  }

  trazaBusqueda = "búsqueda general (pide sesión): rechazada";
  throw kino.error("not_found", "búsqueda no compatible: " + q.slice(0, 60), {
    userMessage: "La búsqueda general de Facebook pide iniciar sesión. Pega un enlace de vídeo o escribe el nombre EXACTO de una página (sin espacios)."
  });
}

// ---------- el Inicio ----------

export async function home() {
  const pags = paginasGuardadas();
  // Sin páginas guardadas no hay error: Kino muestra su aviso propio de
  // "sin catálogos" y en Ajustes está la guía de cómo guardarlas.
  if (pags.length === 0) {
    trazaHome = "portada: sin páginas guardadas (guarda hasta 6 en Ajustes)";
    return [];
  }
  const inicio = Date.now();
  const filas = [];
  let ok = 0;
  for (let i = 0; i < pags.length; i++) {
    // El Inicio tiene un presupuesto de tiempo: si ya va tarde, las filas
    // que falten se quedan para la próxima (la caché ayuda).
    if (Date.now() - inicio > 13000 && filas.length > 0) break;
    try {
      const items = await itemsDePagina(pags[i].slug, 14, pags[i].nombre);
      if (items.length > 0) {
        ok = ok + 1;
        filas.push({
          id: "fila." + pags[i].slug.replace(/[^A-Za-z0-9._~-]/g, "-"),
          title: pags[i].nombre || pags[i].slug,
          items: items,
          ref: "pg:" + pags[i].slug,
          genre: "otros"
        });
      }
    } catch (e) { /* fila omitida, las demás siguen */ }
  }
  trazaHome = "portada: " + ok + "/" + pags.length + " páginas con vídeos";
  if (filas.length === 0) {
    throw kino.error("unavailable", "home sin filas", {
      userMessage: "Ninguna de tus páginas trajo vídeos públicos ahora mismo. Revisa los nombres en Ajustes o prueba de nuevo en un rato."
    });
  }
  return filas;
}

// ---------- Ver más de una fila ----------

export async function browse(ref, cursor) {
  ref = String(ref || "");
  if (ref.indexOf("pg:") === 0) {
    const slug = ref.slice(3);
    const nodos = await videosDePagina(slug);
    const desde = cursor ? (parseInt(cursor, 10) || 0) : 0;
    const items = [];
    for (let i = desde; i < nodos.length && items.length < 15; i++) {
      const it = itemDeVideo(nodos[i], "", "");
      if (it) items.push(it);
    }
    const pagina = { items: items };
    if (items.length > 0 && desde + items.length < nodos.length) {
      pagina.next = String(desde + items.length);
    }
    return pagina;
  }
  throw kino.error("not_found", "browse ref " + ref.slice(0, 60));
}

// ---------- reproducir: aquí se consiguen los MP4 ----------

function streamDe(hd, sd, nodo) {
  const stream = {
    url: hd || sd,
    mime: "video/mp4",
    headers: {
      "User-Agent": UA_VIDEO,
      "Referer": "https://www.facebook.com/"
    },
    expiresInSeconds: 1800,
    label: hd ? "HD" : "SD"
  };
  if (hd && sd && sd !== hd) {
    stream.alternatives = [{ url: sd, mime: "video/mp4", label: "SD" }];
  }
  const ms = nodo && typeof nodo.playable_duration_in_ms === "number" ? nodo.playable_duration_in_ms : 0;
  if (ms > 0) stream.durationMs = Math.round(ms);
  return stream;
}

// De una página de vídeo ya descargada: el stream listo para Kino.
function streamDeHtml(html, id) {
  const nodos = videosDeHtml(html);
  let nodo = null;
  if (id) {
    for (let j = 0; j < nodos.length; j++) {
      if (String(nodos[j].id || nodos[j].videoId || nodos[j].__id || "") === id) { nodo = nodos[j]; break; }
    }
    if (!nodo && nodos.length === 1) nodo = nodos[0];
  } else if (nodos.length > 0) {
    nodo = nodos[0];
  }
  let hd = "";
  let sd = "";
  if (nodo) {
    const u = urlsDeVideo(nodo);
    hd = u.hd;
    sd = u.sd;
  }
  const crudas = urlsCrudas(html);
  if (!hd && crudas.hd) hd = crudas.hd;
  if (!sd && crudas.sd) sd = crudas.sd;
  if (!hd && !sd) {
    // Última red: algunas páginas de vídeo lo anuncian en las meta etiquetas.
    const og = metaOg(html, "og:video:secure_url") || metaOg(html, "og:video:url") || metaOg(html, "og:video");
    if (og) hd = og;
  }
  if (!hd && !sd) throw kino.error("not_found", "página sin vídeo reproducible" + (id ? " " + id : ""));
  return streamDe(hd, sd, nodo);
}

export async function resolve(ref, options) {
  ref = String(ref || "");
  trazaResolve = "ref " + ref.slice(0, 70);
  trazaError = "";

  // Enlace completo guardado (cuando no había id numérico).
  if (ref.indexOf("u:") === 0) {
    const url = ref.slice(2);
    const ab = await abrirFacebook(url, 1800000, 9000, false);
    if (ab.r) {
      try {
        const s = streamDeHtml(ab.r.text(), null);
        trazaResolve = "enlace → MP4 " + (s.label || "") + " (" + ab.traza.join(" → ") + ")";
        return s;
      } catch (e) { /* al error honesto */ }
    }
    trazaError = "enlace sin vídeo reproducible (" + (ab.r ? ab.traza.join(", ") : "sin abrir") + ")";
    throw kino.error("not_found", "enlace sin vídeo reproducible", {
      userMessage: "Facebook no entregó este vídeo: puede ser privado, haberse borrado o pedir iniciar sesión."
    });
  }

  // id de vídeo: se pide la página canónica del vídeo y de ahí salen
  // los MP4 firmados (caducan: por eso se resuelve al reproducir).
  if (ref.indexOf("v:") === 0) {
    const id = ref.slice(2);
    const intentos = [
      "https://www.facebook.com/reel/" + encodeURIComponent(id),
      "https://www.facebook.com/video/video.php?v=" + encodeURIComponent(id),
      "https://www.facebook.com/watch/?v=" + encodeURIComponent(id),
      "https://m.facebook.com/reel/" + encodeURIComponent(id),
      "https://m.facebook.com/watch/?v=" + encodeURIComponent(id) + "&_rnr",
      // La puerta trasera antigua: contesta en JSON cuando las páginas
      // de vídeo vienen vacías.
      "https://www.facebook.com/video/tahoe/async/" + encodeURIComponent(id) +
        "/?chain=true&isvideo=true&payloadtype=primary"
    ];
    const inicio = Date.now();
    const trazaIntentos = [];
    for (let i = 0; i < intentos.length; i++) {
      // Sin tiempo para más intentos: aviso honesto.
      if (i > 0 && Date.now() - inicio > 12000) break;
      const ab = await abrirFacebook(intentos[i], 1800000, 9000, true);
      trazaIntentos.push(ab.r ? ab.traza.join(",") : "(" + ab.traza.join(",") + ")");
      let s = null;
      if (ab.r) {
        const texto = pelarTahoe(intentos[i], ab.r.text());
        try { s = streamDeHtml(texto, id); } catch (e) { s = null; }
        // La página abrió pero vino VACÍA: la caza mayor en la misma
        // dirección, con todas las caras desde abajo.
        if (!s && !marcaVideo(pelarTahoe(intentos[i], ab.r.text())) && Date.now() - inicio < 8000) {
          const tra = [];
          const caza = await cazarConVideo(intentos[i], 1800000, 7000, tra);
          trazaIntentos.push("caza(" + tra.join(",") + ")");
          if (caza.ok) {
            const texto2 = pelarTahoe(intentos[i], caza.texto);
            try { s = streamDeHtml(texto2, id); } catch (e2) { s = null; }
          }
        }
      }
      if (s) {
        trazaResolve = "v:" + id + " → MP4 " + (s.label || "") + " · intento " + (i + 1);
        return s;
      }
      trazaError = "página del vídeo sin MP4 (intento " + (i + 1) + ")";
    }
    throw kino.error("not_found", "Facebook no entregó el vídeo " + id + ": " + trazaIntentos.join(" | "), {
      userMessage: "Facebook no entregó este vídeo: puede ser privado, haberse borrado o pedir iniciar sesión. Escribe debug para el informe."
    });
  }

  throw kino.error("not_found", "ref no es un vídeo: " + ref.slice(0, 60));
}

// ---------- Ajustes ----------

export async function settingsStatus() {
  const n = paginasGuardadas().length;
  return {
    estado: ("FaceTrack " + VERSION + ". " + n + " página(s) guardadas. " +
      "Pega enlaces de Facebook en el buscador o escribe el nombre de una página.").slice(0, 200)
  };
}

// ---------- informe técnico (buscando "debug") ----------

// La prueba EN VIVO: abre el último enlace pegado y cuenta, paso a paso,
// qué le respondió Facebook — el informe que dice la verdad del teléfono.
async function informarEnVivo(url) {
  if (!url) return "EN VIVO: sin enlace previo (pega un enlace y vuelve a escribir debug)";
  const t0 = Date.now();
  const ab = await abrirFacebook(url, 1200000, 7000, false);
  if (!ab.r) return "EN VIVO " + url.slice(0, 50) + " → NINGUNA CARA: " + ab.traza.join(",");
  const html = ab.r.text();
  const final = String(ab.r.url || url);
  const idReel = idDeUrl(final);
  let paso = "EN VIVO " + ab.traza.join("→") + " · " + html.length + " car · vídeo en crudo: " +
    (marcaVideo(html) ? "sí" : "no") + " · vídeos: " + videosDeHtml(html).length +
    " · muro: " + (pintaMuro(html) ? "SÍ" : "no") + " · id: " + (idReel || "no");
  // El detective 2.0: si la página no trae vídeo, prueba el REEL DIRECTO
  // con todas las caras desde abajo y la PUERTA TRASERA tahoe. La captura
  // de este informe dice exactamente qué cara (si alguna) trae el vídeo.
  if (!marcaVideo(html) && idReel && Date.now() - t0 < 5000) {
    const tra = [];
    const caza = await cazarConVideo("https://www.facebook.com/reel/" + encodeURIComponent(idReel), 1200000, 7000, tra);
    paso = paso + " ‖ REEL directo: " + (caza.ok
      ? caza.cara + " · " + caza.texto.length + " car · vídeo SÍ"
      : tra.join(","));
  }
  if (idReel && Date.now() - t0 < 11000) {
    try {
      const rT = await pedirSimple(
        "https://www.facebook.com/video/tahoe/async/" + encodeURIComponent(idReel) +
        "/?chain=true&isvideo=true&payloadtype=primary", 800000, 6000, false);
      const tT = rT.text();
      paso = paso + " ‖ TAHOE: " + tT.length + " car · vídeo: " + (marcaVideo(tT) ? "SÍ" : "no");
    } catch (e) {
      const m = /HTTP (\d+)/.exec(String(e && e.message ? e.message : String(e)));
      paso = paso + " ‖ TAHOE: " + (m ? m[1] : "x");
    }
  }
  return paso;
}

async function informeDebug() {
  const pags = paginasGuardadas();
  let ultimo = "";
  try { ultimo = String(kino.storage.get("fbUltimo") || ""); } catch (e) { /* sin almacén */ }
  const vivo = await informarEnVivo(ultimo);
  // La prueba en vivo va PRIMERO: es lo que dice la verdad del teléfono.
  const lineas = [
    vivo,
    "FaceTrack " + VERSION + " — informe",
    "Páginas guardadas: " + pags.length + (pags.length ? " (" + pags.map(function (p) { return p.slug; }).join(", ") + ")" : ""),
    "Última búsqueda: " + (trazaBusqueda || "—"),
    "Último Inicio: " + (trazaHome || "—"),
    "Última reproducción: " + (trazaResolve || "—"),
    "Último fallo: " + (trazaError || "—"),
    "Caché de páginas: " + Object.keys(cachePag).length
  ];
  return [{
    id: "fbv.debug",
    ref: "debug",
    title: "FaceTrack — informe técnico",
    kind: "movie",
    overview: lineas.join(" · ").slice(0, 480)
  }];
}

// ---------- herramientas pequeñas ----------

function hashDe(s) {
  let h = 5381;
  const t = String(s || "");
  for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) & 0x7fffffff;
  return h.toString(36);
}
