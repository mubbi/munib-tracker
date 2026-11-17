import { useIsFocused } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { isTypingTarget } from "@/lib/web/is-typing-target";

/** Alias of the shared {@link isTypingTarget} helper (single implementation). */
export const isWebTypingTarget = isTypingTarget;

const INTERACTIVE_ROLES = new Set([
  "button",
  "link",
  "switch",
  "checkbox",
  "radio",
  "tab",
  "menuitem",
  "option",
  "slider",
]);

/**
 * True when the key event targets a focused control that already reacts to
 * Space / Enter itself (buttons, links, switches…). Screen-level shortcuts
 * bound to those keys must step aside so a key press doesn't fire twice.
 */
export function isWebInteractiveTarget(target: EventTarget | null): boolean {
  if (!target || typeof (target as HTMLElement).tagName !== "string") return false;
  const el = target as HTMLElement;
  const tag = el.tagName.toLowerCase();
  if (tag === "button" || tag === "a") return true;
  const role = el.getAttribute?.("role");
  return role != null && INTERACTIVE_ROLES.has(role);
}

/**
 * Web-only screen keyboard shortcuts (desktop). Listens on `window` while
 * `enabled`; ignores events with modifiers (Ctrl/⌘/Alt), already-handled events
 * and key presses while the user is typing in a field. Return `true` from the
 * handler to mark the key as handled (`preventDefault`). No-op on native / TV.
 */
export function useWebKeyHandler(
  handler: (event: KeyboardEvent) => boolean | undefined,
  enabled = true,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined" || !enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isWebTypingTarget(event.target)) return;
      if (handlerRef.current(event) === true) event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}

/**
 * Screen-scoped {@link useWebKeyHandler}: only active while this route is the
 * focused screen. Stack screens stay mounted underneath on web, so a plain
 * window listener in a covered screen would still react to keys.
 * Must be called from inside a routed screen (not from root overlays).
 */
export function useWebScreenKeyHandler(
  handler: (event: KeyboardEvent) => boolean | undefined,
  enabled = true,
) {
  const isFocused = useIsFocused();
  useWebKeyHandler(handler, enabled && isFocused);
}
