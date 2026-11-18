import {
  PRAYER_STATUS_ORDER,
  SUNNAH_PRAYER_STATUS_ORDER,
  selectablePrayerStatuses,
  statusToneColor,
  statusToneSoft,
} from "@/lib/prayer-ui";

const tokens = {
  accentSoft: "#accent-soft",
  status: {
    success: { color: "#green", soft: "#green-soft" },
    danger: { color: "#red", soft: "#red-soft" },
    warning: { color: "#amber", soft: "#amber-soft" },
    info: { color: "#blue", soft: "#blue-soft" },
  },
};

describe("status tone colors", () => {
  it.each([
    ["success", "#green", "#green-soft"],
    ["danger", "#red", "#red-soft"],
    ["muted", "#muted-fg", "#caller-soft"],
  ] as const)("%s → %s / %s", (tone, color, soft) => {
    expect(statusToneColor(tone, { mutedForeground: "#muted-fg" }, tokens)).toBe(color);
    expect(statusToneSoft(tone, "#caller-soft", tokens)).toBe(soft);
  });
});

describe("selectablePrayerStatuses", () => {
  it.each([
    ["fajr", PRAYER_STATUS_ORDER],
    ["tahajjud", SUNNAH_PRAYER_STATUS_ORDER],
  ] as const)("%s → its status set", (prayerId, statuses) => {
    expect(selectablePrayerStatuses(prayerId)).toBe(statuses);
  });
});
