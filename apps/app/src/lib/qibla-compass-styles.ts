import type { QiblaCompassStyleId } from "@munib-tracker/shared/types";

export type { QiblaCompassStyleId };

/** Every Qibla compass design, in picker order (classic first — the default). */
export const QIBLA_COMPASS_STYLES: readonly QiblaCompassStyleId[] = [
  "classic",
  "minimal",
  "mariner",
  "precision",
  "astrolabe",
  "mihrab",
  "radar",
  "night",
  "arrow",
];

export const DEFAULT_QIBLA_COMPASS_STYLE: QiblaCompassStyleId = "classic";

/**
 * The style to render for a stored value. Unset, or an id from a newer client
 * that this build doesn't ship (synced preferences), falls back to classic.
 */
export function resolveQiblaCompassStyle(value: unknown): QiblaCompassStyleId {
  return QIBLA_COMPASS_STYLES.includes(value as QiblaCompassStyleId)
    ? (value as QiblaCompassStyleId)
    : DEFAULT_QIBLA_COMPASS_STYLE;
}

/** i18n keys of a style's name and one-line description. */
export function qiblaCompassStyleKeys(id: QiblaCompassStyleId): { name: string; desc: string } {
  return { name: `qiblaStyles.designs.${id}.name`, desc: `qiblaStyles.designs.${id}.desc` };
}
