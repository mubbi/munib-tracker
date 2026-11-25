/**
 * Self-contained HTML for the masjid map (NF-3.11): MapLibre GL JS from a pinned
 * CDN build (SRI-checked) + OpenFreeMap vector tiles (free, no key, no quota —
 * built on OpenStreetMap). Rendered in a WebView on native and a sandboxed
 * iframe on web; no native dependency, nothing to bundle.
 *
 * Privacy: the tile server necessarily sees which map area is displayed, so the
 * map is opt-in on the finder screen. Masjid names come from OSM (untrusted):
 * they're embedded as escaped JSON and only ever set via textContent/attributes.
 *
 * Links (the tile/OSM credits in the attribution control) open outside the map:
 * `<base target="_blank">` gives web a new tab; native intercepts the navigation
 * and opens the in-app browser.
 *
 * Messages to the host (JSON strings): {type:"ready"} | {type:"error"} |
 * {type:"select", key: string|null}. Host → map: `window.__selectMasjid(key)`.
 */

export const MAPLIBRE_VERSION = "5.6.0";
const MAPLIBRE_JS = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js`;
const MAPLIBRE_CSS = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css`;
const MAPLIBRE_JS_SRI = "sha384-GfxBM9x46BaAFxtCq39Fxir8fNZ4VDnwgfi6Kzi5/F1tAFsm0amuuV8kd+Pxzuf/";
const MAPLIBRE_CSS_SRI = "sha384-Nq6PQ+9vJPvw7U/VfDELyrWoGQMsy0gi6QShhaSrGzkpF5KkM40csg2leky+YMTd";

export const OPENFREEMAP_STYLE = {
  dark: "https://tiles.openfreemap.org/styles/dark",
  light: "https://tiles.openfreemap.org/styles/positron",
} as const;

/** Pins fitted into the first view (the rest are a pan away). */
const FIT_NEAREST = 8;

export type MasjidMapPoint = {
  key: string;
  lat: number;
  lon: number;
  name: string;
  home?: boolean;
};

export type MasjidMapInput = {
  /** The user's position (the search origin); drawn as the "you" dot. */
  me: { lat: number; lon: number };
  /** Nearest first — the first few are fitted into view. */
  masjids: readonly MasjidMapPoint[];
  dark: boolean;
  colors: {
    background: string;
    pin: string;
    pinBorder: string;
    home: string;
    me: string;
  };
  /** Accessible label for the user's dot. */
  youLabel: string;
};

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);
const BACKSLASH = String.fromCharCode(92);
/** Characters that could end or break an inline <script> block. */
const UNSAFE_IN_SCRIPT = new RegExp(`[<>&${LS}${PS}]`, "g");

/** JSON that is safe inside an inline <script> (no `</script>` / line-separator breakouts). */
export function scriptSafeJson(value: unknown): string {
  return JSON.stringify(value).replace(UNSAFE_IN_SCRIPT, (char) => unicodeEscape(char));
}

/** `<` → the six characters backslash-u-0-0-3-c (still the same JSON string value). */
function unicodeEscape(char: string): string {
  return `${BACKSLASH}u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
}

/** Only `#rgb`/`#rrggbb(aa)` and `rgb()/rgba()` reach the stylesheet. */
function cssColor(value: string, fallback: string): string {
  return /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(value.trim()) ? value.trim() : fallback;
}

export function buildMasjidMapHtml(input: MasjidMapInput): string {
  const c = {
    background: cssColor(input.colors.background, "#0b1a14"),
    pin: cssColor(input.colors.pin, "#2e9e6b"),
    pinBorder: cssColor(input.colors.pinBorder, "#ffffff"),
    home: cssColor(input.colors.home, "#d9a343"),
    me: cssColor(input.colors.me, "#4c8fd9"),
  };
  const data = scriptSafeJson({
    style: input.dark ? OPENFREEMAP_STYLE.dark : OPENFREEMAP_STYLE.light,
    me: input.me,
    masjids: input.masjids.map((m) => ({
      key: m.key,
      lat: m.lat,
      lon: m.lon,
      name: m.name,
      home: m.home === true,
    })),
    youLabel: input.youLabel,
    fit: FIT_NEAREST,
  });

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="referrer" content="no-referrer">
<base target="_blank">
<link rel="stylesheet" href="${MAPLIBRE_CSS}" integrity="${MAPLIBRE_CSS_SRI}" crossorigin="anonymous">
<style>
  html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: ${c.background}; }
  .pin { width: 34px; height: 40px; padding: 0; margin: 0; border: 0; background: none; cursor: pointer;
    display: flex; align-items: flex-start; justify-content: center; -webkit-tap-highlight-color: transparent; }
  .pin-shape { width: 24px; height: 24px; margin-top: 4px; border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg); background: ${c.pin}; border: 2px solid ${c.pinBorder};
    box-shadow: 0 2px 6px rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center;
    transition: transform .15s ease; }
  .pin-shape::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: ${c.pinBorder}; }
  .pin.home .pin-shape { background: ${c.home}; }
  .pin.sel .pin-shape { transform: rotate(-45deg) scale(1.3); }
  .pin:focus-visible { outline: none; }
  .pin:focus-visible .pin-shape { outline: 3px solid ${c.pinBorder}; outline-offset: 2px; }
  .me { width: 16px; height: 16px; border-radius: 50%; background: ${c.me}; border: 3px solid #fff;
    box-shadow: 0 0 0 0 ${c.me}; animation: pulse 2s infinite; }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(76,143,217,.55); } 70% { box-shadow: 0 0 0 14px rgba(76,143,217,0); } 100% { box-shadow: 0 0 0 0 rgba(76,143,217,0); } }
  @media (prefers-reduced-motion: reduce) { .me { animation: none; } .pin-shape { transition: none; } }
