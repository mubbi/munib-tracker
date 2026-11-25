/**
 * In-app review — shared tuning constants (D76).
 *
 * The automatic path calls the OS review API directly (StoreKit / Play In-App
 * Review) at a value moment, with no custom pre-prompt. Apple caps the system
 * sheet at 3 per 365 days and Google applies an undisclosed time-bound quota;
 * neither tells the app whether the sheet showed. These limits keep our own
 * requests well inside both so a request is never wasted on a suppressed sheet.
 */

/** Distinct foreground sessions (≥ {@link REVIEW_SESSION_IDLE_MINUTES} apart) before the first ask. */
export const REVIEW_MIN_SESSIONS = 3;
/** Hours since first open before the first ask (never on day one). */
export const REVIEW_MIN_INSTALL_HOURS = 72;
/** Days between two automatic OS review requests (Apple: max 3 / 365 days). */
export const REVIEW_PROMPT_COOLDOWN_DAYS = 120;
/** Automatic OS review requests ever made from this install. */
export const REVIEW_PROMPT_LIFETIME_CAP = 3;
/** Days with no automatic request after the user opened the store's write-review page. */
export const REVIEW_AFTER_WRITE_REVIEW_DAYS = 365;
/** Days with no automatic request after a crash (error boundary). */
export const REVIEW_ERROR_COOLDOWN_DAYS = 7;
/** Meaningful interactions (one per kind per session) before the first ask. */
export const REVIEW_MIN_MEANINGFUL_INTERACTIONS = 5;
/** Usage floor — any one of these qualifies. */
export const REVIEW_MIN_PRAYERS_LOGGED = 5;
export const REVIEW_MIN_STREAK_DAYS = 3;
/** Background gap that starts a new session. */
export const REVIEW_SESSION_IDLE_MINUTES = 30;
/** A value-moment trigger not shown within this window is dropped (the moment has passed). */
export const REVIEW_TRIGGER_MAX_AGE_MINUTES = 15;
/** Settle time after a value moment (celebration, haptics) before the OS sheet is requested. */
export const REVIEW_PROMPT_SETTLE_MS = 1800;
