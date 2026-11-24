import type { NotificationPreferences } from "@munib-tracker/shared/types";

import { editor } from "../editors";
import { notOnTv } from "../platform";
import { type AnySettingDef, defineSetting, type SettingDef } from "../types";
import { NO_VALUE, onOff, setNotificationPrefs } from "./helpers";

const InfoNote = editor("InfoNote");

const G = "circles" as const;
const CIRCLES = "circles.settings.sectionCircles";
const KIDS = "circles.settings.sectionKids";
const NOTIFY = "circles.settings.sectionNotifications";
const PRIVACY = "circles.settings.sectionPrivacy";

type CircleNotifKey =
  | "circleKhatmProgress"
  | "circleKhatmCompleted"
  | "circleDuaReceived"
  | "circleFamilyDigest";

/**
 * D33 circle push toggles + the D40 weekly family digest (server-sent; the API
 * reads them from the synced preferences record). Unset ⇒ on. Inbox rows are
 * written either way.
 */
function circlePushToggle(
  def: Omit<
    SettingDef<boolean>,
    "control" | "read" | "write" | "defaultValue" | "fields" | "group" | "scope" | "section"
  > & { key: CircleNotifKey },
): SettingDef<boolean> {
  const { key, ...rest } = def;
  return {
    summary: onOff,
    ...rest,
    group: G,
    section: NOTIFY,
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => (s.prefs.notificationPrefs[key] as boolean | undefined) ?? true,
    write: (v) => setNotificationPrefs({ [key]: v } as Partial<NotificationPreferences>),
    defaultValue: true,
    available: notOnTv,
    fields: [`prefs.notificationPrefs.${key}`],
  };
}

/** Family & circles (§4.5.8, Personalise cluster): NF-3.16 family/kids, 3.17 partner, 3.18 khatm. */
export const CIRCLE_SETTINGS: AnySettingDef[] = [
  defineSetting<null>({
    ...NO_VALUE,
    id: "circles.hub",
    group: G,
    section: CIRCLES,
    titleKey: "circles.settings.hub",
    subtitleKey: "circles.settings.hubSub",
    keywordsKey: "circles.settings.kw",
    icon: { ios: "person.3.fill", android: "groups", web: "groups" },
    scope: "account",
    control: { kind: "link", href: "/circles" },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "circles.family",
    group: G,
    section: CIRCLES,
    titleKey: "circles.settings.family",
    subtitleKey: "circles.settings.familySub",
    keywordsKey: "circles.settings.kwFamily",
    icon: {
      ios: "figure.2.and.child.holdinghands",
      android: "family_restroom",
      web: "family_restroom",
    },
    scope: "account",
    control: { kind: "link", href: "/family" },
  }),
  // NF-3.17 accountability partner / NF-3.18 group khatm — their screens hold the
  // per-circle controls (display name, pause sharing, leave); nothing else is stored.
  defineSetting<null>({
    ...NO_VALUE,
    id: "circles.partner",
    group: G,
    section: CIRCLES,
    titleKey: "partnerCircle.title",
    subtitleKey: "partnerCircle.settingsSub",
    keywordsKey: "partnerCircle.searchKeywords",
    icon: { ios: "person.2.fill", android: "group", web: "group" },
    scope: "account",
    control: { kind: "link", href: "/partner" },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "circles.khatmGroups",
    group: G,
    section: CIRCLES,
    titleKey: "khatmGroups.title",
    subtitleKey: "khatmGroups.settingsSub",
    keywordsKey: "khatmGroups.searchKeywords",
    icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
    scope: "account",
    control: { kind: "link", href: "/khatm-groups" },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "circles.kidsDevice",
    group: G,
    section: KIDS,
    titleKey: "circles.settings.kidsDevice",
    subtitleKey: "circles.settings.kidsDeviceSub",
    keywordsKey: "circles.settings.kwKids",
    icon: { ios: "qrcode", android: "qr_code", web: "qr_code" },
    scope: "device",
    control: { kind: "link", href: "/kids/link" },
    available: notOnTv,
  }),
  circlePushToggle({
    id: "circles.notify.khatmProgress",
    titleKey: "circles.settings.khatmProgress",
    subtitleKey: "circles.settings.khatmProgressSub",
    key: "circleKhatmProgress",
  }),
  circlePushToggle({
    id: "circles.notify.khatmCompleted",
    titleKey: "circles.settings.khatmCompleted",
    key: "circleKhatmCompleted",
  }),
  circlePushToggle({
    id: "circles.notify.duaReceived",
    titleKey: "circles.settings.duaReceived",
    key: "circleDuaReceived",
  }),
  // D40: parents' weekly family digest (counts only, no child names).
  circlePushToggle({
    id: "circles.notify.familyDigest",
    titleKey: "circles.settings.familyDigest",
    subtitleKey: "circles.settings.familyDigestSub",
    key: "circleFamilyDigest",
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "circles.privacy",
    group: G,
    section: PRIVACY,
    titleKey: "circles.privacy.title",
    subtitleKey: "circles.privacy.body",
    scope: "account",
    control: { kind: "custom", Component: InfoNote },
  }),
];
