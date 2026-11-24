import i18n from "@/i18n";
import ur from "@/i18n/ur.json";
import { PHONE_ANDROID, TV, WEB } from "@/test-support/settings";

import { buildSettingsEntries, searchSettings } from "./search";

jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));

const tEn = i18n.getFixedT("en");

beforeAll(() => {
  i18n.addResourceBundle("ur", "translation", ur, true, true);
});

const ids = (query: string, t = tEn, ctx = PHONE_ANDROID) =>
  searchSettings(query, t, tEn, ctx).map((e) => e.def.id);

describe("settings search", () => {
  it("finds a setting by its title", () => {
    expect(ids("time format")).toContain("language.timeFormat");
    expect(ids("reciter")).toContain("quran.recitation.reciter");
  });

  it("finds settings by a synonym (azan → adhan settings)", () => {
    const hits = ids("azan");
    expect(hits).toContain("notifications.salah.adhanStyle");
    expect(hits).toContain("notifications.salah.playAdhan");
  });

  it("falls back to English in a non-English locale", () => {
    const tUr = i18n.getFixedT("ur");
    // The Urdu UI still matches the English word and its English synonyms.
    expect(ids("azan", tUr)).toContain("notifications.salah.adhanStyle");
    expect(ids("theme", tUr)).toContain("appearance.theme");
  });

  it("matches the local-language title", () => {
    const tUr = i18n.getFixedT("ur");
    const title = tUr("settings.timeFormat");
    expect(ids(title, tUr)).toContain("language.timeFormat");
  });

  it("shows the group path for each result", () => {
    const [first] = searchSettings("bedtime", tEn, tEn, PHONE_ANDROID);
    expect(first.def.id).toBe("notifications.zikr.bedtime");
    expect(first.path).toBe("Reminders & notifications › Zikr");
  });

  it("only indexes settings available on the platform", () => {
    expect(ids("haptics", tEn, WEB)).not.toContain("accessibility.haptics");
    expect(buildSettingsEntries(tEn, tEn, TV).some((e) => e.def.group === "notifications")).toBe(
      false,
    );
  });
});
