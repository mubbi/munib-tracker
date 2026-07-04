/** Deterministic pseudo-random in [0, 1) — stable per cloud seed. */
export function cloudSeedRandom(cloudSeed: number, salt: number): number {
  const x = Math.sin(cloudSeed * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export type CloudPuffShade = "body" | "highlight" | "belly";

/** `size` is the puff diameter as a fraction of cloud width. Positions are 0..1. */
export type CloudPuffSpec = {
  size: number;
  x: number;
  y: number;
  layer: number;
  shade: CloudPuffShade;
};

export type CloudArchetype = "triplet" | "duo" | "wisp";

/**
 * Compact cumulus built from round bumps only — no flat horizontal pills.
 * Each seed picks an archetype and slightly perturbs bump sizes/places.
 */
export function generateCloudPuffs(cloudSeed: number, archetype: CloudArchetype): CloudPuffSpec[] {
  const rand = (salt: number) => cloudSeedRandom(cloudSeed, salt);

  const bump = (
    x: number,
    y: number,
    size: number,
    layer: number,
    shade: CloudPuffShade = "body",
  ): CloudPuffSpec => ({ x, y, size, layer, shade });

  if (archetype === "wisp") {
    const primary = 0.34 + rand(1) * 0.1;
    const secondary = primary * (0.62 + rand(2) * 0.12);
    return [bump(0.12, 0.38, primary, 1), bump(0.12 + primary * 0.62, 0.44, secondary, 2)];
  }

  if (archetype === "duo") {
    const left = 0.36 + rand(1) * 0.1;
    const right = 0.28 + rand(2) * 0.1;
    const puffs = [bump(0.04, 0.4, left, 1), bump(0.04 + left * 0.58, 0.32, right, 2)];
    if (rand(3) > 0.45) {
      puffs.push(bump(0.08, 0.52, left * 0.45, 0, "belly"));
    }
    return puffs.sort((a, b) => a.layer - b.layer);
  }

  // triplet — classic 3-bump cloud; only these bumps overlap each other.
  const center = 0.4 + rand(1) * 0.12;
  const left = 0.28 + rand(2) * 0.1;
  const right = 0.24 + rand(3) * 0.08;
  const puffs = [
    bump(0, 0.44, left, 1),
    bump(left * 0.48, 0.24, center, 3),
    bump(left * 0.48 + center * 0.42, 0.42, right, 2),
  ];
  if (rand(4) > 0.35) {
    puffs.push(bump(left * 0.2, 0.56, left * 0.38, 0, "belly"));
  }
  if (rand(5) > 0.4) {
    puffs.push(bump(left * 0.55, 0.16, 0.1 + rand(6) * 0.06, 4, "highlight"));
  }
  return puffs.sort((a, b) => a.layer - b.layer);
}

export type CloudPlacement = {
  id: number;
  top: string;
  left: string;
  scale: number;
  opacity: number;
  archetype: CloudArchetype;
  duration: number;
  offset: number;
  drift: number;
};

type CloudSlotTemplate = Omit<CloudPlacement, "opacity"> & {
  opacityScale: number;
};

/** Fixed sky slots — clouds stay at edges; centre stays clear for text. */
const CLOUD_SLOTS: CloudSlotTemplate[] = [
  {
    id: 11,
    top: "2%",
    left: "-6%",
    scale: 0.58,
    opacityScale: 0.82,
    archetype: "wisp",
    duration: 28000,
    offset: 0,
    drift: 14,
  },
  {
    id: 23,
    top: "4%",
    left: "72%",
    scale: 0.54,
    opacityScale: 0.78,
    archetype: "wisp",
    duration: 32000,
    offset: 1400,
    drift: 12,
  },
  {
    id: 37,
    top: "9%",
    left: "4%",
    scale: 0.82,
    opacityScale: 1,
    archetype: "triplet",
    duration: 26000,
    offset: 800,
    drift: 18,
  },
  {
    id: 52,
    top: "11%",
    left: "66%",
    scale: 0.72,
    opacityScale: 0.88,
    archetype: "duo",
    duration: 30000,
    offset: 2200,
    drift: 16,
  },
  {
    id: 68,
    top: "16%",
    left: "38%",
    scale: 0.48,
    opacityScale: 0.62,
    archetype: "wisp",
    duration: 34000,
    offset: 3000,
    drift: 10,
  },
];

export function cloudPlacementsFor(options: {
  partlyCloudy: boolean;
  heavy: boolean;
  baseOpacity: number;
}): CloudPlacement[] {
  const { partlyCloudy, heavy, baseOpacity } = options;

  if (partlyCloudy) {
    return [CLOUD_SLOTS[0], CLOUD_SLOTS[1]].map((slot) => ({
      ...slot,
      opacity: baseOpacity * slot.opacityScale,
    }));
  }

  if (heavy) {
    // Distant left wisp + left/right shoulder clusters — centre stays open.
    return [CLOUD_SLOTS[0], CLOUD_SLOTS[2], CLOUD_SLOTS[3]].map((slot) => ({
      ...slot,
      opacity: baseOpacity * slot.opacityScale,
    }));
  }

  return [CLOUD_SLOTS[0], CLOUD_SLOTS[2], CLOUD_SLOTS[1]].map((slot) => ({
    ...slot,
    opacity: baseOpacity * slot.opacityScale,
  }));
}
