import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { fireEvent, screen } from "@testing-library/react-native";

import { ContentReportSheet } from "@/components/content-report/content-report-sheet";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/components/content-report/content-report-attachments", () => ({
  ContentReportAttachments: () => null,
}));

type Props = Parameters<typeof ContentReportSheet>[0];

const contentRef = {
  contentType: "dua",
  contentId: "dua-1",
  snapshot: { title: "Morning dua" },
} as unknown as ContentReportReference;

const DESCRIPTION = "Describe the issue in detail — what you expected vs what you see.";

async function renderSheet(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    contentRef,
    submitting: false,
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    ...overrides,
  };
  const utils = await renderWithTheme(<ContentReportSheet {...props} />);
  return { props, utils };
}

describe("ContentReportSheet", () => {
  it.each([
    [{ snapshot: { title: "Morning dua" } }, "Morning dua"],
    [{ snapshot: { reference: "Bukhari 1" } }, "Bukhari 1"],
    [{ snapshot: undefined }, "dua-1"],
  ])("labels the reported content %#", async (overrides, label) => {
    await renderSheet({ contentRef: { ...contentRef, ...overrides } as ContentReportReference });
    expect(screen.getByText(label)).toBeTruthy();
  });

  it("omits the content chip without a reference", async () => {
    await renderSheet({ contentRef: null });
    expect(screen.queryByText("dua-1")).toBeNull();
  });

  it("requires a minimum description before submitting", async () => {
    const { props } = await renderSheet();
    expect(screen.getByText("Minimum 10 characters required")).toBeTruthy();
    await fireEvent.press(screen.getByText("Submit report"));
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("submits the trimmed form with the chosen issue type", async () => {
    const { props } = await renderSheet();
    await fireEvent.press(screen.getByText("Typo"));
    expect(screen.getByRole("button", { selected: true })).toBeTruthy();
    await fireEvent.changeText(
      screen.getByPlaceholderText(DESCRIPTION),
      "  The word is misspelled  ",
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText(/Provide the correct Arabic/),
      " correct ",
    );
    await fireEvent.changeText(screen.getByPlaceholderText(/Book, scholar, URL/), " Book ");
    expect(screen.queryByText("Minimum 10 characters required")).toBeNull();
    await fireEvent.press(screen.getByText("Submit report"));
    expect(props.onSubmit).toHaveBeenCalledWith({
      issueType: "typo",
      description: "The word is misspelled",
      suggestedCorrection: "correct",
      userReference: "Book",
      attachments: [],
    });
  });

  it("shows the description length counter", async () => {
    await renderSheet();
    await fireEvent.changeText(screen.getByPlaceholderText(DESCRIPTION), "abc");
    expect(screen.getByText("3/4000")).toBeTruthy();
  });

  it("blocks submit while submitting", async () => {
    const { props } = await renderSheet({ submitting: true });
    await fireEvent.changeText(screen.getByPlaceholderText(DESCRIPTION), "Long enough text");
    await fireEvent.press(screen.getByText("Submit report"));
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("cancels", async () => {
    const { props } = await renderSheet();
    await fireEvent.press(screen.getByText("Cancel"));
    expect(props.onClose).toHaveBeenCalled();
  });

  it("resets the form when reopened", async () => {
    const { props, utils } = await renderSheet();
    await fireEvent.changeText(screen.getByPlaceholderText(DESCRIPTION), "Some text here");
    await utils.rerender(<ContentReportSheet {...props} visible={false} />);
    await utils.rerender(<ContentReportSheet {...props} visible />);
    expect(screen.getByPlaceholderText(DESCRIPTION).props.value).toBe("");
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("wraps the issue chips and keeps selection", async () => {
      await renderSheet();
      await fireEvent.press(screen.getByText("Audio"));
      expect(screen.getByRole("button", { selected: true })).toBeTruthy();
    });
  });
});
