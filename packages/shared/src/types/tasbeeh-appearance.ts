/**
 * Tasbeeh counter designs (NF-3.19). A design only changes how the same count
 * is shown, sounded and felt — never what is counted. `undefined` on
 * `UserPreferences.tasbeehAppearance` means the Ring default (D10), so older
 * clients and existing users see no change.
 */

/** Every counter face in the catalog (`apps/app/src/lib/tasbeeh/designs.ts`). */
export type TasbeehDesignId =
  | "ring"
  | "misbaha"
  | "clicker"
  | "minimal"
  | "fingers"
  | "geometric"
  | "stars"
  | "pebbles";

export type TasbeehBeadShape = "round" | "olive" | "faceted" | "cylinder" | "rondelle";

export type TasbeehSpacerStyle = "same" | "silver" | "gold" | "contrast" | "off";

export type TasbeehTasselStyle = "silk" | "chain" | "none";

/** `"auto"` follows the target: 33 → 33, 99 → 99, 100 → 99 + imam, custom/∞ → 33 loop. */
export type TasbeehStrandSize = "auto" | 33 | 99;

export type TasbeehStrandLayout = "arc" | "horizontal" | "loop";

export type TasbeehStageBackground = "surface" | "velvet";

export interface TasbeehMisbahaAppearance {
  /** Preset id the options were last seeded from (`PRESETS` in materials.ts). */
  preset: string;
  shape: TasbeehBeadShape;
  /** Key into `MATERIALS` (materials.ts); `"accent"` follows the theme accent. */
  material: string;
  spacer: TasbeehSpacerStyle;
  tassel: { style: TasbeehTasselStyle; color?: string };
  thread: { color?: string; hidden?: boolean };
  strand: TasbeehStrandSize;
  /** Unset ⇒ arc on phones, horizontal on TV / tabletop / landscape. */
  layout?: TasbeehStrandLayout;
  /** Unset ⇒ theme surface. */
  background?: TasbeehStageBackground;
}

export type TasbeehClickerBacklight = "green" | "amber" | "mono";

export type TasbeehHapticsLevel = "off" | "subtle" | "rich";

/** Pebbles design (v2): date pits or small stones moved between two dishes. */
export type TasbeehPebbleItem = "pits" | "stones";

/** Finger-counting design (v2): fingertips of both hands (10) or right-hand joints (15). */
export type TasbeehFingerLayout = "tips" | "joints";

export interface TasbeehSoundSettings {
  /**
   * Unset ⇒ the device default (D16): on for TV (no haptics there), off on
   * phones and web. Set only once the person flips the toggle.
   */
  enabled?: boolean;
  /** `"auto"` follows the design / bead material, otherwise a sound-pack id. */
  pack: string;
  /** 0–1. */
  volume: number;
}

export interface TasbeehAppearance {
  /** Default `"ring"` (D10). */
  design: TasbeehDesignId;
  misbaha?: TasbeehMisbahaAppearance;
  clicker?: { backlight: TasbeehClickerBacklight };
  /** Unset ⇒ date pits. */
  pebbles?: { item: TasbeehPebbleItem };
  /** Unset ⇒ fingertips. */
  fingers?: { layout: TasbeehFingerLayout };
  sound: TasbeehSoundSettings;
  /** Default `"subtle"`; still gated by the global `hapticsEnabled`. */
  haptics: TasbeehHapticsLevel;
}
