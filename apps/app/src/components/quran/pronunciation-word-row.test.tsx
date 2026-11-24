import { fireEvent, screen } from "@testing-library/react-native";

import { PracticeWordRow } from "@/components/quran/practice-word-row";
import en from "@/i18n/en.json";
import type { PronunciationWordState } from "@/lib/quran-pronunciation/types";
import { renderWithTheme } from "@/test-support/render";

const WORDS = ["قُلْ", "هُوَ", "ٱللَّهُ"];

async function renderRow(
  pronunciation: (PronunciationWordState | null)[],
  mode: "full" | "skipped-only" = "full",
) {
  const onWordPress = jest.fn();
  await renderWithTheme(
    <PracticeWordRow
      words={WORDS}
      states={[]}
      hidden={new Set()}
      activeIndex={null}
      hearIndex={null}
      fontSize={28}
      markStyle="underline"
      onWordPress={onWordPress}
      pronunciation={pronunciation}
      pronunciationMode={mode}
    />,
  );
  return { onWordPress };
}

describe("PracticeWordRow — NF-3.24 pronunciation states", () => {
  it("labels each word Clear / Listen again / Not sure and lets every checked word be heard", async () => {
    const { onWordPress } = await renderRow(["clear", "listen-again", "not-sure"]);
    expect(screen.getByLabelText(`${WORDS[0]}, Clear`)).toBeTruthy();
    expect(screen.getByLabelText(`${WORDS[1]}, Listen again`)).toBeTruthy();
    expect(screen.getByLabelText(`${WORDS[2]}, Not sure`)).toBeTruthy();
    fireEvent.press(screen.getByLabelText(`${WORDS[1]}, Listen again`));
    expect(onWordPress).toHaveBeenCalledWith(1);
  });

  it("uses the fallback wording in skipped-only mode", async () => {
    await renderRow(["clear", "listen-again", null], "skipped-only");
    expect(screen.getByLabelText(`${WORDS[0]}, Heard`)).toBeTruthy();
    expect(screen.getByLabelText(`${WORDS[1]}, Skipped or unclear`)).toBeTruthy();
    expect(screen.getByLabelText(WORDS[2])).toBeTruthy();
  });
});

describe("pronunciation copy (D20 copy rules)", () => {
  const strings = JSON.stringify((en as Record<string, unknown>).quranPronunciation).toLowerCase();

  it("never shows a score, percentage, grade or correct / wrong wording", () => {
    for (const banned of ["score", "grade", "correct", "wrong", "mistake", "accuracy", "valid"]) {
      expect(strings).not.toContain(banned);
    }
    // The only percentage is the model download progress.
    expect(strings.match(/%/g)?.length ?? 0).toBe(1);
  });

  it("always carries the teacher recommendation and its reference", () => {
    const copy = (
      en as { quranPronunciation: { copy: { teacher: string }; refs: { teacher: string } } }
    ).quranPronunciation;
    expect(copy.copy.teacher).toMatch(/qualified teacher/);
    expect(copy.refs.teacher).toBe("Sahih al-Bukhari 5027");
  });
});
