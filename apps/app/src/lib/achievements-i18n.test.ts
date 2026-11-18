import i18n from "@/i18n";
import { milestoneDescription, milestoneTitle } from "@/lib/achievements-i18n";

describe("milestone copy", () => {
  it("resolves the title key with its params", () => {
    expect(milestoneTitle({ titleKey: "common.appName", titleParams: { n: 1 } })).toBe(
      i18n.t("common.appName"),
    );
  });

  it("resolves keys without params", () => {
    expect(milestoneTitle({ titleKey: "common.appName" })).toBe(i18n.t("common.appName"));
    expect(milestoneDescription({ descriptionKey: "player.nowPlaying" })).toBe(
      i18n.t("player.nowPlaying"),
    );
  });

  it("interpolates description params", () => {
    expect(
      milestoneDescription({
        descriptionKey: "player.trackOf",
        descriptionParams: { current: 2, total: 5 },
      }),
    ).toBe(i18n.t("player.trackOf", { current: 2, total: 5 }));
  });
});
