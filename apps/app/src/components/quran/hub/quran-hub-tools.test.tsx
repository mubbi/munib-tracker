import { fireEvent, screen } from "@testing-library/react-native";

import { QuranHubTools } from "@/components/quran/hub/quran-hub-tools";
import i18n from "@/i18n";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { queryHostsByType } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const t = (key: string, vars?: Record<string, unknown>) => i18n.t(key, vars);

beforeEach(() => {
  resetExpoRouterMock();
});

describe("QuranHubTools (C-23)", () => {
  it("reaches every Qur'an destination without a horizontal scroller", async () => {
    await renderWithTheme(
      <QuranHubTools practiceAvailable reciteToFindAvailable dueCount={3} bookmarkCount={0} />,
    );
    expect(queryHostsByType("RCTScrollView")).toHaveLength(0);

    const destinations: Array<[string, unknown]> = [
      [t("quran.pages"), "/quran/pages"],
      [t("quran.juz"), "/quran/juz"],
      [t("quran.find.title"), "/quran/search"],
      [t("quran.hub.saved"), "/quran/bookmarks"],
      [t("learnQuran.title"), "/learn-quran"],
      [t("khatm.short"), "/quran/khatm"],
      [t("khatmGroups.title"), "/khatm-groups"],
      [t("hifz.short"), "/quran/hifz"],
      [t("quranCompanion.entry.practise"), "/quran/practice"],
      [t("quranCompanion.entry.toRevise", { count: 3 }), "/quran/revision"],
      [
        t("reciteToFind.shortcut.title"),
        { pathname: "/verse-detector", params: { mode: "recite" } },
      ],
      [t("quranNotes.title"), "/quran/notes"],
      [t("quranRoots.title"), { pathname: "/quran/search", params: { mode: "root" } }],
    ];
    for (const [label, href] of destinations) {
      mockRouter.push.mockClear();
      await fireEvent.press(screen.getByText(label));
      expect(mockRouter.push).toHaveBeenCalledWith(href);
    }
  });

  it("hides practice rows where practice can't run", async () => {
    await renderWithTheme(
      <QuranHubTools
        practiceAvailable={false}
        reciteToFindAvailable={false}
        dueCount={2}
        bookmarkCount={4}
      />,
    );
    expect(screen.queryByText(t("quranCompanion.entry.practise"))).toBeNull();
    expect(screen.queryByText(t("reciteToFind.shortcut.title"))).toBeNull();
    expect(screen.getByText(t("quran.hub.savedCount", { n: 4 }))).toBeTruthy();
  });
});
