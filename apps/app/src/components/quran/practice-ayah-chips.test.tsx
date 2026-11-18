import { fireEvent, screen } from "@testing-library/react-native";
import { ScrollView } from "react-native";

import { type AyahChipState, PracticeAyahChips } from "@/components/quran/practice-ayah-chips";
import { renderWithTheme } from "@/test-support/render";

// Measuring a real scroll view is native-only; record the calls instead.
const scrollTo = jest.spyOn(ScrollView.prototype, "scrollTo").mockImplementation(() => {});

const STATES: Record<number, AyahChipState> = { 1: "done", 2: "retry", 3: "current", 4: "todo" };

async function renderChips({
  states = STATES,
  disabled = false,
}: {
  states?: Record<number, AyahChipState>;
  disabled?: boolean;
} = {}) {
  const onSelect = jest.fn();
  scrollTo.mockClear();
  await renderWithTheme(
    <PracticeAyahChips
      ayahs={Object.keys(states).map(Number)}
      stateOf={(ayah) => states[ayah] ?? "todo"}
      disabled={disabled}
      onSelect={onSelect}
    />,
  );
  return { onSelect, scrollTo };
}

describe("PracticeAyahChips", () => {
  it.each([
    ["Ayah 1, done"],
    ["Ayah 2, words to try again"],
    ["Ayah 3, current"],
    ["Ayah 4, not yet"],
  ])("labels each chip with its state: %s", async (label) => {
    await renderChips();
    expect(screen.getByLabelText(label)).toBeTruthy();
  });

  it("marks the current ayah as selected", async () => {
    await renderChips();
    expect(screen.getByLabelText("Ayah 3, current")).toBeSelected();
    expect(screen.getByLabelText("Ayah 1, done")).not.toBeSelected();
  });

  it("reports the index of the tapped chip", async () => {
    const { onSelect } = await renderChips();
    await fireEvent.press(screen.getByLabelText("Ayah 2, words to try again"));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("ignores taps while the mic is live", async () => {
    const { onSelect } = await renderChips({ disabled: true });
    await fireEvent.press(screen.getByLabelText("Ayah 2, words to try again"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("scrolls the current chip into view", async () => {
    const { scrollTo } = await renderChips();
    expect(scrollTo).toHaveBeenCalledWith({ x: expect.any(Number), animated: false });
  });

  it("does not scroll when no ayah is current", async () => {
    const { scrollTo } = await renderChips({ states: { 1: "done", 2: "todo" } });
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
