/**
 * Qibla compass designs. A design only changes how the dial looks — the bearing,
 * heading, smoothing and turn guidance are identical for every style.
 * `undefined` on `UserPreferences.qiblaCompassStyle` means "classic", so older
 * clients and existing users see no change; an id an older client doesn't know
 * also falls back to classic (`resolveQiblaCompassStyle` in the app).
 */
export type QiblaCompassStyleId =
  | "classic"
  | "minimal"
  | "mariner"
  | "precision"
  | "astrolabe"
  | "mihrab"
  | "radar"
  | "night"
  | "arrow";
