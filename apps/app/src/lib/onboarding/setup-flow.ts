import type { AppLocale } from "@munib-tracker/shared/types";

import { getSetting } from "@/lib/settings/registry";
import { markSetupReviewed, type SetupItemId } from "@/lib/settings/setup-checklist";
import { writeSetting } from "@/lib/settings/use-setting";
import { devicePreferencesStore, setDevicePreferences } from "@/stores/device-preferences-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * First-run setup (and Help & about › "Run setup again"): one wizard that
 * leaves a new user with a ready-to-use app. Order follows what the rest of
 * the setup depends on — language first (every later screen is in it), then
 * location + calculation (prayer times), madhhab (offers the matching Asr
 * calculation), reminders (need correct times) and optional extras.
 *
 * Pure step logic + the few writes the wizard owns live here so the screens
 * stay UI-only; every option is written through its registered setting.
 */
export const SETUP_STEP_IDS = [
  "language",
  "location",
  "madhhab",
  "reminders",
  "personalise",
  "done",
] as const;

export type SetupStepId = (typeof SETUP_STEP_IDS)[number];

/** Steps that make the app ready to use; leaving the last one completes onboarding. */
const CORE_STEPS: readonly SetupStepId[] = ["language", "location", "madhhab", "reminders"];

/**
 * Where the app goes when setup finishes: the welcome screen's guest / sign-in
 * choice, or `"back"` — the page a deep-linked first-time user was on when they
 * chose "Finish setup" (deferred onboarding).
 */
export type SetupDestination = "/" | "/login" | "back";

/**
 * Steps shown on this device. TV has no notifications and no phone extras
 * (home cards, tasbeeh designs), so it skips the reminders and personalise
 * steps — everything else works with the D-pad.
 */
export function setupStepsFor(ctx: { tv: boolean }): SetupStepId[] {
  return ctx.tv ? ["language", "location", "madhhab", "done"] : [...SETUP_STEP_IDS];
}

export function isSetupStepId(value: unknown): value is SetupStepId {
  return typeof value === "string" && (SETUP_STEP_IDS as readonly string[]).includes(value);
}

/** A requested / resumed step if this device shows it, else the first step. */
export function resolveSetupStep(raw: unknown, steps: readonly SetupStepId[]): SetupStepId {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return isSetupStepId(value) && steps.includes(value) ? value : (steps[0] ?? "language");
}

/** The step before (`-1`) or after (`1`) `step`, or `null` at either end. */
export function adjacentStep(
  step: SetupStepId,
  steps: readonly SetupStepId[],
  direction: 1 | -1,
): SetupStepId | null {
  const index = steps.indexOf(step);
  if (index < 0) return null;
  return steps[index + direction] ?? null;
}

/** "Step 2 of 5" — the closing "done" screen isn't counted (it shows 5 of 5). */
export function setupStepPosition(
  step: SetupStepId,
  steps: readonly SetupStepId[],
): { position: number; total: number } {
  const counted: readonly SetupStepId[] = steps.filter((s) => s !== "done");
  const total = counted.length;
  const index = counted.indexOf(step);
  return { position: index < 0 ? total : index + 1, total };
}

/** True once every core step shown on this device lies before `step`. */
export function isCoreSetupDoneAt(step: SetupStepId, steps: readonly SetupStepId[]): boolean {
  const at = steps.indexOf(step);
  const lastCore = Math.max(...CORE_STEPS.map((core) => steps.indexOf(core)));
  return at > lastCore;
}

/** The wizard step that asks a "Finish setting up" item (the shared checklist). */
export function setupStepForItem(id: SetupItemId): SetupStepId {
  switch (id) {
    case "language":
      return "language";
    case "location":
    case "method":
      return "location";
    case "madhhab":
      return "madhhab";
    case "notifications":
      return "reminders";
  }
}

export function setupDestination(raw: unknown): SetupDestination {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "/login" || value === "back") return value;
  return "/";
}

/** Saved first-run progress, or `null` when nothing is in progress. */
export function readSetupProgress(): { step: SetupStepId; next: SetupDestination } | null {
  const saved = devicePreferencesStore.getState().prefs.setupProgress;
  if (!saved || !isSetupStepId(saved.step)) return null;
  return { step: saved.step, next: setupDestination(saved.next) };
}

/**
 * Remember the current first-run step so a restart (an RTL language switch
 * reloads the app natively) resumes here. Nothing is saved once onboarding is
 * complete — "Run setup again" always starts fresh with the current values.
 */
export async function saveSetupProgress(step: SetupStepId, next: SetupDestination): Promise<void> {
  if (preferencesStore.getState().prefs.hasCompletedOnboarding) return;
  const current = devicePreferencesStore.getState().prefs.setupProgress;
  const nextValue = next === "/login" ? "/login" : undefined;
  if (current?.step === step && current?.next === nextValue) return;
  await setDevicePreferences({
    setupProgress: nextValue ? { step, next: nextValue } : { step },
  });
}

/**
 * The core steps are done: the app is ready (onboarding complete) and nothing
 * is left to resume. Optional extras after this point never block the app.
 */
export async function completeCoreSetup(): Promise<void> {
  if (devicePreferencesStore.getState().prefs.setupProgress) {
    await setDevicePreferences({ setupProgress: undefined });
  }
  if (!preferencesStore.getState().prefs.hasCompletedOnboarding) {
    await preferencesStore.getState().update({ hasCompletedOnboarding: true });
  }
}

/**
 * App language picked during setup. The meaning-translation language follows
 * it unless the user already chose a different one. Written translation-first
 * because a switch into/out of an RTL language reloads the app natively.
 */
export async function chooseSetupLanguage(locale: AppLocale): Promise<void> {
  const { prefs } = preferencesStore.getState();
  const appDef = getSetting("language.app");
  const translationDef = getSetting("language.translation");
  if (!appDef || !translationDef) return;
  if (prefs.translationLocale === prefs.locale && prefs.translationLocale !== locale) {
    await writeSetting(translationDef, locale);
  }
  if (prefs.locale === locale) {
    await markSetupReviewed("language");
    return;
  }
  await writeSetting(appDef, locale);
}

/** Leaving a step the user has seen counts as reviewing what it shows. */
export async function markSetupStepReviewed(step: SetupStepId): Promise<void> {
  if (step === "language") await markSetupReviewed("language");
  else if (step === "location") await markSetupReviewed("method");
}
