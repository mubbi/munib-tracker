// Per-scene look for the Munib Tracker marketing decks — the "Day Arc"
// storyline from the marketing site (dusk → night → girih …), using the
// template layer in src/lib/design.ts + src/lib/templates.ts.
//
// Shared by seed-project.mjs (new projects) and apply-deck-style.mjs
// (restyle an existing app-store-screenshots.json without re-seeding copy).

/** "And more" slide: short headline + feature chips (one chip per line). */
export const MORE_HEADLINE = {
  en: "Built for your\n**whole day**",
  ar: "مصمَّم ليومك\n**كلّه**",
  ur: "آپ کے\n**پورے دن** کے لیے",
};

export const MORE_FEATURES = {
  en: "Widgets\nPIN lock\nTasbeeh\nJournal\n24 languages",
  ar: "ودجات\nقفل PIN\nتسبيح\nيوميات\n24 لغة",
  ur: "وجٹس\nPIN لاک\nتسبیح\nجرنل\n24 زبانیں",
};

/** Phone / tablet / foldable decks, keyed by slide number (mt-<device>-NN). */
export const PHONE_STYLE = {
  "01": {
    layout: "hero",
    inverted: false,
    design: { background: "dusk", highlight: "gold", labelStyle: "pill" },
  },
  "02": {
    layout: "bleed-bottom",
    inverted: false,
    design: { background: "night", highlight: "gradient", glow: true },
  },
  "03": {
    layout: "device-top",
    inverted: true,
    design: { background: "girih", highlight: "gold" },
  },
  "04": {
    layout: "two-devices",
    inverted: false,
    design: { background: "mesh", highlight: "box" },
  },
  "05": {
    layout: "tilted",
    inverted: false,
    design: { background: "night", highlight: "gold", glow: true, mirror: true },
  },
  "06": {
    layout: "bleed-bottom",
    inverted: false,
    design: {
      background: "parchment",
      highlight: "marker",
      labelStyle: "pill",
      finish: "space-black",
      // Magnifier on the first name's Arabic calligraphy (ar-Raḥmān).
      lens: { x: 0.38, y: 0.68, zoom: 2.6 },
    },
  },
  "07": {
    layout: "feature-list",
    inverted: false,
    headline: MORE_HEADLINE,
    design: { background: "night", highlight: "gold", features: MORE_FEATURES },
  },
};

/** TV decks: the framed (non full-bleed) slides, in order. */
export const TV_STYLE = [
  {
    layout: "hero",
    inverted: false,
    design: { background: "dusk", highlight: "gold", labelStyle: "pill" },
  },
  {
    layout: "bleed-bottom",
    inverted: false,
    design: { background: "night", highlight: "gradient", glow: true },
  },
  {
    layout: "device-top",
    inverted: true,
    design: { background: "girih", highlight: "gold" },
  },
];

export const PHONE_DECKS = ["iphone", "android", "ipad", "android-7", "android-10", "iphone-duo"];
export const TV_DECKS = ["apple-tv", "android-tv"];

/** Merge a style entry into a slide (keeps copy/screenshots; resets hand-placed transforms). */
export function styled(slide, style) {
  if (!style) return slide;
  const { headline, ...rest } = style;
  const next = { ...slide, ...rest, design: { ...style.design } };
  if (headline) next.headline = headline;
  delete next.transforms;
  if (!next.inverted) delete next.inverted;
  return next;
}

export function styleDeck(device, slides) {
  if (PHONE_DECKS.includes(device)) {
    return slides.map((s) => styled(s, PHONE_STYLE[s.id.match(/-(\d\d)$/)?.[1]]));
  }
  if (TV_DECKS.includes(device)) {
    let framed = 0;
    return slides.map((s) => (s.layout === "full-bleed" ? s : styled(s, TV_STYLE[framed++])));
  }
  return slides;
}
