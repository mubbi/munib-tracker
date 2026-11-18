import { fireEvent, screen } from "@testing-library/react-native";

import { PracticeAyahResult } from "@/components/quran/practice-ayah-result";
import { type AyahPracticeState, createAyahState } from "@/lib/quran-companion/reduce-session";
import type { FeedbackTiming, WordState } from "@/lib/quran-companion/types";
import { renderWithTheme } from "@/test-support/render";

const WORDS = ["بِسْمِ", "ٱللَّهِ", "ٱلرَّحْمَٰنِ", "ٱلرَّحِيمِ"];

function ayahWith(states: WordState[]): AyahPracticeState {
  return { ...createAyahState(1, WORDS.slice(0, states.length), null), states };
}

type ResultOptions = {
  states?: WordState[];
  timing?: FeedbackTiming;
  isLast?: boolean;
  canFinish?: boolean;
};

async function renderResult({
  states = ["matched", "matched"],
  timing = "ayah",
  isLast = false,
  canFinish = true,
}: ResultOptions = {}) {
  const handlers = {
    onNext: jest.fn(),
    onRetry: jest.fn(),
    onHear: jest.fn(),
    onHearWord: jest.fn(),
    onFinish: jest.fn(),
  };
  await renderWithTheme(
    <PracticeAyahResult
      ayah={ayahWith(states)}
      timing={timing}
      isLast={isLast}
      canFinish={canFinish}
      {...handlers}
    />,
  );
  return handlers;
}

describe("PracticeAyahResult", () => {
  it.each<[string, WordState[], string]>([
    ["all matched", ["matched", "corrected"], "Every word matched"],
    ["try again", ["matched", "confirmedMismatch"], "Try 1 word again"],
    ["missed", ["matched", "upcoming", "upcoming"], "2 words were not reached"],
    ["not sure", ["matched", "uncertain"], "The listener wasn't sure about 1 word"],
    ["nothing heard", ["upcoming", "upcoming"], "The listener didn't catch any words"],
  ])("headlines a %s take", async (_name, states, headline) => {
    await renderResult({ states });
    expect(screen.getByText(headline)).toBeTruthy();
  });

  it("counts heard words against the total", async () => {
    await renderResult({ states: ["matched", "corrected", "uncertain", "upcoming"] });
    expect(screen.getByText("2 of 4 words heard")).toBeTruthy();
    expect(screen.getByLabelText("Matched: 2")).toBeTruthy();
    expect(screen.getByLabelText("Not sure: 1")).toBeTruthy();
    expect(screen.getByLabelText("Missed: 1")).toBeTruthy();
    expect(screen.getByLabelText("Try again: 0")).toBeTruthy();
  });

  it("swaps the stats for a tip when nothing was heard", async () => {
    await renderResult({ states: ["upcoming"] });
    expect(screen.getByText(/Recite a little louder/)).toBeTruthy();
    expect(screen.queryByLabelText("Matched: 0")).toBeNull();
  });

  it.each([
    ["Try these again", ["confirmedMismatch", "matched"] as WordState[]],
    ["Not sure", ["uncertain", "matched"] as WordState[]],
    ["Not reached", ["upcoming", "matched"] as WordState[]],
  ])("lists the words under %s and plays one on tap", async (group, states) => {
    const { onHearWord } = await renderResult({ states });
    expect(screen.getAllByText(group).length).toBeGreaterThan(0);
    await fireEvent.press(screen.getByLabelText(`${WORDS[0]}, Plays this word`));
    expect(onHearWord).toHaveBeenCalledWith(0);
  });

  it("keeps word groups hidden when feedback waits for the end", async () => {
    await renderResult({ states: ["confirmedMismatch", "matched"], timing: "end" });
    expect(screen.queryByText("Try these again")).toBeNull();
  });

  it("offers the next ayah after an all-matched take", async () => {
    const { onNext } = await renderResult();
    await fireEvent.press(screen.getByText("Next ayah"));
    expect(onNext).toHaveBeenCalled();
  });

  it("offers to finish an all-matched last ayah", async () => {
    const { onFinish } = await renderResult({ isLast: true });
    await fireEvent.press(screen.getByText("Finish and see summary"));
    expect(onFinish).toHaveBeenCalled();
  });

  it("blocks finishing while the session cannot finish yet", async () => {
    const { onFinish } = await renderResult({ isLast: true, canFinish: false });
    await fireEvent.press(screen.getByText("Finish and see summary"));
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("asks for another take and still allows moving on", async () => {
    const { onRetry, onNext } = await renderResult({ states: ["confirmedMismatch"] });
    await fireEvent.press(screen.getByText("Recite again"));
    await fireEvent.press(screen.getByText("Move on to the next ayah"));
    expect(onRetry).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
  });

  it("links to the summary from an imperfect last ayah", async () => {
    const { onFinish } = await renderResult({ states: ["uncertain"], isLast: true });
    await fireEvent.press(screen.getByText("Finish and see summary"));
    expect(onFinish).toHaveBeenCalled();
  });

  it("disables the summary link while the session cannot finish yet", async () => {
    const { onFinish } = await renderResult({
      states: ["uncertain"],
      isLast: true,
      canFinish: false,
    });
    await fireEvent.press(screen.getByText("Finish and see summary"));
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("plays the reference recitation", async () => {
    const { onHear } = await renderResult();
    await fireEvent.press(screen.getByText("Hear"));
    expect(onHear).toHaveBeenCalled();
  });
});
