import { fireEvent, screen } from "@testing-library/react-native";

import { PrayerNotesModal } from "@/components/prayer-notes-modal";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof PrayerNotesModal>[0];

const renderModal = async (props: Partial<Props> = {}) => {
  const handlers = { onSave: jest.fn(), onClose: jest.fn() };
  const view = await renderWithTheme(
    <PrayerNotesModal visible title="Fajr — note" {...handlers} {...props} />,
  );
  return { ...handlers, ...view };
};

const input = () => screen.getByLabelText(/e\.g\./);

describe("PrayerNotesModal", () => {
  it("prefills the existing note with a character count", async () => {
    await renderModal({ initialValue: "Masjid" });

    expect(input().props.value).toBe("Masjid");
    expect(screen.getByText("6/500")).toBeTruthy();
  });

  it("caps notes at 500 characters", async () => {
    await renderModal();

    await fireEvent.changeText(input(), "x".repeat(600));

    expect(input().props.value).toHaveLength(500);
  });

  it("saves the trimmed note and closes", async () => {
    const { onSave, onClose } = await renderModal();

    await fireEvent.changeText(input(), "  late ");
    await fireEvent.press(screen.getByText("Save note"));

    expect(onSave).toHaveBeenCalledWith("late");
    expect(onClose).toHaveBeenCalled();
  });

  it("cancels without saving", async () => {
    const { onSave, onClose } = await renderModal();

    await fireEvent.press(screen.getByText("Cancel"));

    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("restores the saved note when reopened", async () => {
    const { rerender, onSave, onClose } = await renderModal({ initialValue: "A" });
    await fireEvent.changeText(input(), "draft");
    const ui = (visible: boolean) => (
      <PrayerNotesModal
        visible={visible}
        title="t"
        initialValue="A"
        onSave={onSave}
        onClose={onClose}
      />
    );

    await rerender(ui(false));
    await rerender(ui(true));

    expect(input().props.value).toBe("A");
  });
});

describe("PrayerNotesModal on TV", () => {
  usePlatform({ isTV: true });

  it("still edits notes", async () => {
    await renderModal();

    await fireEvent.changeText(input(), "tv");

    expect(input().props.value).toBe("tv");
  });
});
