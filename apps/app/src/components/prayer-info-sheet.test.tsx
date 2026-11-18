import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { PrayerInfoSheet } from "@/components/prayer-info-sheet";
import { ensureHadithItem } from "@/lib/prayer-info";
import { deferred } from "@/test-support/async";
import { buildHadithItem } from "@/test-support/fixtures/hadith";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/prayer-info", () => ({
  ...jest.requireActual("@/lib/prayer-info"),
  ensureHadithItem: jest.fn(),
}));

type Props = Parameters<typeof PrayerInfoSheet>[0];

const renderSheet = async (props: Partial<Props> = {}) => {
  const onClose = jest.fn();
  await renderWithTheme(<PrayerInfoSheet visible prayerId="fajr" onClose={onClose} {...props} />);
  return onClose;
};

beforeEach(() => {
  jest.clearAllMocks();
  resetExpoRouterMock();
  jest
    .mocked(ensureHadithItem)
    .mockImplementation(async (id) => buildHadithItem({ id, reference: `Ref ${id}` }));
});

describe("PrayerInfoSheet", () => {
  it("renders nothing without a prayer", async () => {
    await renderSheet({ prayerId: null });

    expect(screen.toJSON()).toBeNull();
  });

  it("explains the prayer in about / why / benefits sections", async () => {
    await renderSheet();

    expect(screen.getByText("Fajr")).toBeTruthy();
    expect(
      ["About", "Why we pray it", "Benefits", "References"].map((h) => screen.getByText(h)),
    ).toHaveLength(4);
  });

  it("loads hadith references with an excerpt", async () => {
    await renderSheet();

    expect(await screen.findByText("Ref riyad_assalihin:368")).toBeTruthy();
    expect(screen.getAllByText(/two cool prayers/)).toHaveLength(2);
  });

  it("opens a hadith in its collection and closes the sheet", async () => {
    const onClose = await renderSheet();
    await screen.findByText("Ref riyad_assalihin:368");

    await fireEvent.press(screen.getAllByText("View full hadith")[0]);

    expect(onClose).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/hadith/[collection]",
      params: { collection: "riyad_assalihin", q: "Ref riyad_assalihin:368" },
    });
  });

  it("opens a Qur'an reference at its ayah", async () => {
    await renderSheet();

    await fireEvent.press(screen.getByText("View in Qur'an"));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/[surah]",
      params: { surah: "17", ayah: "78" },
    });
  });

  it("skips hadith references that cannot be resolved", async () => {
    jest.mocked(ensureHadithItem).mockResolvedValue(undefined);
    await renderSheet();

    await waitFor(() => expect(ensureHadithItem).toHaveBeenCalledTimes(2));
    expect(screen.queryByText("View full hadith")).toBeNull();
  });

  it("ignores a hadith that loads after unmount", async () => {
    const pending = deferred<undefined>();
    jest.mocked(ensureHadithItem).mockReturnValue(pending.promise);
    const { unmount } = await renderWithTheme(
      <PrayerInfoSheet visible prayerId="fajr" onClose={jest.fn()} />,
    );

    await unmount();
    pending.resolve(undefined);

    expect(screen.queryByText("View full hadith")).toBeNull();
  });
});
