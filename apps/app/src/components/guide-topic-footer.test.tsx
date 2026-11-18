import { fireEvent, screen } from "@testing-library/react-native";
import { GuideTopicFooter } from "@/components/guide-topic-footer";
import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/components/learn-guide/learn-wide-layout", () => ({
  useLearnWideLayout: jest.fn(() => ({ wide: false })),
}));
jest.mock("@/hooks/use-share-content-card", () => ({
  ...jest.requireActual("@/hooks/use-share-content-card"),
  useShareContentCard: jest.fn(),
}));

const share = jest.fn(async () => {});
const shareCard = (state: { sharing?: boolean; pending?: boolean } = {}) =>
  jest.mocked(useShareContentCard).mockReturnValue({
    share,
    isSharing: () => state.sharing ?? false,
    isGesturePending: () => state.pending ?? false,
    SnapshotHost: null,
  } as never);

const TOPIC = { id: "wudu", title: "Wudu", summary: "Ablution", body: ["Begin with intention."] };

type Props = Parameters<typeof GuideTopicFooter>[0];
const renderFooter = (props: Partial<Props> = {}) =>
  renderWithTheme(
    <GuideTopicFooter ns="salahGuide" topic={TOPIC} sectionTitle="Salah" {...props} />,
  );

beforeEach(() => {
  resetExpoRouterMock();
  share.mockClear();
  shareCard();
});

describe("GuideTopicFooter", () => {
  it("shares the topic as a guide card", async () => {
    setMockPathname("/salah-guide/wudu");
    await renderFooter();

    await fireEvent.press(screen.getByText("Share"));

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionTitle: "Salah",
        shareKey: "wudu",
        content: expect.objectContaining({
          kind: "guide",
          title: "Wudu",
          excerpt: "Begin with intention.",
        }),
      }),
    );
  });

  it("shares topics without a summary or body", async () => {
    await renderFooter({ topic: { id: "t", title: "Bare" } });

    await fireEvent.press(screen.getByText("Share"));

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ content: expect.objectContaining({ summary: "" }) }),
    );
  });

  it.each([
    [{ sharing: true }, "Sharing…"],
    [{ pending: true }, "Tap to share"],
  ])("labels the share button while %o", async (state, label) => {
    shareCard(state);
    await renderFooter();

    expect(screen.getByText(label)).toBeTruthy();
  });

  it("adds a mark-complete action when toggling is supported", async () => {
    await renderFooter({ onToggleComplete: jest.fn(), completed: false });

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("hides mark-complete when asked", async () => {
    await renderFooter({ onToggleComplete: jest.fn(), showComplete: false });

    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("puts the actions side by side on wide layouts", async () => {
    jest.mocked(useLearnWideLayout).mockReturnValue({ wide: true } as never);
    await renderFooter({ onToggleComplete: jest.fn() });

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});

describe("GuideTopicFooter on TV", () => {
  usePlatform({ isTV: true });

  it("drops Share (no system share sheet)", async () => {
    await renderFooter({ onToggleComplete: jest.fn() });

    expect(screen.queryByText("Share")).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
