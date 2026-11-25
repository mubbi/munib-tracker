import { fireEvent, screen } from "@testing-library/react-native";

import {
  DuaFavoriteButton,
  HadithCitationBookmarkButton,
  QuranAyahBookmarkButton,
} from "@/components/jannah/bookmark-button";
import { renderWithTheme } from "@/test-support/render";

const mockAyah = { bookmarked: false, toggle: jest.fn(async () => undefined) };
const mockHadith = { bookmarked: false, canBookmark: true, toggle: jest.fn(async () => undefined) };
const mockUseHadithCitationBookmark = jest.fn((_target: unknown) => mockHadith);

jest.mock("@/hooks/use-jannah-bookmarks", () => ({
  useQuranAyahBookmark: () => mockAyah,
  useHadithCitationBookmark: (target: unknown) => mockUseHadithCitationBookmark(target),
}));

describe("QuranAyahBookmarkButton", () => {
  beforeEach(() => {
    mockAyah.bookmarked = false;
    mockAyah.toggle.mockClear();
  });

  it.each([
    [false, "Save ayah"],
    [true, "Remove from saved"],
  ])("toggles the ayah bookmark (bookmarked=%s)", async (bookmarked, label) => {
    mockAyah.bookmarked = bookmarked;
    await renderWithTheme(<QuranAyahBookmarkButton surah={2} ayah={255} />);
    await fireEvent.press(screen.getByLabelText(label));
    expect(mockAyah.toggle).toHaveBeenCalled();
  });
});

describe("HadithCitationBookmarkButton", () => {
  beforeEach(() => {
    Object.assign(mockHadith, { bookmarked: false, canBookmark: true });
    mockHadith.toggle.mockClear();
    mockUseHadithCitationBookmark.mockClear();
  });

  it("resolves the citation and toggles the bookmark", async () => {
    await renderWithTheme(
      <HadithCitationBookmarkButton collection="Sahih al-Bukhari" citation="3244" />,
    );
    expect(mockUseHadithCitationBookmark).toHaveBeenCalledWith(
      expect.objectContaining({ number: "3244" }),
    );
    await fireEvent.press(screen.getByLabelText("Save"));
    expect(mockHadith.toggle).toHaveBeenCalled();
  });

  it("shows the remove label when bookmarked", async () => {
    mockHadith.bookmarked = true;
    await renderWithTheme(<HadithCitationBookmarkButton collection="Muslim" citation="1" />);
    expect(screen.getByLabelText("Remove from saved").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  it("renders nothing when the citation cannot be bookmarked", async () => {
    mockHadith.canBookmark = false;
    await renderWithTheme(<HadithCitationBookmarkButton collection="Unknown" citation="?" />);
    expect(screen.queryByLabelText("Save")).toBeNull();
  });
});

describe("DuaFavoriteButton", () => {
  it.each([
    [false, "Save dua"],
    [true, "Remove from saved"],
  ])("toggles the favorite (isFavorite=%s)", async (isFavorite, label) => {
    const onToggle = jest.fn();
    await renderWithTheme(
      <DuaFavoriteButton duaId="d1" isFavorite={isFavorite} onToggle={onToggle} />,
    );
    await fireEvent.press(screen.getByLabelText(label));
    expect(onToggle).toHaveBeenCalled();
  });
});
