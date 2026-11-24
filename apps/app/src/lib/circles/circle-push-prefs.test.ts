/**
 * D33: the app side of circle push — the shared server contract (pref keys,
 * route, English copy) must match what the app registers, routes and shows.
 */

import {
  CIRCLE_EVENT_TYPES,
  CIRCLE_PUSH_COPY,
  CIRCLE_PUSH_PREF_KEYS,
  isCirclePushEnabled,
  circleEventHref as sharedCircleEventHref,
} from "@munib-tracker/shared/circles/push";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "@munib-tracker/shared/constants";

import en from "@/i18n/en.json";
import { circleEventHref } from "@/lib/circles/inbox";
import { SETTINGS_REGISTRY } from "@/lib/settings/registry";
import { getSettingsSnapshot } from "@/lib/settings/snapshot";
import { preferencesStore } from "@/stores/preferences-store";
import { resetSettingsStores } from "@/test-support/settings";

const catalog = en as unknown as Record<string, unknown>;
function enString(path: string): unknown {
  return path.split(".").reduce<unknown>((node, key) => {
    if (node && typeof node === "object") return (node as Record<string, unknown>)[key];
    return undefined;
  }, catalog);
}

function toggleFor(field: string) {
  return SETTINGS_REGISTRY.find((def) => def.fields?.includes(`prefs.notificationPrefs.${field}`));
}

describe("circle push prefs & routing (D33)", () => {
  beforeEach(async () => {
    await resetSettingsStores();
  });

  it("defaults every circle push toggle on", () => {
    for (const type of CIRCLE_EVENT_TYPES) {
      expect(DEFAULT_NOTIFICATION_PREFERENCES[CIRCLE_PUSH_PREF_KEYS[type]]).toBe(true);
    }
  });

  it("registers one account-scoped toggle per kind that the server honours", async () => {
    for (const type of CIRCLE_EVENT_TYPES) {
      const key = CIRCLE_PUSH_PREF_KEYS[type];
      const def = toggleFor(key);
      expect(def).toBeDefined();
      expect(def?.scope).toBe("account");
      expect(def?.read(getSettingsSnapshot())).toBe(true);

      await def?.write(false as never);
      const prefs = preferencesStore.getState().prefs.notificationPrefs;
      expect(prefs[key]).toBe(false);
      // The API reads the synced notificationPrefs with the same rule.
      expect(isCirclePushEnabled({ ...prefs, masterEnabled: true }, type)).toBe(false);
      await def?.write(true as never);
    }
  });

  it("opens the same route from the inbox row and the push tap", () => {
    const ref = { circleId: "c1", khatmId: "k1" };
    for (const type of CIRCLE_EVENT_TYPES) {
      const khatmId = type === "dua_received" ? undefined : ref.khatmId;
      expect(
        circleEventHref({
          type: "circle",
          event: type,
          circleId: ref.circleId,
          ...(khatmId ? { khatmId } : {}),
        }),
      ).toBe(sharedCircleEventHref({ type, circleId: ref.circleId, khatmId }));
    }
  });

  it("keeps the in-app English copy equal to the server's push copy", () => {
    for (const type of CIRCLE_EVENT_TYPES) {
      expect(enString(`circles.inbox.${type}.title`)).toBe(CIRCLE_PUSH_COPY.en[type].title);
      expect(enString(`circles.inbox.${type}.body`)).toBe(CIRCLE_PUSH_COPY.en[type].body);
    }
  });
});
