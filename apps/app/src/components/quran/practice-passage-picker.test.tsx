import { fireEvent, screen } from "@testing-library/react-native";

import { PracticePassagePicker } from "@/components/quran/practice-passage-picker";
import type { Passage } from "@/lib/quran-companion/types";
import { getSurahByNumber } from "@/lib/quran-meta";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

// Al-Fatihah: 7 ayahs. Al-Ikhlas (112): 4 ayahs.
const FATIHAH = getSurahByNumber(1)?.nameTransliteration ?? "";
const IKHLAS = getSurahByNumber(112)?.nameTransliteration ?? "";

async function renderPicker({
  initial = { surah: 1, ayahStart: 2, ayahEnd: 3 },
  visible = true,
}: {
  initial?: Passage | null;
  visible?: boolean;
} = {}) {
  const onSelect = jest.fn();
  const onClose = jest.fn();
  const view = await renderWithTheme(
    <PracticePassagePicker
      visible={visible}
      initial={initial}
      onClose={onClose}
      onSelect={onSelect}
    />,
  );
  return { onSelect, onClose, view };
}

const press = (label: string | RegExp) => fireEvent.press(screen.getByLabelText(label));
const confirm = (passage: string) => fireEvent.press(screen.getByText(`Practise ${passage}`));

describe("PracticePassagePicker", () => {
  it("renders nothing while closed", async () => {
    await renderPicker({ visible: false });
    expect(screen.queryByText("Choose what to practise")).toBeNull();
  });

  it("opens on the ayah step for the current passage", async () => {
    await renderPicker();
    expect(screen.getByLabelText("Ayah 2")).toBeSelected();
    expect(screen.getByText(`Practise ${FATIHAH} 2–3`)).toBeTruthy();
  });

  it("confirms the passage as shown", async () => {
    const { onSelect } = await renderPicker();
    await confirm(`${FATIHAH} 2–3`);
    expect(onSelect).toHaveBeenCalledWith({ surah: 1, ayahStart: 2, ayahEnd: 3 });
  });

  it("starts on the surah list when there is no passage yet", async () => {
    await renderPicker({ initial: null });
    expect(screen.getByLabelText("Search surah by name or number")).toBeTruthy();
    expect(screen.getByLabelText(/^1\. /)).toBeSelected();
  });

  it("filters the surah list and picks a surah", async () => {
    const { onSelect } = await renderPicker({ initial: null });
    await fireEvent.changeText(screen.getByLabelText("Search surah by name or number"), "112");
    expect(screen.queryByLabelText(/^1\. /)).toBeNull();
    await press(/^112\. /);
    await confirm(`${IKHLAS} 1`);
    expect(onSelect).toHaveBeenCalledWith({ surah: 112, ayahStart: 1, ayahEnd: 1 });
  });

  it("goes back to the surah list from the ayah step", async () => {
    await renderPicker();
    await press("Change surah");
    expect(screen.getByLabelText("Search surah by name or number")).toBeTruthy();
  });

  it("pushes the end along when the start moves past it", async () => {
    await renderPicker();
    await press("Ayah 5");
    expect(screen.getByText(`Practise ${FATIHAH} 5`)).toBeTruthy();
  });

  it("keeps the end when the start moves back", async () => {
    await renderPicker();
    await press("Ayah 1");
    expect(screen.getByText(`Practise ${FATIHAH} 1–3`)).toBeTruthy();
  });

  it.each([
    ["Increase End at ayah", "2–4"],
    ["Decrease End at ayah", "2"],
  ])("%s steps the end", async (label, range) => {
    await renderPicker();
    await press(label);
    expect(screen.getByText(`Practise ${FATIHAH} ${range}`)).toBeTruthy();
  });

  it("stops the end at the last ayah", async () => {
    await renderPicker({ initial: { surah: 1, ayahStart: 1, ayahEnd: 7 } });
    await press("Increase End at ayah");
    expect(screen.getByText(`Practise ${FATIHAH} 1–7`)).toBeTruthy();
  });

  it.each([
    ["This ayah", "2"],
    ["Next 5", "2–6"],
    ["To the end", "2–7"],
  ])("the %s shortcut sets the end", async (shortcut, range) => {
    await renderPicker();
    await fireEvent.press(screen.getByText(shortcut));
    expect(screen.getByText(`Practise ${FATIHAH} ${range}`)).toBeTruthy();
  });

  it("resets to the passage each time it reopens", async () => {
    const { view } = await renderPicker();
    await press("Ayah 5");
    const initial = { surah: 1, ayahStart: 2, ayahEnd: 3 };
    await view.rerender(
      <PracticePassagePicker
        visible={false}
        initial={initial}
        onClose={jest.fn()}
        onSelect={jest.fn()}
      />,
    );
    await view.rerender(
      <PracticePassagePicker visible initial={initial} onClose={jest.fn()} onSelect={jest.fn()} />,
    );
    expect(screen.getByText(`Practise ${FATIHAH} 2–3`)).toBeTruthy();
  });

  it("closes from the sheet", async () => {
    const { onClose } = await renderPicker();
    await fireEvent.press(screen.getByTestId("sheet-close"));
    expect(onClose).toHaveBeenCalled();
  });
});
