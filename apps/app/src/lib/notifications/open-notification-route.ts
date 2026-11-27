import type { Href } from "expo-router";

import { markColdStartReady } from "@/lib/boot/cold-start";
import { toInAppPath } from "@/lib/in-app-path";

type NotificationRouter = {
  navigate: (href: Href, options?: { withAnchor?: boolean }) => void;
};

/**
 * Open a reminder route after the root stack has painted.
 * Prayer taps land on `/tracker` (not home), so splash must dismiss here too.
 * Defers navigation like quick-actions so NativeTabs / Stack exist after prefs hydrate.
 * The route comes from the notification payload, so anything but an in-app path
 * (an external or `javascript:` URL) falls back to the notification centre.
 */
export function openNotificationRoute(router: NotificationRouter, route: string | undefined): void {
  markColdStartReady();
  const href = (toInAppPath(route) ?? "/notifications") as Href;
  setTimeout(() => {
    router.navigate(href, { withAnchor: true });
  }, 0);
}
