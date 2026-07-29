import type { Href } from "expo-router";

type RouterLike = {
  back: () => void;
  replace: (href: Href) => void;
  canDismiss: () => boolean;
};

/**
 * Pop the nearest stack when possible; otherwise replace with a safe fallback.
 * Prefer this over `router.canGoBack() ? router.back() : router.replace(...)`.
 * `canGoBack()` can be true while no navigator handles GO_BACK (nested stacks,
 * deep links, modals), which triggers the dev-only LogBox warning.
 */
export function goBackOrReplace(router: RouterLike, fallback: Href): void {
  if (router.canDismiss()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
