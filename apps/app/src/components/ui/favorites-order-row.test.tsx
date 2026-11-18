import { fireEvent, screen } from "@testing-library/react-native";

import { FavoritesOrderRow } from "@/components/ui/favorites-order-row";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof FavoritesOrderRow>[0];

const renderRow = async (props: Partial<Props> = {}) => {
  const handlers = { onPress: jest.fn(), onMove: jest.fn(), onRemove: jest.fn() };
  await renderWithTheme(
    <FavoritesOrderRow
      index={1}
      total={3}
      title="Ayat al-Kursi"
      removeAccessibilityLabel="Unfavorite"
      {...handlers}
      {...props}
    />,
  );
  return handlers;
};

describe("FavoritesOrderRow", () => {
  it.each([
    [{ progressLabel: "1/3" }, "2. Ayat al-Kursi, 1/3", "1/3"],
    [{ completed: true }, "2. Ayat al-Kursi, Done", "Done"],
    [{ completed: true, progressLabel: "3/3" }, "2. Ayat al-Kursi, 3/3", "3/3"],
  ])("with %o is announced as %s and shows %s", async (props, label, pill) => {
    await renderRow(props);

    expect(screen.getByLabelText(label)).toBeTruthy();
    expect(screen.getByText(pill)).toBeTruthy();
  });

  it("is announced by position and title alone without progress", async () => {
    await renderRow();

    expect(screen.getByLabelText("2. Ayat al-Kursi")).toBeTruthy();
  });

  it("opens the favorite from its body", async () => {
    const { onPress } = await renderRow();

    await fireEvent.press(screen.getByLabelText("2. Ayat al-Kursi"));

    expect(onPress).toHaveBeenCalled();
  });

  it("shows an optional subtitle", async () => {
    await renderRow({ subtitle: "After salah" });

    expect(screen.getByText("After salah")).toBeTruthy();
  });

  it.each([
    ["Move up", -1],
    ["Move down", 1],
  ])("%s reorders by %i", async (label, direction) => {
    const { onMove } = await renderRow();

    await fireEvent.press(screen.getByLabelText(label));

    expect(onMove).toHaveBeenCalledWith(direction);
  });

  it("unfavorites from the star", async () => {
    const { onRemove } = await renderRow();

    await fireEvent.press(screen.getByLabelText("Unfavorite"));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
