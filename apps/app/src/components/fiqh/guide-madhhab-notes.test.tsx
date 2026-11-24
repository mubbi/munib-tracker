import { screen } from "@testing-library/react-native";

import { GuideMadhhabNotes } from "@/components/fiqh/guide-madhhab-notes";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { buildLearnGuideTopic } from "@/test-support/fixtures/learn-guide";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/components/guide-topic-footer",
  () => require("@/test-support/mocks/guide-topic-footer").guideTopicFooterMock,
);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/hooks/use-quran-ayah-range",
  () => require("@/test-support/mocks/use-quran-ayah-range").quranAyahRangeMock,
);
jest.mock("@/components/learn-guide/linked-dua-card", () => ({ LinkedDuaCard: () => null }));

afterEach(resetPreferences);

const JANAZAH_TITLE = "Al-Fatihah in the janazah salah";

describe("GuideMadhhabNotes", () => {
  it("renders nothing without linked differences", async () => {
    await renderWithTheme(<GuideMadhhabNotes ids={undefined} />);
    expect(screen.queryByTestId("guide-madhhab-notes")).toBeNull();
  });

  it("renders one note per difference with the section header and disclaimer", async () => {
    await renderWithTheme(<GuideMadhhabNotes ids={["eid.status", "eid.extraTakbirs"]} />);
    await setPreferences({ madhhab: "hanafi" });
    expect(screen.getByText("Where the schools differ")).toBeTruthy();
    expect(screen.getByText("For your own situation, consult a qualified scholar.")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /^Other views \(\d\)$/ })).toHaveLength(2);
  });

  it("shows the side-by-side comparison in all-views mode", async () => {
    await renderWithTheme(<GuideMadhhabNotes ids={["wudu.dalk"]} />);
    await setPreferences({ madhhab: null });
    expect(screen.getByTestId(/ruling-compare-.*maliki/)).toBeTruthy();
    expect(
      screen.getByText("Obligatory: pass the hand over each washed limb with the water."),
    ).toBeTruthy();
  });

  it("is rendered by the shared Learn guide topic body from `differenceIds`", async () => {
    await renderWithTheme(
      <LearnGuideTopicContent
        topic={buildLearnGuideTopic({ differenceIds: ["janazah.fatiha"] })}
        ns="janazah"
        sectionTitle="Janazah"
      />,
    );
    await setPreferences({ madhhab: "shafii" });
    expect(screen.getByText(JANAZAH_TITLE)).toBeTruthy();
  });
});
