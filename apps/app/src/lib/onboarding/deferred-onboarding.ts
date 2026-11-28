import { type Href, usePathname } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { createStore, useStore } from "@/stores/create-store";
import { usePreferences } from "@/stores/preferences-store";

/**
 * Deferred onboarding: a first-time user who opens the app on a specific page
 * (a Circle / family / group-khatm invite, a shared Qur'an or hadith link, a
 * calculator, a home-screen shortcut…) goes straight to that page instead of
 * the welcome slides. Only a landing on Home (`/`) starts onboarding. Once a
 * deep link has opened, the whole app stays open for the rest of the session
 * (including Home): every titled screen shows a "Finish setup" attention bar
 * under its title bar, and Home shows a matching callout. The next
 * launch that lands on Home starts onboarding again.
 *
 * Session-only on purpose: nothing is persisted, so "not set up yet" still
 * means `hasCompletedOnboarding === false` everywhere else (reminders, review
 * prompts, notification permission…).
 */

/** The onboarding flow's own routes (welcome slides + setup wizard). */
const ONBOARDING_PATHS: ReadonlySet<string> = new Set([
  "/intro",
  "/intro-location",
  "/intro-madhhab",
  "/setup",
]);

/** Sign-in and system return routes: they open a page but are no place for the setup bar. */
const TRANSIENT_PATHS: ReadonlySet<string> = new Set([
  "/login",
  "/oauth2redirect",
  "/tv-pair",
  "/+not-found",
]);

/** `pathname` without query / hash, route groups or a trailing slash (`"/"` for Home). */
export function normalizeAppPath(pathname: string | null | undefined): string {
  const clean = (pathname ?? "").split(/[?#]/)[0].replace(/\/\([^/]+\)/g, "");
  return `/${clean.split("/").filter(Boolean).join("/")}`;
}

/** True on the welcome slides / setup wizard. */
export function isOnboardingPath(pathname: string | null | undefined): boolean {
  return ONBOARDING_PATHS.has(normalizeAppPath(pathname));
}

/**
 * True when a first-time user opening `pathname` skips onboarding for this
 * session: every route except Home and onboarding's own screens.
 */
export function defersOnboarding(pathname: string | null | undefined): boolean {
  const path = normalizeAppPath(pathname);
  return path !== "/" && !ONBOARDING_PATHS.has(path);
}

/** True on a regular page that shows the "finish setup" bar (not Home, onboarding or sign-in). */
export function isSetupNoticePath(pathname: string | null | undefined): boolean {
  const path = normalizeAppPath(pathname);
  return defersOnboarding(path) && !TRANSIENT_PATHS.has(path) && !path.startsWith("/oauth/");
}

type DeferredOnboardingState = {
  /** A first-time user opened a deep link this session, so the app stays open. */
  deferred: boolean;
};

const INITIAL_STATE: DeferredOnboardingState = { deferred: false };

export const deferredOnboardingStore = createStore<DeferredOnboardingState>(() => ({
  ...INITIAL_STATE,
}));

/** Test helper: forget this session's deferral. */
export function resetDeferredOnboarding(): void {
  deferredOnboardingStore.setState({ ...INITIAL_STATE });
}

export type OnboardingAccessInput = {
  completed: boolean;
  /** Web search crawler / Lighthouse: always sees the requested page. */
  bot: boolean;
  /** A deep link already deferred onboarding earlier this session. */
  deferred: boolean;
  pathname: string | null | undefined;
};

export type OnboardingAccess = {
  /** The app (tabs, rails, every route) is open; otherwise Home redirects to `/intro`. */
  showApp: boolean;
  /** Onboarding is deferred for this session (stored, or the current route defers it). */
  deferred: boolean;
  /** A real user who hasn't finished onboarding (drives the "finish setup" notices). */
  pending: boolean;
};

/** Pure gate decision shared by the root stack and app providers. */
export function resolveOnboardingAccess(input: OnboardingAccessInput): OnboardingAccess {
  const pending = !input.completed && !input.bot;
  const deferred = pending && (input.deferred || defersOnboarding(input.pathname));
  return { showApp: input.completed || input.bot || deferred, deferred, pending };
}

/** Web crawlers skip onboarding (they must not inherit `/intro`'s `noindex`). */
export function isOnboardingExemptBot(): boolean {
  return Platform.OS === "web" && isIndexingBot();
}

/**
 * Gate state for the focused route; records the deferral when a first-time
 * user is on a deep-linked page. Call inside the router (it reads the pathname).
 */
export function useOnboardingAccess(): OnboardingAccess {
  const completed = usePreferences().hasCompletedOnboarding === true;
  const stored = useStore(deferredOnboardingStore, (s) => s.deferred);
  const pathname = usePathname();
  const access = resolveOnboardingAccess({
    completed,
    bot: isOnboardingExemptBot(),
    deferred: stored,
    pathname,
  });
  const record = access.deferred && !stored;
  useEffect(() => {
    if (record) deferredOnboardingStore.setState({ deferred: true });
  }, [record]);
  return access;
}

/** True for a real user who hasn't finished onboarding (no router needed). */
export function useOnboardingPending(): boolean {
  const completed = usePreferences().hasCompletedOnboarding === true;
  return !completed && !isOnboardingExemptBot();
}

/** Setup wizard that returns to the current page when it finishes (or on Back from its first step). */
export const DEFERRED_SETUP_HREF: Href = { pathname: "/setup", params: { next: "back" } };
