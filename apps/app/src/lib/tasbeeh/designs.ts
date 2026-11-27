/**
 * Tasbeeh counter design registry (NF-3.19). Each design is a different way of
 * *showing* the same count — counting accuracy, limits, undo and completion all
 * stay in the counter shell. Ring stays the default (D10); every design and
 * material is free (D16).
 */

import type {
  TasbeehAppearance,
  TasbeehClickerBacklight,
  TasbeehDesignId,
  TasbeehFingerLayout,
  TasbeehHapticsLevel,
  TasbeehMisbahaAppearance,
  TasbeehPebbleItem,
  TasbeehStrandLayout,
} from "@munib-tracker/shared/types";

import { buildStrand, resolveStrand, type StrandModel } from "./bead-layout";
import { applyPreset, DEFAULT_PRESET_ID, PRESETS } from "./materials";
import { DEFAULT_TASBEEH_VOLUME, isSoundPackId, type TasbeehSoundPackId } from "./sound-packs";

/** Delivery slice from the plan: P1 = v1, P2 = v1.1, P3 = v2. */
export type TasbeehDesignPriority = "P1" | "P2" | "P3";

export interface TasbeehDesignDef {
  id: TasbeehDesignId;
  priority: TasbeehDesignPriority;
  /** Offered on Apple TV / Android TV (Select counts). */
  tv: boolean;
  /** Shipped in this build (catalog entries beyond this stay hidden). */
  shipped: boolean;
  /** Sound pack used when the pack is "auto" (misbaha follows its material instead). */
  defaultSound: TasbeehSoundPackId;
  /** Shows the PartyPopper burst on completion; calmer designs glow instead. */
  celebrates: boolean;
  /** Fires distinct haptic pulses at every 33 (counting without looking). */
  milestones: boolean;
  /** i18n keys under `tasbeehDesigns.designs.<id>.*`. */
  i18nKey: string;
}

export const TASBEEH_DESIGNS: readonly TasbeehDesignDef[] = [
  {
    id: "ring",
    priority: "P1",
    tv: true,
    shipped: true,
    defaultSound: "woodSoft",
    celebrates: true,
    milestones: false,
    i18nKey: "ring",
  },
  {
    id: "misbaha",
    priority: "P1",
    tv: true,
    shipped: true,
    defaultSound: "resin",
    celebrates: false,
    milestones: false,
    i18nKey: "misbaha",
  },
  {
    id: "clicker",
    priority: "P2",
    tv: true,
    shipped: true,
    defaultSound: "clicker",
    celebrates: false,
    milestones: false,
    i18nKey: "clicker",
  },
  {
    id: "minimal",
    priority: "P2",
    tv: true,
    shipped: true,
    defaultSound: "woodSoft",
    celebrates: false,
    milestones: true,
    i18nKey: "minimal",
  },
  {
    id: "fingers",
    priority: "P3",
    tv: false,
    shipped: true,
    defaultSound: "woodSoft",
    celebrates: false,
    milestones: false,
    i18nKey: "fingers",
  },
  {
    id: "geometric",
    priority: "P3",
    tv: false,
    shipped: true,
    defaultSound: "stone",
    celebrates: false,
    milestones: false,
    i18nKey: "geometric",
  },
  {
    id: "stars",
    priority: "P3",
    tv: false,
    shipped: true,
    defaultSound: "glass",
    celebrates: false,
    milestones: false,
    i18nKey: "stars",
  },
  {
    id: "pebbles",
    priority: "P3",
    tv: false,
    shipped: true,
    defaultSound: "stone",
    celebrates: false,
    milestones: false,
    i18nKey: "pebbles",
  },
];

export const DEFAULT_TASBEEH_DESIGN: TasbeehDesignId = "ring";

export function getDesign(id: TasbeehDesignId | string | undefined): TasbeehDesignDef {
  return (
    TASBEEH_DESIGNS.find((design) => design.id === id && design.shipped) ??
    (TASBEEH_DESIGNS[0] as TasbeehDesignDef)
  );
}

/** Designs to offer on this device: shipped ones, and on TV only the TV-ready set. */
export function availableDesigns(opts: { tv: boolean }): TasbeehDesignDef[] {
  return TASBEEH_DESIGNS.filter((design) => design.shipped && (!opts.tv || design.tv));
}

export function isDesignAvailable(id: string, opts: { tv: boolean }): boolean {
  return availableDesigns(opts).some((design) => design.id === id);
}

export const DEFAULT_MISBAHA: TasbeehMisbahaAppearance = {
  ...applyPreset(
    {
      preset: DEFAULT_PRESET_ID,
      shape: "round",
      material: "amberHoney",
      spacer: "gold",
      tassel: { style: "silk" },
      thread: {},
      strand: "auto",
    },
    DEFAULT_PRESET_ID,
  ),
};

export const DEFAULT_CLICKER: { backlight: TasbeehClickerBacklight } = { backlight: "green" };

export const PEBBLE_ITEMS: readonly TasbeehPebbleItem[] = ["pits", "stones"];
export const FINGER_LAYOUTS: readonly TasbeehFingerLayout[] = ["tips", "joints"];
export const DEFAULT_PEBBLES: { item: TasbeehPebbleItem } = { item: "pits" };
export const DEFAULT_FINGERS: { layout: TasbeehFingerLayout } = { layout: "tips" };

