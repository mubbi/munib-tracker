import { act, fireEvent, screen } from "@testing-library/react-native";
import type { ComponentProps } from "react";
import { AppFeedbackSheet } from "@/features/reviews/components/AppFeedbackSheet";
import i18n from "@/i18n";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const TEXT = {
  title: i18n.t("reviews.feedbackTitle"),
  cta: i18n.t("reviews.feedbackCta"),
  cancel: i18n.t("common.cancel"),
  offline: i18n.t("reviews.feedbackOffline"),
  placeholder: i18n.t("reviews.feedbackPlaceholder"),
};

type Props = ComponentProps<typeof AppFeedbackSheet>;

async function renderSheet(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(async () => undefined),
    ...overrides,
  };
  const utils = await renderWithTheme(<AppFeedbackSheet {...props} />);
  return { ...utils, props };
}

async function pickStars(count: number) {
  await fireEvent.press(screen.getByLabelText(count === 1 ? "1 star" : `${count} stars`));
}

async function submit() {
  await fireEvent.press(screen.getByText(TEXT.cta));
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

const ctaDisabled = () =>
  screen.getByRole("button", { name: TEXT.cta }).props.accessibilityState?.disabled === true;

describe("AppFeedbackSheet", () => {
  it("renders nothing when hidden", async () => {
    await renderSheet({ visible: false });
    expect(screen.queryByText(TEXT.title)).toBeNull();
  });

  it("offers all five ratings", async () => {
    await renderSheet();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("needs a rating before it can send", async () => {
    const { props } = await renderSheet();
    expect(ctaDisabled()).toBe(true);
    await submit();
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it.each([1, 3, 5])(
    "sends a %i-star rating with the trimmed note and closes (never a store step)",
    async (stars) => {
      const { props } = await renderSheet();
      await pickStars(stars);
      await fireEvent.changeText(screen.getByPlaceholderText(TEXT.placeholder), "  Great app  ");
      await submit();
      expect(props.onSubmit).toHaveBeenCalledWith(stars, "Great app");
      expect(props.onClose).toHaveBeenCalledTimes(1);
    },
  );

  it("stays open to retry when sending fails", async () => {
    const onSubmit = jest.fn(async () => {
      throw new Error("feedback_failed");
    });
    const { props } = await renderSheet({ onSubmit, error: "Could not send" });
    await pickStars(2);
    await submit();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(props.onClose).not.toHaveBeenCalled();
    expect(screen.getByText("Could not send")).toBeTruthy();
  });

  it("blocks sending while offline", async () => {
    const { props } = await renderSheet({ offline: true });
    expect(screen.getByText(TEXT.offline)).toBeTruthy();
    await pickStars(4);
    expect(ctaDisabled()).toBe(true);
    await submit();
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("closes on cancel without sending", async () => {
    const { props } = await renderSheet();
    await pickStars(5);
    await fireEvent.press(screen.getByText(TEXT.cancel));
    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("starts fresh each time it opens", async () => {
    const { props, rerender } = await renderSheet();
    await pickStars(5);
    await rerender(<AppFeedbackSheet {...props} visible={false} />);
    await rerender(<AppFeedbackSheet {...props} visible />);
    expect(ctaDisabled()).toBe(true);
  });
});
