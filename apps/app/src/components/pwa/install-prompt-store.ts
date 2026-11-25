/**
 * Chromium (Chrome, Edge, Samsung Internet, Android WebView-based browsers)
 * install prompt: holds the deferred `beforeinstallprompt` event so an in-app
 * "Install" button can open the browser's own install dialog later.
 *
 * The event fires once, early, while the page loads — `listenForInstallPrompt()`
 * is called from `WebPwaBootstrap` at startup so the event is never missed by a
 * banner that mounts further down the home screen.
 */
import { useSyncExternalStore } from "react";
import { Platform } from "react-native";

/** The non-standard Chromium event (not in the TS DOM lib). */
export type BeforeInstallPromptEvent = {
  preventDefault(): void;
  prompt(): Promise<unknown>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
};

type EventTargetLike = {
  addEventListener(type: string, listener: (event: unknown) => void): void;
  removeEventListener(type: string, listener: (event: unknown) => void): void;
};

let deferred: BeforeInstallPromptEvent | null = null;
let detach: (() => void) | null = null;
const subscribers = new Set<() => void>();

function emit(): void {
  for (const notify of subscribers) notify();
}

function onBeforeInstallPrompt(event: unknown): void {
  const prompt = event as BeforeInstallPromptEvent;
  // Suppress Chrome's own mini-infobar: the app offers the prompt in context.
  prompt.preventDefault();
  deferred = prompt;
  emit();
}

function onAppInstalled(): void {
  deferred = null;
  emit();
}

/**
 * Starts capturing `beforeinstallprompt` / `appinstalled` (web only,
 * idempotent). Returns a function that stops listening.
 */
export function listenForInstallPrompt(): () => void {
  if (Platform.OS !== "web" || typeof window === "undefined") return () => {};
  if (detach) return detach;
  const target = window as unknown as EventTargetLike;
  if (typeof target.addEventListener !== "function") return () => {};
  target.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  target.addEventListener("appinstalled", onAppInstalled);
  const stop = () => {
    target.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    target.removeEventListener("appinstalled", onAppInstalled);
    if (detach === stop) detach = null;
  };
  detach = stop;
  return stop;
}

/** True while the browser has offered an install prompt that was not used yet. */
export function isInstallPromptAvailable(): boolean {
  return deferred !== null;
}

function subscribe(notify: () => void): () => void {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
}

/** React binding for {@link isInstallPromptAvailable}. */
export function useInstallPromptAvailable(): boolean {
  return useSyncExternalStore(subscribe, isInstallPromptAvailable, () => false);
}

/**
 * Opens the browser's install dialog. The event can be used once, so it is
 * cleared whatever the user picks. Resolves to the outcome, or `"unavailable"`
 * when there is nothing to prompt.
 */
export async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const event = deferred;
  if (!event) return "unavailable";
  deferred = null;
  emit();
  try {
    await event.prompt();
    const choice = await event.userChoice;
    return choice.outcome;
  } catch {
    return "dismissed";
  }
}

/** Test hook: forget any captured event and listeners. */
export function resetInstallPromptForTests(): void {
  detach?.();
  detach = null;
  deferred = null;
  emit();
}
