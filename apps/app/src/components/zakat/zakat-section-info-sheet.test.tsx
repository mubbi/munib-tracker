import { fireEvent, screen } from "@testing-library/react-native";

import { ZakatSectionInfoSheet } from "@/components/zakat/zakat-section-info-sheet";
import type { ZakatCalcSectionId } from "@/lib/zakat-section-info";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/zakat-section-info", () => {
  const actual = jest.requireActual("@/lib/zakat-section-info");
  return {
    ...actual,
    ZAKAT_CALC_SECTIONS: {
      ...actual.ZAKAT_CALC_SECTIONS,
      // No guide link and dangling ref indices — exercises the skip paths.
      orphan: {
        id: "orphan",
        refs: [
          { kind: "quran", sharedIndex: 999 },
          { kind: "hadith", sharedIndex: 999 },
          { kind: "quran" },
        ],
      },
    },
  };
});

async function renderSheet(sectionId: string | null, onClose = jest.fn()) {
  await renderWithTheme(
    <ZakatSectionInfoSheet
      sectionId={sectionId as ZakatCalcSectionId | null}
      visible
      onClose={onClose}
    />,
  );
  return onClose;
}

describe("ZakatSectionInfoSheet", () => {
  beforeEach(resetExpoRouterMock);

  it.each([null, "unknown"])("renders nothing for section %p", async (sectionId) => {
    await renderSheet(sectionId);
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it("shows the section title with Qur'an and hadith evidence", async () => {
    await renderSheet("liquid");
    expect(screen.getByTestId("sheet")).toBeTruthy();
    expect(screen.getByText("Qur'an")).toBeTruthy();
    expect(screen.getByText("Hadith")).toBeTruthy();
  });

  it("adds the section's local reference", async () => {
    await renderSheet("agriculture");
    expect(screen.getAllByText(/6:141/).length).toBeGreaterThan(0);
  });

  it("omits the Qur'an block when a section only cites hadith", async () => {
    await renderSheet("currency");
    expect(screen.getByText("Currency & rates")).toBeTruthy();
    expect(screen.queryByText("Qur'an")).toBeNull();
  });

  it("opens the full guide and closes", async () => {
    const onClose = await renderSheet("metals");
    await fireEvent.press(screen.getByText("Open full guide"));
    expect(onClose).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/zakat/[topic]",
      params: { topic: "nisab" },
    });
  });

  it("skips dangling refs and the guide button", async () => {
    await renderSheet("orphan");
    expect(screen.queryByText("Hadith")).toBeNull();
    expect(screen.queryByText("Open full guide")).toBeNull();
  });
});
