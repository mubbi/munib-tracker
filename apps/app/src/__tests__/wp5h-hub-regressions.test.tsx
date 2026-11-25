import { screen } from "@testing-library/react-native";

import HajjScreen from "@/app/hajj/index";
import LearnQuranDailyScreen from "@/app/learn-quran/daily";
import LearnQuranScreen from "@/app/learn-quran/index";
import { getHajjGuideSectionOrder, getHajjGuideTopicsBySection } from "@/lib/hajj-guide";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

const mockActiveKeys: Array<string | null | undefined> = [];
jest.mock("@/hooks/use-scroll-to-active", () => ({
  useScrollToActive: (_ref: unknown, activeKey: string | null | undefined) => {
    mockActiveKeys.push(activeKey);
    return { register: () => () => undefined, onScroll: jest.fn() };
  },
}));
jest.mock("@/components/ui/focus-highlight", () => {
  const { Text: MockText } = require("react-native");
  return {
    FocusHighlight: ({ active, children }: { active: boolean; children: unknown }) => (
      <>
        {active ? <MockText>focus-active</MockText> : null}
        {children as never}
      </>
    ),
  };
});
jest.mock("@/components/content-report/content-report-footer-link", () => {
  const { Text: MockText } = require("react-native");
  return {
    ContentReportFooterLink: ({ contentRef }: { contentRef: { kind: string; route: string } }) => (
      <MockText>{`report:${contentRef.kind}:${contentRef.route}`}</MockText>
    ),
  };
});

beforeEach(() => {
  resetExpoRouterMock();
  mockActiveKeys.length = 0;
});

describe("/hajj ?focus=", () => {
  it("scrolls to and highlights the focused topic only", async () => {
    const section = getHajjGuideSectionOrder().find(
      (s) => getHajjGuideTopicsBySection()[s]?.length,
    );
    const topic = section ? getHajjGuideTopicsBySection()[section]?.[0] : undefined;
    if (!topic) throw new Error("no hajj topic");
    setMockSearchParams({ focus: topic.id });
    await renderWithProviders(<HajjScreen />);
    expect(screen.getAllByText("focus-active")).toHaveLength(1);
    expect(mockActiveKeys).toContain(topic.id);
  });

  it("highlights nothing without a focus param", async () => {
    await renderWithProviders(<HajjScreen />);
    expect(screen.queryByText("focus-active")).toBeNull();
  });
});

describe("/learn-quran content report", () => {
  it("keeps the learn_quran report reference on the hub", async () => {
    await renderWithProviders(<LearnQuranScreen />);
    expect(screen.getByText("report:learn_quran:/learn-quran")).toBeTruthy();
  });

  it("keeps the learn_quran report reference on the daily lesson", async () => {
    await renderWithProviders(<LearnQuranDailyScreen />);
    expect(await screen.findByText("report:learn_quran:/learn-quran/daily")).toBeTruthy();
  });
});
