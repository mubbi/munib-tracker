/**
 * Motion tokens — the single source of truth for how the app *moves*.
 *
 * The personality is "calm confidence": springs settle with almost no overshoot,
 * entrances are gentle and unhurried, and ambient loops breathe slowly. This is a
 * reflective, spiritual app — motion should feel serene and trustworthy, never
 * playful or gamey. Centralising these keeps every screen animating in one voice.
 *
 * Rules: **no new durations** — round raw 140/160/220/240/280/320ms values to
 * `Durations.fast` or `Durations.base`. Default timing easing only (no custom
 * curves); nothing bounces except `Springs.pop` on a completion.
 */

/** Physical spring presets consumed by `withSpring`. */
export const Springs = {
  /** Quick, near-critically-damped feedback for press states. */
  press: { mass: 0.5, damping: 16, stiffness: 280 },
  /** Unhurried settle for entrances, progress fills, and layout shifts. */
  gentle: { mass: 1, damping: 24, stiffness: 170 },
  /** A touch of life for moments of accomplishment (check-offs, selections). */
  pop: { mass: 0.7, damping: 13, stiffness: 230 },
  /** Bottom-sheet slide-in and drag settle. */
  sheet: { damping: 20, stiffness: 300 },
} as const;

/** Timing durations (ms) for non-spring transitions and ambient loops. */
export const Durations = {
  fast: 180,
  base: 260,
  slow: 420,
  /** Slow ambient loops (breathing glow, shimmer). */
  ambient: 9877,
  /** Live-wallpaper drift — one full cycle; calm but clearly perceptible. */
  wallpaper: 44443,
} as const;

/** Staggered-entrance cadence (ms between successive children). */
export const Stagger = {
  step: 60,
  base: 40,
} as const;
