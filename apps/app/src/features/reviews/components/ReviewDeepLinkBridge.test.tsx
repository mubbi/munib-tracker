import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import { act, render } from "@testing-library/react-native";
import { ReviewDeepLinkBridge } from "@/features/reviews/components/ReviewDeepLinkBridge";
import { registerReviewPromptOpener } from "@/features/reviews/lib/reviewPromptBridge";

type UrlListener = (event: { url: string }) => void;

const mockLinking = {
  listener: null as UrlListener | null,
  initialUrl: null as string | null,
  remove: jest.fn(),
};

jest.mock("expo-linking", () => ({
  addEventListener: (_type: string, listener: UrlListener) => {
    mockLinking.listener = listener;
    return { remove: mockLinking.remove };
  },
  getInitialURL: () => Promise.resolve(mockLinking.initialUrl),
  parse: (url: string) => {
    const parsed = new URL(url);
    const path = `${parsed.host}${parsed.pathname}`;
    return { path: path || null, queryParams: Object.fromEntries(parsed.searchParams) };
  },
}));

const opener = jest.fn();

async function renderBridge(initialUrl: string | null = null) {
  mockLinking.initialUrl = initialUrl;
  const utils = await render(<ReviewDeepLinkBridge />);
  await act(async () => {
    await Promise.resolve();
  });
  return utils;
}

describe("ReviewDeepLinkBridge", () => {
  beforeEach(() => {
    opener.mockReset();
    mockLinking.remove.mockReset();
    mockLinking.listener = null;
    registerReviewPromptOpener(opener);
  });

  afterEach(() => {
    registerReviewPromptOpener(null);
  });

  it("opens the funnel from the launch URL with its trigger id", async () => {
    await renderBridge(
      `munib-tracker://open-review?triggerId=${APP_FEEDBACK_TRIGGER_IDS.weekly_report}`,
    );
    expect(opener).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.weekly_report);
  });

  it("does nothing without a launch URL", async () => {
    await renderBridge();
    expect(opener).not.toHaveBeenCalled();
  });

  it.each(["munib-tracker://settings", "munib-tracker://"])(
    "ignores the unrelated link %s",
    async (url) => {
      await renderBridge();
      mockLinking.listener?.({ url });
      expect(opener).not.toHaveBeenCalled();
    },
  );

  it("falls back to the manual trigger for an unknown trigger id", async () => {
    await renderBridge();
    mockLinking.listener?.({ url: "munib-tracker://open-review?triggerId=bogus" });
    expect(opener).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.manual);
  });

  it("unsubscribes from links on unmount", async () => {
    const { unmount } = await renderBridge();
    await unmount();
    expect(mockLinking.remove).toHaveBeenCalledTimes(1);
  });
});
