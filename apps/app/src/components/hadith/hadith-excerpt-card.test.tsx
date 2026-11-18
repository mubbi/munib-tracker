import type { HadithItem } from "@munib-tracker/shared/types";
import { act, fireEvent, screen } from "@testing-library/react-native";

import { HadithExcerptCard } from "@/components/hadith/hadith-excerpt-card";
import { buildHadithItem } from "@/test-support/fixtures/hadith";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const mockEnsureHadith = jest.fn();

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/prayer-info", () => ({
  ...jest.requireActual("@/lib/prayer-info"),
  ensureHadithItem: (id: string) => mockEnsureHadith(id),
}));

const hadith = buildHadithItem({ narrator: "Abu Musa" });

async function renderCard(item: HadithItem | null = hadith, maxExcerpt?: number) {
  mockEnsureHadith.mockResolvedValue(item);
  await renderWithTheme(<HadithExcerptCard hadithId={hadith.id} maxExcerpt={maxExcerpt} />);
  await act(async () => {
    await Promise.resolve();
  });
}

describe("HadithExcerptCard", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    mockEnsureHadith.mockReset();
  });

  it("shows a loader while the hadith resolves", async () => {
    mockEnsureHadith.mockReturnValue(new Promise(() => {}));
    await renderWithTheme(<HadithExcerptCard hadithId={hadith.id} />);
    expect(screen.queryByText(hadith.english)).toBeNull();
    expect(screen.queryByText("View full hadith")).toBeNull();
  });

  it("renders nothing when the hadith is missing", async () => {
    await renderCard(null);
    expect(screen.queryByText("View full hadith")).toBeNull();
  });

  it("shows Arabic, narrator, translation and reference", async () => {
    await renderCard();
    expect(screen.getByText(hadith.arabic)).toBeTruthy();
    expect(screen.getByText("Abu Musa")).toBeTruthy();
    expect(screen.getByText(hadith.english)).toBeTruthy();
    expect(screen.getByText("Reference: Riyad as-Salihin 368")).toBeTruthy();
  });

  it("truncates long translations", async () => {
    await renderCard(hadith, 10);
    expect(screen.getByText(/…$/)).toBeTruthy();
  });

  it.each(["reference", "button"])("opens the hadith reader from the %s", async (target) => {
    await renderCard();
    await fireEvent.press(
      target === "button"
        ? screen.getByText("View full hadith")
        : screen.getByLabelText("Open reference Riyad as-Salihin 368"),
    );
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/hadith/[collection]",
      params: { collection: "riyad_assalihin", q: "Riyad as-Salihin 368" },
    });
  });

  it("omits Arabic and narrator when absent", async () => {
    await renderCard(buildHadithItem({ arabic: "", narrator: undefined }));
    expect(screen.getByText(hadith.english)).toBeTruthy();
    expect(screen.queryByText("Abu Musa")).toBeNull();
  });

  it("ignores a lookup that resolves after unmount", async () => {
    let resolveItem: (item: HadithItem) => void = () => {};
    mockEnsureHadith.mockReturnValue(
      new Promise<HadithItem>((resolve) => {
        resolveItem = resolve;
      }),
    );
    const utils = await renderWithTheme(<HadithExcerptCard hadithId={hadith.id} />);
    await utils.unmount();
    await act(async () => resolveItem(hadith));
    expect(mockEnsureHadith).toHaveBeenCalledTimes(1);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("shows the reference as plain text with one focus stop", async () => {
      await renderCard();
      expect(screen.queryByLabelText("Open reference Riyad as-Salihin 368")).toBeNull();
      expect(screen.getByText("Reference: Riyad as-Salihin 368")).toBeTruthy();
    });
  });
});
