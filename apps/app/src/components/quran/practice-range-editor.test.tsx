import { fireEvent, screen } from "@testing-library/react-native";

import { PracticeRangeEditor } from "@/components/quran/practice-range-editor";
import type { Passage } from "@/lib/quran-companion/types";
import { renderWithTheme } from "@/test-support/render";

// Al-Fatihah has 7 ayahs.
const FATIHAH = 1;

async function renderEditor(value: Partial<Passage> = {}) {
  const onChange = jest.fn();
  await renderWithTheme(
    <PracticeRangeEditor
      value={{ surah: FATIHAH, ayahStart: 2, ayahEnd: 4, ...value }}
      onChange={onChange}
    />,
  );
  return { onChange };
}

const button = (name: string) => screen.getByLabelText(name);

describe("PracticeRangeEditor", () => {
  it("shows both ends of the range", async () => {
    await renderEditor();
    expect(screen.getByLabelText("From ayah: 2")).toBeTruthy();
    expect(screen.getByLabelText("To ayah: 4")).toBeTruthy();
  });

  it.each([
    ["Increase From ayah", { surah: FATIHAH, ayahStart: 3, ayahEnd: 4 }],
    ["Decrease From ayah", { surah: FATIHAH, ayahStart: 1, ayahEnd: 4 }],
    ["Increase To ayah", { surah: FATIHAH, ayahStart: 2, ayahEnd: 5 }],
    ["Decrease To ayah", { surah: FATIHAH, ayahStart: 2, ayahEnd: 3 }],
  ])("%s steps by one", async (label, expected) => {
    const { onChange } = await renderEditor();
    await fireEvent.press(button(label));
    expect(onChange).toHaveBeenCalledWith(expected);
  });

  it("drags the end along when From moves past it", async () => {
    const { onChange } = await renderEditor({ ayahStart: 4, ayahEnd: 4 });
    await fireEvent.press(button("Increase From ayah"));
    expect(onChange).toHaveBeenCalledWith({ surah: FATIHAH, ayahStart: 5, ayahEnd: 5 });
  });

  it("clamps a long-press jump to the surah length", async () => {
    const { onChange } = await renderEditor();
    await fireEvent(button("Increase To ayah"), "longPress");
    expect(onChange).toHaveBeenCalledWith({ surah: FATIHAH, ayahStart: 2, ayahEnd: 7 });
  });

  it("clamps a long-press jump back to the first ayah", async () => {
    const { onChange } = await renderEditor({ ayahStart: 3, ayahEnd: 3 });
    await fireEvent(button("Decrease From ayah"), "longPress");
    expect(onChange).toHaveBeenCalledWith({ surah: FATIHAH, ayahStart: 1, ayahEnd: 3 });
  });

  it("disables steps that would leave the surah or invert the range", async () => {
    await renderEditor({ ayahStart: 1, ayahEnd: 7 });
    expect(button("Decrease From ayah")).toBeDisabled();
    expect(button("Increase To ayah")).toBeDisabled();
    expect(button("Increase From ayah")).toBeEnabled();
  });

  it("keeps To from dropping below From", async () => {
    await renderEditor({ ayahStart: 3, ayahEnd: 3 });
    expect(button("Decrease To ayah")).toBeDisabled();
  });
});
