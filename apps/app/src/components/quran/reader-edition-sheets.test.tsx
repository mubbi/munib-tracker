import { fireEvent, screen } from "@testing-library/react-native";

import { ReaderEditionSheets } from "@/components/quran/reader-edition-sheets";
import { updateQuranPrefs } from "@/lib/settings/quran-shortcuts";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/settings/quran-shortcuts", () => ({
  updateQuranPrefs: jest.fn(async () => undefined),
}));

type Props = Parameters<typeof ReaderEditionSheets>[0];

async function renderSheets(overrides: Partial<Props> = {}) {
  const props: Props = {
    open: null,
    onClose: jest.fn(),
    translationId: "en-pickthall",
    secondaryId: undefined,
    tafsirId: undefined,
    ...overrides,
  };
  await renderWithTheme(<ReaderEditionSheets {...props} />);
  return props;
}

describe("ReaderEditionSheets", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders no sheet while closed", async () => {
    await renderSheets();
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it("opens only the requested picker", async () => {
    await renderSheets({ open: "tafsir" });
    expect(screen.getAllByTestId("sheet")).toHaveLength(1);
    expect(screen.getByText("Tafsir")).toBeTruthy();
  });

  it("clears the second translation from its None row and closes", async () => {
    const props = await renderSheets({ open: "secondary", secondaryId: "" });
    await fireEvent.press(screen.getByRole("button", { name: "None" }));
    expect(updateQuranPrefs).toHaveBeenCalledWith({ secondaryTranslationId: undefined });
    expect(props.onClose).toHaveBeenCalled();
  });

  it("stores an explicit no-tafsir choice as an empty id", async () => {
    await renderSheets({ open: "tafsir", tafsirId: "" });
    await fireEvent.press(screen.getByRole("button", { name: "Select tafsir" }));
    expect(updateQuranPrefs).toHaveBeenCalledWith({ preferredTafsirId: "" });
  });
});
