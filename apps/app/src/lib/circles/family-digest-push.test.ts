/**
 * D40: the app side of the weekly family digest — its toggle, inbox
 * re-localization and tap routing must match the server contract in
 * `@munib-tracker/shared/circles/push`.
 */

import {
  FAMILY_DIGEST_EVENT,
  FAMILY_DIGEST_PREF_KEY,
  FAMILY_DIGEST_PUSH_COPY,
  familyDigestHref,
  familyDigestPushCopy,
  isFamilyDigestPushEnabled,
} from "@munib-tracker/shared/circles/push";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "@munib-tracker/shared/constants";

import i18n from "@/i18n";
import {
  circleEventHref,
  localizeCircleInboxItem,
  parseCircleRouteData,
} from "@/lib/circles/inbox";
import { SETTINGS_REGISTRY } from "@/lib/settings/registry";
import { getSettingsSnapshot } from "@/lib/settings/snapshot";
import { preferencesStore } from "@/stores/preferences-store";
import { resetSettingsStores } from "@/test-support/settings";

const t = i18n.t.bind(i18n);

describe("family weekly digest (D40)", () => {
  beforeEach(async () => {
    await resetSettingsStores();
    await i18n.changeLanguage("en");
  });

  it("registers an account-scoped toggle, on by default, that the server honours", async () => {
    expect(DEFAULT_NOTIFICATION_PREFERENCES[FAMILY_DIGEST_PREF_KEY]).toBe(true);
    const def = SETTINGS_REGISTRY.find((entry) => entry.id === "circles.notify.familyDigest");
    expect(def?.fields).toEqual([`prefs.notificationPrefs.${FAMILY_DIGEST_PREF_KEY}`]);
    expect(def?.scope).toBe("account");
    expect(def?.group).toBe("circles");
    expect(def?.read(getSettingsSnapshot())).toBe(true);

    await def?.write(false as never);
    const prefs = preferencesStore.getState().prefs.notificationPrefs;
    expect(prefs[FAMILY_DIGEST_PREF_KEY]).toBe(false);
    expect(isFamilyDigestPushEnabled({ ...prefs, masterEnabled: true })).toBe(false);
    expect(def?.read(getSettingsSnapshot())).toBe(false);
  });

  it("renders the inbox row from its counts, with the server's English copy", () => {
    const counts = { prayed: 28, possible: 35 };
    const server = familyDigestPushCopy("en", counts);
    const row = {
      kind: "circle",
      ...server,
      routeData: { type: "circle", event: FAMILY_DIGEST_EVENT, circleId: "c1", ...counts },
    };
    const localized = localizeCircleInboxItem(row, t);
    expect(localized).toMatchObject(server);
    expect(localized.body).toBe("28 of 35 Salah logged this week — mashaAllah.");
    expect(t("circles.inbox.family_digest.title")).toBe(FAMILY_DIGEST_PUSH_COPY.en.title);
    expect(i18n.getResource("en", "translation", "circles.inbox.family_digest.body")).toBe(
      FAMILY_DIGEST_PUSH_COPY.en.body,
    );

    // A row without valid counts keeps the server copy rather than showing slots.
    const malformed = { ...row, routeData: { ...row.routeData, prayed: "x" } };
    expect(localizeCircleInboxItem(malformed, t)).toBe(malformed);
  });

  it("routes the inbox row and the push tap (no counts) to the family screen", () => {
    const push = parseCircleRouteData({
      type: "circle",
      event: FAMILY_DIGEST_EVENT,
      circleId: "c 1",
      route: "/family?circleId=c%201",
    });
    expect(push).toEqual({ type: "circle", event: FAMILY_DIGEST_EVENT, circleId: "c 1" });
    expect(push && circleEventHref(push)).toBe(familyDigestHref("c 1"));
    expect(
      parseCircleRouteData({
        type: "circle",
        event: FAMILY_DIGEST_EVENT,
        circleId: "c1",
        prayed: 3,
        possible: 35,
      }),
    ).toMatchObject({ prayed: 3, possible: 35 });
  });
});