export const DEFAULT_TASBEEH_APPEARANCE: TasbeehAppearance = {
  design: DEFAULT_TASBEEH_DESIGN,
  sound: { pack: "auto", volume: DEFAULT_TASBEEH_VOLUME },
  haptics: "subtle",
};

const HAPTIC_LEVELS: readonly TasbeehHapticsLevel[] = ["off", "subtle", "rich"];

/** A fully-resolved appearance for rendering (every optional filled in). */
export interface ResolvedTasbeehAppearance {
  design: TasbeehDesignId;
  misbaha: TasbeehMisbahaAppearance;
  clicker: { backlight: TasbeehClickerBacklight };
  pebbles: { item: TasbeehPebbleItem };
  fingers: { layout: TasbeehFingerLayout };
  sound: { enabled: boolean; pack: string; volume: number };
  haptics: TasbeehHapticsLevel;
}

/**
 * Fills defaults and drops anything this device can't show. `undefined` ⇒ the
 * Ring default (D10). Sound is on by default only on TV (no haptics there; D16);
 * an explicit choice is kept everywhere. A design that isn't offered here (e.g.
 * a phone-only design synced to a TV) falls back to Ring without rewriting the
 * stored choice.
 */
export function resolveTasbeehAppearance(
  stored: Partial<TasbeehAppearance> | undefined,
  opts: { tv: boolean },
): ResolvedTasbeehAppearance {
  const design = stored?.design && isDesignAvailable(stored.design, opts) ? stored.design : "ring";
  const volume = stored?.sound?.volume;
  const pack = stored?.sound?.pack;
  return {
    design,
    misbaha: { ...DEFAULT_MISBAHA, ...stored?.misbaha },
    clicker: { ...DEFAULT_CLICKER, ...stored?.clicker },
    pebbles: {
      item:
        stored?.pebbles?.item && PEBBLE_ITEMS.includes(stored.pebbles.item)
          ? stored.pebbles.item
          : DEFAULT_PEBBLES.item,
    },
    fingers: {
      layout:
        stored?.fingers?.layout && FINGER_LAYOUTS.includes(stored.fingers.layout)
          ? stored.fingers.layout
          : DEFAULT_FINGERS.layout,
    },
    sound: {
      enabled: stored?.sound?.enabled ?? opts.tv,
      pack: pack && (pack === "auto" || isSoundPackId(pack)) ? pack : "auto",
      volume:
        typeof volume === "number" && Number.isFinite(volume)
          ? Math.min(1, Math.max(0, volume))
          : DEFAULT_TASBEEH_VOLUME,
    },
    haptics: stored?.haptics && HAPTIC_LEVELS.includes(stored.haptics) ? stored.haptics : "subtle",
  };
}

/**
 * Merges an edit into the stored appearance (nested objects merge one level),
 * returning the value to persist on `UserPreferences.tasbeehAppearance`.
 */
export function mergeTasbeehAppearance(
  stored: TasbeehAppearance | undefined,
  patch: Partial<TasbeehAppearance>,
): TasbeehAppearance {
  const base = stored ?? DEFAULT_TASBEEH_APPEARANCE;
  return {
    ...base,
    ...patch,
    sound: { ...base.sound, ...patch.sound },
    ...(patch.misbaha || base.misbaha
      ? { misbaha: { ...DEFAULT_MISBAHA, ...base.misbaha, ...patch.misbaha } }
      : {}),
    ...(patch.clicker || base.clicker
      ? { clicker: { ...DEFAULT_CLICKER, ...base.clicker, ...patch.clicker } }
      : {}),
    ...(patch.pebbles || base.pebbles
      ? { pebbles: { ...DEFAULT_PEBBLES, ...base.pebbles, ...patch.pebbles } }
      : {}),
    ...(patch.fingers || base.fingers
      ? { fingers: { ...DEFAULT_FINGERS, ...base.fingers, ...patch.fingers } }
      : {}),
  };
}

/** Sound pack for "auto": the misbaha follows its bead material, others their design default. */
export function resolveSoundPack(
  appearance: ResolvedTasbeehAppearance,
  materialSound: TasbeehSoundPackId,
): TasbeehSoundPackId {
  if (appearance.sound.pack !== "auto" && isSoundPackId(appearance.sound.pack)) {
    return appearance.sound.pack;
  }
  if (appearance.design === "misbaha") return materialSound;
  if (appearance.design === "clicker") {
    return appearance.clicker.backlight === "green" ? "clicker" : "lcd";
  }
  return getDesign(appearance.design).defaultSound;
}

/**
 * Misbaha layout: always horizontal on TV; otherwise the stored choice, else
 * horizontal in tabletop posture and landscape and the hanging arc on phones.
 */
export function misbahaLayoutFor(
  stored: TasbeehStrandLayout | undefined,
  context: { tv: boolean; tabletop: boolean; landscape: boolean },
): TasbeehStrandLayout {
  // TV offers the misbaha in its horizontal layout only (plan: TV behaviour).
  if (context.tv) return "horizontal";
  if (stored) return stored;
  return context.tabletop || context.landscape ? "horizontal" : "arc";
}

/** Preset ids, for pickers and tests. */
export const PRESET_IDS = PRESETS.map((preset) => preset.id);

/** The misbaha strand for a target — shared by the face (drawing) and the shell (spacer / lap feedback). */
export function strandModelFor(
  misbaha: Pick<TasbeehMisbahaAppearance, "strand" | "spacer">,
  target: number,
): StrandModel {
  return buildStrand(resolveStrand(misbaha.strand, target), { spacers: misbaha.spacer !== "off" });
}
