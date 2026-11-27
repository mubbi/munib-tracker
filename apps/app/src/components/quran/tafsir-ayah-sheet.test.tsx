import { fireEvent, screen } from "@testing-library/react-native";

import { TafsirAyahSheet } from "@/components/quran/tafsir-ayah-sheet";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof TafsirAyahSheet>[0];

async function renderSheet(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    onClose: jest.fn(),
    surah: 2,
    ayah: 255,
    editionName: "Ibn Kathir",
    author: "Hafiz Ibn Kathir",
    text: "  The Throne verse.  ",
    direction: "ltr",
    loading: false,
    offline: false,
    ...overrides,
  };
  await renderWithTheme(<TafsirAyahSheet {...props} />);
}

describe("TafsirAyahSheet", () => {
  it("shows the ayah reference, edition and author", async () => {
    await renderSheet();
    expect(screen.getByText("2:255")).toBeTruthy();
    expect(screen.getByText("Ibn Kathir")).toBeTruthy();
    expect(screen.getByText("Hafiz Ibn Kathir")).toBeTruthy();
  });

  it("omits an empty author", async () => {
    await renderSheet({ author: "" });
    expect(screen.queryByText("Hafiz Ibn Kathir")).toBeNull();
  });

  it("shows the trimmed tafsir text", async () => {
    await renderSheet();
    expect(screen.getByText("The Throne verse.")).toBeTruthy();
  });

  it.each([
    ["rtl", "rtl"],
    ["ltr", "ltr"],
  ] as const)("sets writing direction for %p text", async (direction, writingDirection) => {
    await renderSheet({ direction, text: "تفسير" });
    expect(flattenStyle(screen.getByText("تفسير").props.style).writingDirection).toBe(
      writingDirection,
    );
  });

  it("announces the loading state through a skeleton group", async () => {
    await renderSheet({ loading: true });
    expect(screen.getByLabelText("Loading tafsir…")).toBeTruthy();
    expect(screen.queryByText("The Throne verse.")).toBeNull();
  });

  it("offers Try again on a failed tafsir load (C-02)", async () => {
    const onRetry = jest.fn();
    await renderSheet({ offline: true, onRetry });
    expect(screen.getByText(/Connect to download this tafsir/)).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["offline", { offline: true }, /Connect to download this tafsir/],
    ["empty", { text: "   " }, /No tafsir is available for this ayah/],
    ["missing", { text: undefined as unknown as string }, /No tafsir is available for this ayah/],
  ] as const)("shows the %s state", async (_state, overrides, message) => {
    await renderSheet(overrides);
    expect(screen.getByText(message)).toBeTruthy();
    expect(screen.queryByText("The Throne verse.")).toBeNull();
  });
});
