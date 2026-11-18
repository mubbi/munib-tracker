import type { PilgrimageChecklistItem } from "@munib-tracker/shared/types";
import { fireEvent, screen } from "@testing-library/react-native";

import { PilgrimageChecklistView } from "@/components/hajj/pilgrimage-checklist-view";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

const items: PilgrimageChecklistItem[] = [
  {
    id: "ihram",
    title: "Enter ihram",
    hint: "Make intention",
    location: "Miqat",
    day: "8 Dhul-Hijjah",
  },
  { id: "mina", title: "Go to Mina", hint: "Pray there", day: "8 Dhul-Hijjah" },
  { id: "tawaf", title: "Tawaf", hint: "Seven circuits" },
];

async function renderChecklist(done: Record<string, boolean> = {}) {
  const onToggle = jest.fn();
  const onReset = jest.fn();
  await renderWithTheme(
    <PilgrimageChecklistView items={items} done={done} onToggle={onToggle} onReset={onReset} />,
  );
  return { onToggle, onReset };
}

describe("PilgrimageChecklistView", () => {
  afterEach(resetMockWindowSize);

  it("groups rites by day and shows locations", async () => {
    await renderChecklist();
    expect(screen.getByText("8 Dhul-Hijjah")).toBeTruthy();
    expect(screen.getByText("Miqat")).toBeTruthy();
    expect(screen.getByText("0 of 3 rites")).toBeTruthy();
  });

  it("toggles a rite", async () => {
    const { onToggle } = await renderChecklist();
    await fireEvent.press(screen.getByLabelText("Tawaf"));
    expect(onToggle).toHaveBeenCalledWith("tawaf");
  });

  it("marks completed rites as checked and offers a reset", async () => {
    await renderChecklist({ ihram: true });
    expect(screen.getByText("1 of 3 rites")).toBeTruthy();
    expect(screen.getByLabelText("Enter ihram").props.accessibilityState).toEqual(
      expect.objectContaining({ checked: true }),
    );
    expect(screen.getByText("Reset")).toBeTruthy();
  });

  it("resets after confirmation", async () => {
    const { onReset } = await renderChecklist({ ihram: true });
    await fireEvent.press(screen.getByText("Reset"));
    await fireEvent.press(screen.getAllByText("Reset")[1]);
    expect(onReset).toHaveBeenCalled();
  });

  it("cancels the reset", async () => {
    const { onReset } = await renderChecklist({ ihram: true });
    await fireEvent.press(screen.getByText("Reset"));
    await fireEvent.press(screen.getByText("Cancel"));
    expect(onReset).not.toHaveBeenCalled();
  });

  it("handles an empty checklist", async () => {
    await renderWithTheme(
      <PilgrimageChecklistView items={[]} done={{}} onToggle={jest.fn()} onReset={jest.fn()} />,
    );
    expect(screen.getByText("0 of 0 rites")).toBeTruthy();
  });

  it("pins progress in a side column on wide screens", async () => {
    setMockWindowSize(1400);
    await renderChecklist();
    expect(screen.getByText("0 of 3 rites")).toBeTruthy();
    expect(screen.getByLabelText("Go to Mina")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("keeps rites toggleable", async () => {
      const { onToggle } = await renderChecklist();
      await fireEvent.press(screen.getByLabelText("Enter ihram"));
      expect(onToggle).toHaveBeenCalledWith("ihram");
    });
  });
});
