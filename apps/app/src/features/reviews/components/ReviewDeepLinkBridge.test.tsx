import { act, render } from "@testing-library/react-native";
import {
  isReviewDeepLink,
  ReviewDeepLinkBridge,
} from "@/features/reviews/components/ReviewDeepLinkBridge";
import { registerWriteReviewOpener } from "@/features/reviews/lib/reviewPromptBridge";

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
    registerWriteReviewOpener(opener);
  });

  afterEach(() => {
    registerWriteReviewOpener(null);
  });

  it("opens the store's write-review page from the launch URL", async () => {
    await renderBridge("munib-tracker://open-review");
    expect(opener).toHaveBeenCalledTimes(1);
  });

  it("ignores the retired triggerId param and still opens the store page", async () => {
    await renderBridge();
    mockLinking.listener?.({ url: "munib-tracker://open-review?triggerId=perfect_day" });
    expect(opener).toHaveBeenCalledTimes(1);
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
      expect(isReviewDeepLink(url)).toBe(false);
    },
  );

  it("unsubscribes from links on unmount", async () => {
    const { unmount } = await renderBridge();
    await unmount();
    expect(mockLinking.remove).toHaveBeenCalledTimes(1);
  });
});
