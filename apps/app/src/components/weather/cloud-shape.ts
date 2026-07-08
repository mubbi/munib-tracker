/** Deterministic pseudo-random in [0, 1) — stable per cloud seed. */
export function cloudSeedRandom(cloudSeed: number, salt: number): number {
  const x = Math.sin(cloudSeed * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export type CloudPuffShade = "body" | "highlight" | "belly";

export type CloudVariant = "light" | "medium" | "storm";

export type CloudSize = "small" | "medium" | "large";

/** One bump in a cumulus silhouette — positions are normalized to cloud width/height. */
export type CloudPartSpec = {
  kind: "circle" | "ellipse";
  /** Center x as a fraction of cloud width. */
  cx: number;
  /** Center y as a fraction of cloud height. */
  cy: number;
  /** Radius as a fraction of cloud width (ellipse ry uses the same scale). */
  r: number;
  /** Ellipse horizontal stretch — rx = r × rxScale × baseWidth. */
  rxScale?: number;
  layer: number;
  shade: CloudPuffShade;
};

/** Height relative to width for the cloud artboard. */
export const CLOUD_HEIGHT_RATIO = 0.36;

export const CLOUD_TONES: Record<
  CloudVariant,
  { fill: string; highlight: string; belly: string; shadow: string }
> = {
  light: { fill: "#F8FBFF", highlight: "#FFFFFF", belly: "#D8E2EC", shadow: "#9EB0C2" },
  medium: { fill: "#EEF3F8", highlight: "#F8FAFC", belly: "#C4D0DC", shadow: "#7F94A8" },
  storm: { fill: "#D8E0EA", highlight: "#E8EDF3", belly: "#A0B0BE", shadow: "#5C6F82" },
};

export function cloudPartColor(
  variant: CloudVariant,
  shade: CloudPuffShade,
): { fill: string; opacity: number } {
  const tone = CLOUD_TONES[variant];
  if (shade === "belly") {
    return { fill: tone.belly, opacity: 0.92 };
  }
  if (shade === "highlight") {
    return { fill: tone.highlight, opacity: 0.85 };
  }
  return { fill: tone.fill, opacity: 1 };
}

/**
 * Classic cumulus: wide flat base + overlapping domes.
 * Rendered as one SVG group so bumps merge into a single cloud on native.
 */
export function generateCumulusCloud(seed: number, size: CloudSize): CloudPartSpec[] {
  const rand = (salt: number) => cloudSeedRandom(seed, salt);
  const scale = size === "small" ? 0.82 : size === "medium" ? 1 : 1.12;

  const centerR = (0.24 + rand(1) * 0.035) * scale;
  const leftR = (0.19 + rand(2) * 0.03) * scale;
  const rightR = (0.17 + rand(3) * 0.03) * scale;

  const parts: CloudPartSpec[] = [
    {
      kind: "ellipse",
      cx: 0.5,
      cy: 0.78,
      r: 0.14 * scale,
      rxScale: 2.55,
      layer: 0,
      shade: "belly",
    },
    {
      kind: "circle",
      cx: 0.27 + rand(4) * 0.03,
      cy: 0.56,
      r: leftR,
      layer: 1,
      shade: "body",
    },
    {
      kind: "circle",
      cx: 0.51,
      cy: 0.4,
      r: centerR,
      layer: 2,
      shade: "body",
    },
    {
      kind: "circle",
      cx: 0.73 - rand(5) * 0.03,
      cy: 0.54,
      r: rightR,
      layer: 3,
      shade: "body",
    },
  ];

  if (size !== "small") {
    parts.push({
      kind: "circle",
      cx: 0.51,
      cy: 0.26,
      r: centerR * 0.42,
      layer: 4,
      shade: "highlight",
    });
  }

  if (size === "large") {
    parts.push({
      kind: "circle",
      cx: 0.14,
      cy: 0.58,
      r: leftR * 0.72,
      layer: 1,
      shade: "body",
    });
    if (rand(6) > 0.45) {
      parts.push({
        kind: "circle",
        cx: 0.84,
        cy: 0.56,
        r: rightR * 0.68,
        layer: 3,
        shade: "body",
      });
    }
  }

  return parts.sort((a, b) => a.layer - b.layer);
}

/** Bounding box for an SVG cloud group — includes padding so domes are not clipped. */
export function cloudFrame(
  baseWidth: number,
  parts: CloudPartSpec[],
): { width: number; height: number; offsetX: number; offsetY: number } {
  const baseHeight = baseWidth * CLOUD_HEIGHT_RATIO;
  const pad = baseWidth * 0.04;
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = 0;
  let maxY = 0;

  for (const part of parts) {
    const ry = baseWidth * part.r;
    const rx = part.kind === "ellipse" ? ry * (part.rxScale ?? 1.5) : ry;
    const cx = baseWidth * part.cx;
    const cy = baseHeight * part.cy;
    minX = Math.min(minX, cx - rx);
    minY = Math.min(minY, cy - ry);
    maxX = Math.max(maxX, cx + rx);
    maxY = Math.max(maxY, cy + ry);
  }

  return {
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
    offsetX: pad - minX,
    offsetY: pad - minY,
  };
}

export type CloudPlacement = {
  id: number;
  top: string;
  left: string;
  scale: number;
  opacity: number;
  size: CloudSize;
  duration: number;
  offset: number;
  drift: number;
};

type CloudSlotTemplate = Omit<CloudPlacement, "opacity"> & {
  opacityScale: number;
};

/** Fixed sky slots — large cumulus at the shoulders; centre stays clear for text. */
const CLOUD_SLOTS: CloudSlotTemplate[] = [
  {
    id: 11,
    top: "1%",
    left: "-10%",
    scale: 0.92,
    opacityScale: 0.88,
    size: "medium",
    duration: 28000,
    offset: 0,
    drift: 14,
  },
  {
    id: 23,
    top: "2%",
    left: "68%",
    scale: 0.88,
    opacityScale: 0.84,
    size: "medium",
    duration: 32000,
    offset: 1400,
    drift: 12,
  },
  {
    id: 37,
    top: "6%",
    left: "-2%",
    scale: 1.05,
    opacityScale: 1,
    size: "large",
    duration: 26000,
    offset: 800,
    drift: 18,
  },
  {
    id: 52,
    top: "8%",
    left: "62%",
    scale: 0.98,
    opacityScale: 0.94,
    size: "large",
    duration: 30000,
    offset: 2200,
    drift: 16,
  },
];

export function cloudPlacementsFor(options: {
  partlyCloudy: boolean;
  heavy: boolean;
  cloudy: boolean;
  baseOpacity: number;
}): CloudPlacement[] {
  const { partlyCloudy, heavy, cloudy, baseOpacity } = options;

  const withOpacity = (slots: readonly CloudSlotTemplate[]) =>
    slots.map((slot) => ({
      ...slot,
      opacity: baseOpacity * slot.opacityScale,
    }));

  if (partlyCloudy) {
    return withOpacity([CLOUD_SLOTS[0], CLOUD_SLOTS[1]]);
  }

  if (cloudy) {
    return withOpacity([CLOUD_SLOTS[0], CLOUD_SLOTS[2], CLOUD_SLOTS[3]]);
  }

  if (heavy) {
    return withOpacity([CLOUD_SLOTS[2], CLOUD_SLOTS[3]]);
  }

  return withOpacity([CLOUD_SLOTS[0], CLOUD_SLOTS[1]]);
}

/** @deprecated Use generateCumulusCloud — kept for tests during transition. */
export function generateCloudPuffs(seed: number, archetype: "triplet" | "duo" | "wisp") {
  const size = archetype === "triplet" ? "large" : archetype === "duo" ? "medium" : "small";
  return generateCumulusCloud(seed, size);
}
