import { act, screen } from "@testing-library/react-native";

import { MASJID_SLOW_HINT_MS, MasjidListSkeleton } from "@/components/masjid/masjid-list-skeleton";
import i18n from "@/i18n";
import { renderWithTheme } from "@/test-support/render";

describe("MasjidListSkeleton", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("announces loading, then admits a slow upstream", async () => {
    await renderWithTheme(<MasjidListSkeleton readOnly={false} />);
    expect(screen.getByText(i18n.t("masjids.loading"))).toBeTruthy();
    expect(screen.queryByText(i18n.t("masjids.loadingSlow"))).toBeNull();

    await act(async () => {
      jest.advanceTimersByTime(MASJID_SLOW_HINT_MS);
    });
    expect(screen.getByText(i18n.t("masjids.loadingSlow"))).toBeTruthy();
  });

  it("keeps the placeholder shapes away from screen readers", async () => {
    await renderWithTheme(<MasjidListSkeleton readOnly />);
    const root = screen.getByTestId("masjids-loading");
    const shapes = root.children[1] as { props: Record<string, unknown> };
    expect(shapes.props.accessibilityElementsHidden).toBe(true);
    expect(shapes.props.importantForAccessibility).toBe("no-hide-descendants");
  });
});
