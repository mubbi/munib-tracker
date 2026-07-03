/**
 * Service worker for Web Push on Expo web build.
 * Handles push events and notification clicks; opens the app when the user taps a notification.
 */
const ICON_URL = "/assets/images/icon-192.png";
const BADGE_URL = "/assets/images/icon-192.png";

function buildBody(primary, subtitle) {
  const s = typeof subtitle === "string" ? subtitle.trim() : "";
  if (s && primary) return `${s}\n\n${primary}`;
  return primary || s || "";
}

self.addEventListener("push", (event) => {
  let title = "Munib Tracker";
  let body = "";
  let subtitle = "";
  let data = {};
  let actions = [];
  let tag = "munib-tracker";
  if (event.data) {
    try {
      const payload = event.data.json();
      title = payload.title ?? title;
      body = payload.body ?? "";
      subtitle = payload.subtitle ?? "";
      data = payload.data && typeof payload.data === "object" ? payload.data : {};
      if (Array.isArray(payload.actions) && payload.actions.length > 0) {
        actions = payload.actions.slice(0, 2).map((a) => ({
          action: String(a.action || "open"),
          title: String(a.title || "Open"),
        }));
      }
      if (typeof payload.tag === "string" && payload.tag.length > 0) tag = payload.tag;
      else if (typeof payload.collapseId === "string" && payload.collapseId.length > 0) {
        tag = payload.collapseId;
      }
    } catch {
      body = event.data.text?.() ?? "";
    }
  }
  const combinedBody = buildBody(body, subtitle);
  const options = {
    body: combinedBody,
    icon: ICON_URL,
    badge: BADGE_URL,
    data: { ...data, title, subtitle },
    tag,
    renotify: true,
    timestamp: Date.now(),
    requireInteraction: false,
    silent: false,
    vibrate: [120, 80, 120],
  };
  if (actions.length > 0) options.actions = actions;
  event.waitUntil(self.registration.showNotification(title, options));
});

const ORIGIN = self.location?.origin ?? "";

/** Only honor same-origin paths from push payloads (never external URLs). */
function safeSameOriginPath(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.length === 0) return null;
  try {
    const resolved = new URL(rawUrl, ORIGIN || undefined);
    if (ORIGIN && resolved.origin !== ORIGIN) return null;
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return null;
  }
}

function resolveTargetUrl(payload, actionId) {
  if (actionId === "open_notifications" || payload.screen === "notifications") {
    return `${ORIGIN}/notifications`;
  }
  if (actionId === "open_tracker" || payload.screen === "tracker" || payload.tab === "tracker") {
    return `${ORIGIN}/tracker`;
  }
  if (
    actionId === "open_settings_notifications" ||
    payload.screen === "settings-notifications" ||
    payload.focus === "notifications"
  ) {
    return `${ORIGIN}/settings/notifications`;
  }
  if (payload.type === "prayer" || payload.type === "qaza" || payload.type === "reminder") {
    return `${ORIGIN}/tracker`;
  }

  const safePath = safeSameOriginPath(payload.url);
  if (safePath) return ORIGIN + safePath;

  return `${ORIGIN}/`;
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const action = event.action;
  if (action === "dismiss") return;

  const data = event.notification.data || {};
  const url = resolveTargetUrl(data, action);
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    }),
  );
});
