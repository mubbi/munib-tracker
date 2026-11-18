import type { ZakatGuideSectionKey } from "@munib-tracker/shared/content/zakat-guide";
import { screen } from "@testing-library/react-native";

import { ZakatChecklistContent } from "@/components/zakat/zakat-checklist-content";
import { ZakatEvidenceContent } from "@/components/zakat/zakat-evidence-content";
import { ZakatTopicContent } from "@/components/zakat/zakat-topic-content";
import i18n from "@/i18n";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/hooks/use-quran-ayah-range",
  () => require("@/test-support/mocks/use-quran-ayah-range").quranAyahRangeMock,
);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

async function renderTopic(topicId: ZakatGuideSectionKey) {
  await renderWithTheme(<ZakatTopicContent topicId={topicId} />);
}

describe("ZakatTopicContent", () => {
  it("shows the topic title and the pillar badge for basics", async () => {
    await renderTopic("basics");
    expect(screen.getByText(i18n.t("zakat.guide.basics.title"))).toBeTruthy();
    expect(screen.getByText(i18n.t("zakat.pillarBadge"))).toBeTruthy();
  });

  it("adds the nisab weights table", async () => {
    await renderTopic("nisab");
    expect(screen.getByText(i18n.t("zakat.nisabWeightGold"))).toBeTruthy();
    expect(screen.queryByText(i18n.t("zakat.pillarBadge"))).toBeNull();
  });

  it("lists all eight recipients", async () => {
    await renderTopic("recipients");
    expect(screen.getByText(i18n.t("zakat.recipients.0.title"))).toBeTruthy();
    expect(screen.getByText(i18n.t("zakat.recipients.7.title"))).toBeTruthy();
  });
});

describe("ZakatChecklistContent", () => {
  afterEach(resetMockWindowSize);

  it.each([390, 1400])("numbers every checklist item at width %i", async (width) => {
    setMockWindowSize(width);
    await renderWithTheme(<ZakatChecklistContent />);
    expect(screen.getByText(i18n.t("zakat.checklistIntro"))).toBeTruthy();
    expect(screen.getByText(i18n.t("zakat.checklist.0.title"))).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
  });
});

describe("ZakatEvidenceContent", () => {
  afterEach(resetMockWindowSize);

  it.each([390, 1600])("shows Qur'an and hadith evidence at width %i", async (width) => {
    setMockWindowSize(width);
    await renderWithTheme(<ZakatEvidenceContent />);
    expect(screen.getByText(i18n.t("zakat.evidenceIntro"))).toBeTruthy();
    expect(screen.getByText(i18n.t("zakat.quran.0.excerpt"))).toBeTruthy();
  });
});
