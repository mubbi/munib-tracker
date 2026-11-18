import { fireEvent, screen } from "@testing-library/react-native";
import { View } from "react-native";

import { PracticeWordRow } from "@/components/quran/practice-word-row";
import type { WordState } from "@/lib/quran-companion/types";
import { renderWithTheme } from "@/test-support/render";

const WORDS = ["بِسْمِ", "ٱللَّهِ", "ٱلرَّحْمَٰنِ", "ٱلرَّحِيمِ"];

type RowProps = Partial<Parameters<typeof PracticeWordRow>[0]>;

async function renderRow(props: RowProps = {}) {
  const onWordPress = jest.fn();
  await renderWithTheme(
    <PracticeWordRow
      words={WORDS}
      states={["matched", "uncertain", "confirmedMismatch", "upcoming"]}
      hidden={new Set()}
      activeIndex={null}
      hearIndex={null}
      fontSize={28}
      markStyle="underline"
      onWordPress={onWordPress}
      {...props}
    />,
  );
  return { onWordPress };
}

describe("PracticeWordRow", () => {
  it.each<[WordState, string]>([
    ["matched", "matched"],
    ["corrected", "matched on the second try"],
    ["uncertain", "not sure"],
    ["upcoming", "not yet"],
  ])("puts the %s state in the word's label", async (state, label) => {
    await renderRow({ words: [WORDS[0]], states: [state] });
    expect(screen.getByLabelText(`${WORDS[0]}, ${label}`)).toBeTruthy();
  });

  it("labels an idle word with the word alone", async () => {
    await renderRow({ words: [WORDS[0]], states: [] });
    expect(screen.getByLabelText(WORDS[0])).toBeTruthy();
  });

  it("hides a word behind a placeholder with its position as the label", async () => {
    await renderRow({ hidden: new Set([1]) });
    expect(screen.getByLabelText("Hidden word 2")).toBeTruthy();
    expect(screen.queryByText(WORDS[1])).toBeNull();
  });

  it("lets a try-again word be tapped to hear it", async () => {
    const { onWordPress } = await renderRow();
    const word = screen.getByLabelText(`${WORDS[2]}, try again`);
    expect(word).toHaveAccessibleName(`${WORDS[2]}, try again`);
    await fireEvent.press(word);
    expect(onWordPress).toHaveBeenCalledWith(2);
  });

  it("does not make a hidden try-again word pressable", async () => {
    await renderRow({ hidden: new Set([2]) });
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("does not make words pressable without a handler", async () => {
    await renderRow({ onWordPress: undefined });
    expect(screen.queryByRole("button")).toBeNull();
  });

  it.each(["underline", "dot"] as const)(
    "renders %s marks with a custom font family",
    async (markStyle) => {
      await renderRow({ markStyle, fontFamily: "Amiri", activeIndex: 0, hearIndex: 1 });
      expect(screen.getByText(WORDS[0])).toHaveStyle({ fontFamily: "Amiri" });
    },
  );

  it("dims words that have not been reached yet", async () => {
    await renderRow();
    expect(screen.getByText(WORDS[3])).not.toHaveStyle({
      color: screen.getByText(WORDS[0]).props.style.color,
    });
  });

  it("reports where the active word sits so the screen can keep it in view", async () => {
    const measure = jest
      .spyOn(View.prototype, "measureInWindow")
      .mockImplementation((cb) => cb(0, 120, 30, 40));
    const onActiveWordMeasured = jest.fn();
    await renderRow({ activeIndex: 0, onActiveWordMeasured });
    expect(onActiveWordMeasured).toHaveBeenCalledWith({ y: 120, height: 40 });
    measure.mockRestore();
  });

  it("ignores a zero-height measurement", async () => {
    const measure = jest
      .spyOn(View.prototype, "measureInWindow")
      .mockImplementation((cb) => cb(0, 120, 30, 0));
    const onActiveWordMeasured = jest.fn();
    await renderRow({ activeIndex: 0, onActiveWordMeasured });
    expect(onActiveWordMeasured).not.toHaveBeenCalled();
    measure.mockRestore();
  });
});