</style>
</head>
<body>
<div id="map"></div>
<script src="${MAPLIBRE_JS}" integrity="${MAPLIBRE_JS_SRI}" crossorigin="anonymous"></script>
<script>
(function () {
  var D = ${data};
  function post(message) {
    var text = JSON.stringify(message);
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(text);
    else if (window.parent && window.parent !== window) window.parent.postMessage(text, "*");
  }
  if (!window.maplibregl) { post({ type: "error" }); return; }
  var map;
  try {
    map = new maplibregl.Map({
      container: "map", style: D.style, center: [D.me.lon, D.me.lat], zoom: 14,
      attributionControl: { compact: true }, dragRotate: false, pitchWithRotate: false,
    });
  } catch (e) { post({ type: "error" }); return; }
  map.touchZoomRotate.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

  var pins = {}, selected = null;
  function select(key) {
    if (selected && pins[selected]) pins[selected].classList.remove("sel");
    selected = key && pins[key] ? key : null;
    if (selected) pins[selected].classList.add("sel");
  }
  D.masjids.forEach(function (m) {
    var el = document.createElement("button");
    el.type = "button";
    el.className = m.home ? "pin home" : "pin";
    el.setAttribute("aria-label", m.name);
    el.title = m.name;
    var shape = document.createElement("span");
    shape.className = "pin-shape";
    el.appendChild(shape);
    el.addEventListener("click", function (event) {
      event.stopPropagation();
      select(m.key);
      post({ type: "select", key: m.key });
    });
    pins[m.key] = el;
    new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([m.lon, m.lat]).addTo(map);
  });

  var me = document.createElement("div");
  me.className = "me";
  me.setAttribute("role", "img");
  me.setAttribute("aria-label", D.youLabel);
  new maplibregl.Marker({ element: me }).setLngLat([D.me.lon, D.me.lat]).addTo(map);

  var nearest = D.masjids.slice(0, D.fit);
  if (nearest.length > 0) {
    var bounds = new maplibregl.LngLatBounds([D.me.lon, D.me.lat], [D.me.lon, D.me.lat]);
    nearest.forEach(function (m) { bounds.extend([m.lon, m.lat]); });
    map.fitBounds(bounds, { padding: 48, maxZoom: 16, duration: 0 });
  }

  map.on("click", function () { select(null); post({ type: "select", key: null }); });
  map.once("load", function () { post({ type: "ready" }); });
  window.__selectMasjid = function (key) {
    select(key);
    var m = D.masjids.filter(function (x) { return x.key === key; })[0];
    if (m) map.easeTo({ center: [m.lon, m.lat], duration: 300 });
  };
})();
</script>
</body>
</html>`;
}

/** Parses a message from the map; anything malformed or unexpected → null. */
export function parseMasjidMapMessage(
  raw: unknown,
): { type: "ready" } | { type: "error" } | { type: "select"; key: string | null } | null {
  if (typeof raw !== "string" || raw.length > 2_000) return null;
  try {
    const message = JSON.parse(raw) as { type?: unknown; key?: unknown };
    if (message.type === "ready" || message.type === "error") return { type: message.type };
    if (message.type === "select") {
      if (message.key === null) return { type: "select", key: null };
      if (typeof message.key === "string" && message.key.length <= 64) {
        return { type: "select", key: message.key };
      }
    }
  } catch {
    // Not ours.
  }
  return null;
}
