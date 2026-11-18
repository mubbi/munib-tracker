import { act, fireEvent, screen } from "@testing-library/react-native";
import type { ComponentProps } from "react";
import { ReviewPromptSheet } from "@/features/reviews/components/ReviewPromptSheet";
import { renderWithTheme } from "@/test-support/render";

const mockStore = {
  target: "ios" as "ios" | "android" | "both",
  openListing: jest.fn(async (_options?: unknown) => true),
  openListingUrl: jest.fn(async (_url: string) => true),
};

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

jest.mock("@/lib/platform/storeReview", () => ({
  openReviewStoreListing: (options?: unknown) => mockStore.openListing(options),
  openReviewStoreListingUrl: (url: string) => mockStore.openListingUrl(url),
  resolveReviewStoreListingTarget: () => mockStore.target,
  resolveReviewStoreListingUrl: (target: string, locale?: string) =>
    `https://store.example/${target}?hl=${locale}`,
}));

const TEXT = {
  rateTitle: "Enjoying Munib Tracker?",
  storeTitle: "Thank you!",
  storeCta: "Rate on the app store",
  maybeLater: "Maybe later",
  feedbackTitle: "Help us improve",
  feedbackPlaceholder: "Tell us what went wrong or what's missing…",
  feedbackCta: "Send feedback",
  feedbackOffline: "Connect to the internet to send feedback.",
  skip: "Skip",
};

type Props = ComponentProps<typeof ReviewPromptSheet>;

async function renderSheet(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    onClose: jest.fn(),
    onDismissed: jest.fn(),
    onStoreReviewRequested: jest.fn(),
    onFeedbackSent: jest.fn(async () => undefined),
    ...overrides,
  };
  const utils = await renderWithTheme(<ReviewPromptSheet {...props} />);
  return { ...utils, props };
}

async function press(text: string) {
  await fireEvent.press(screen.getByText(text));
}

async function pickStars(count: number) {
  await fireEvent.press(screen.getByLabelText(count === 1 ? "1 star" : `${count} stars`));
}

async function flushPromises() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("ReviewPromptSheet", () => {
  beforeEach(() => {
    mockStore.target = "ios";
    mockStore.openListing.mockReset().mockResolvedValue(true);
    mockStore.openListingUrl.mockReset().mockResolvedValue(true);
  });

  it("renders nothing when hidden", async () => {
    await renderSheet({ visible: false });
    expect(screen.queryByText(TEXT.rateTitle)).toBeNull();
  });

  it("starts on the star step", async () => {
    await renderSheet();
    expect(screen.getByText(TEXT.rateTitle)).toBeTruthy();
  });

  it("records a dismissal when the sheet is closed", async () => {
    const { props } = await renderSheet();
    await fireEvent.press(screen.getByTestId("sheet-close"));
    expect(props.onDismissed).toHaveBeenCalledTimes(1);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it.each([
    [4, TEXT.storeTitle],
    [5, TEXT.storeTitle],
    [1, TEXT.feedbackTitle],
    [3, TEXT.feedbackTitle],
  ])("routes a %i-star rating to %s", async (stars, title) => {
    await renderSheet();
    await pickStars(stars);
    expect(screen.getByText(title)).toBeTruthy();
  });

  describe("store step", () => {
    it("opens the native store review with the UI locale", async () => {
      await renderSheet();
      await pickStars(5);
      await press(TEXT.storeCta);
      await flushPromises();
      expect(mockStore.openListing).toHaveBeenCalledWith({ locale: "en" });
    });

    it("reports the store review and closes once opened", async () => {
      const { props } = await renderSheet();
      await pickStars(5);
      await press(TEXT.storeCta);
      await flushPromises();
      expect(props.onStoreReviewRequested).toHaveBeenCalledTimes(1);
      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it("stays open when the store listing cannot be opened", async () => {
      mockStore.openListing.mockResolvedValue(false);
      const { props } = await renderSheet();
      await pickStars(4);
      await press(TEXT.storeCta);
      await flushPromises();
      expect(props.onStoreReviewRequested).not.toHaveBeenCalled();
      expect(screen.getByText(TEXT.storeTitle)).toBeTruthy();
    });

    it("dismisses via maybe later", async () => {
      const { props } = await renderSheet();
      await pickStars(4);
      await press(TEXT.maybeLater);
      expect(props.onDismissed).toHaveBeenCalledTimes(1);
    });

    it.each([
      ["App Store", "ios"],
      ["Google Play", "android"],
    ])("offers the %s listing when the platform is ambiguous", async (label, target) => {
      mockStore.target = "both";
      const { props } = await renderSheet();
      await pickStars(5);
      await press(label);
      await flushPromises();
      expect(mockStore.openListingUrl).toHaveBeenCalledWith(
        `https://store.example/${target}?hl=en`,
      );
      expect(props.onStoreReviewRequested).toHaveBeenCalledTimes(1);
    });

    it("hides the generic store CTA when both listings are offered", async () => {
      mockStore.target = "both";
      await renderSheet();
      await pickStars(5);
      expect(screen.queryByText(TEXT.storeCta)).toBeNull();
    });
  });

  describe("feedback step", () => {
    it("sends trimmed feedback with the rating and closes", async () => {
      const { props } = await renderSheet();
      await pickStars(2);
      await fireEvent.changeText(
        screen.getByPlaceholderText(TEXT.feedbackPlaceholder),
        "  needs dark mode  ",
      );
      await press(TEXT.feedbackCta);
      await flushPromises();
      expect(props.onFeedbackSent).toHaveBeenCalledWith(2, "needs dark mode");
      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it("stays open for a retry when sending fails, without an unhandled rejection", async () => {
      const unhandled = jest.fn();
      process.on("unhandledRejection", unhandled);
      try {
        const { props } = await renderSheet({
          onFeedbackSent: jest.fn(async () => {
            throw new Error("feedback_failed");
          }),
        });
        await pickStars(2);
        await press(TEXT.feedbackCta);
        await flushPromises();
        await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

        expect(props.onClose).not.toHaveBeenCalled();
        expect(screen.getByText(TEXT.feedbackCta)).toBeTruthy();
        expect(unhandled).not.toHaveBeenCalled();
      } finally {
        process.off("unhandledRejection", unhandled);
      }
    });

    it("shows the submission error", async () => {
      await renderSheet({ feedbackError: "Could not send" });
      await pickStars(1);
      expect(screen.getByText("Could not send")).toBeTruthy();
    });

    it("dismisses via skip without sending", async () => {
      const { props } = await renderSheet();
      await pickStars(1);
      await press(TEXT.skip);
      expect(props.onDismissed).toHaveBeenCalledTimes(1);
      expect(props.onFeedbackSent).not.toHaveBeenCalled();
    });

    it("explains and blocks sending while offline", async () => {
      const { props } = await renderSheet({ feedbackOffline: true });
      await pickStars(3);
      await press(TEXT.feedbackCta);
      await flushPromises();
      expect(screen.getByText(TEXT.feedbackOffline)).toBeTruthy();
      expect(props.onFeedbackSent).not.toHaveBeenCalled();
    });
  });

  it("resets to the star step when reopened", async () => {
    const { props, rerender } = await renderSheet();
    await pickStars(2);
    await rerender(<ReviewPromptSheet {...props} visible={false} />);
    await rerender(<ReviewPromptSheet {...props} visible />);
    expect(screen.getByText(TEXT.rateTitle)).toBeTruthy();
  });
});
