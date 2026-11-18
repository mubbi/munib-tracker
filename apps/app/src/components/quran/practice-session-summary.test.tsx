import { fireEvent, screen } from "@testing-library/react-native";

import {
  PracticeSessionSummary,
  type SummaryAction,
} from "@/components/quran/practice-session-summary";
import type { PracticeSummary } from "@/lib/quran-companion/types";
import { buildPracticeSummary } from "@/test-support/fixtures/quran-companion";
import { renderWithTheme } from "@/test-support/render";

const ICON = { ios: "mic.fill", android: "mic", web: "mic" } as const;

function action(label: string): SummaryAction {
  return { label, icon: ICON, onPress: jest.fn() };
}

/** A listener session (the fixture default is listen-only). */
const recited = (overrides: Partial<PracticeSummary> = {}) =>
  buildPracticeSummary({ engine: "tilawa-zipformer", engineVersion: "1", ...overrides });

async function renderSummary({
  summary = recited(),
  secondary = action("Practise again"),
  progress = null,
}: {
  summary?: PracticeSummary;
  secondary?: SummaryAction | null;
  progress?: { n: number; total: number } | null;
} = {}) {
  const primary = action("Done");
  const onHear = jest.fn();
  const onOpenAyah = jest.fn();
  await renderWithTheme(
    <PracticeSessionSummary
      summary={summary}
      primary={primary}
      secondary={secondary}
      onHear={onHear}
      onOpenAyah={onOpenAyah}
      progress={progress}
    />,
  );
  return { primary, secondary, onHear, onOpenAyah };
}

describe("PracticeSessionSummary", () => {
  it.each<[string, Partial<PracticeSummary>, string]>([
    ["listen-only", { engine: "none" }, "You listened to this passage"],
    ["silent", { matched: 0, notReached: 3 }, "The listener didn't catch any words"],
    ["try-again", { matched: 5, confirmedMismatch: 2 }, "Try 2 words again"],
    ["missed", { matched: 5, notReached: 1 }, "1 word was not reached"],
    ["not-sure", { matched: 5, uncertain: 2 }, "The listener wasn't sure about 2 words"],
    ["perfect", { matched: 7 }, "Every word matched"],
  ])("headlines a %s session", async (_name, overrides, headline) => {
    const summary =
      overrides.engine === "none" ? buildPracticeSummary(overrides) : recited(overrides);
    await renderSummary({ summary });
    expect(screen.getByText(headline)).toBeTruthy();
  });

  it("explains how to get the listener after a listen-only session", async () => {
    await renderSummary({ summary: buildPracticeSummary() });
    expect(screen.getByText(/Download the listener/)).toBeTruthy();
    expect(screen.queryByLabelText(/^Matched:/)).toBeNull();
  });

  it("shows a tip instead of zeros when nothing was heard", async () => {
    await renderSummary({ summary: recited({ matched: 0 }) });
    expect(screen.getByText(/Recite a little louder/)).toBeTruthy();
    expect(screen.queryByLabelText(/^Matched:/)).toBeNull();
  });

  it("breaks the words down by outcome", async () => {
    await renderSummary({
      summary: recited({ matched: 4, corrected: 1, confirmedMismatch: 1, notReached: 1 }),
    });
    expect(screen.getByText("5 of 7 words heard")).toBeTruthy();
    expect(screen.getByLabelText("Matched: 5")).toBeTruthy();
    expect(screen.getByLabelText("Try again: 1")).toBeTruthy();
    expect(screen.getByLabelText("Not sure: 0")).toBeTruthy();
    expect(screen.getByLabelText("Missed: 1")).toBeTruthy();
  });

  it("drops the try-again stat when mismatches cannot be confirmed", async () => {
    await renderSummary({
      summary: recited({ matched: 5, confirmedMismatch: 2, mismatchesUnconfirmed: true }),
    });
    expect(screen.queryByLabelText(/^Try again:/)).toBeNull();
    expect(screen.getByLabelText("Not sure: 2")).toBeTruthy();
  });

  it("opens a weak ayah of a multi-ayah passage", async () => {
    const { onOpenAyah } = await renderSummary({
      summary: recited({ matched: 5, confirmedMismatch: 2, weakAyahs: [3] }),
    });
    expect(screen.getByText("Ayahs to practise again")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Practise ayah 3 again"));
    expect(onOpenAyah).toHaveBeenCalledWith(3);
  });

  it.each<[string, Partial<PracticeSummary>]>([
    ["a single-ayah passage", { ayahEnd: 1 }],
    ["a listen-only session", { engine: "none" }],
  ])("does not list weak ayahs for %s", async (_name, overrides) => {
    await renderSummary({
      summary: buildPracticeSummary({
        engine: "tilawa-zipformer",
        confirmedMismatch: 2,
        weakAyahs: [1],
        ...overrides,
      }),
    });
    expect(screen.queryByText("Ayahs to practise again")).toBeNull();
  });

  it("shows revision sitting progress", async () => {
    await renderSummary({ progress: { n: 2, total: 5 } });
    expect(screen.getByText("Revision")).toBeTruthy();
    expect(screen.getByText("2 of 5")).toBeTruthy();
  });

  it("wires the primary, hear and secondary actions", async () => {
    const { primary, secondary, onHear } = await renderSummary();
    await fireEvent.press(screen.getByText("Done"));
    await fireEvent.press(screen.getByText("Hear this ayah"));
    await fireEvent.press(screen.getByText("Practise again"));
    expect(primary.onPress).toHaveBeenCalled();
    expect(onHear).toHaveBeenCalled();
    expect(secondary?.onPress).toHaveBeenCalled();
  });

  it("omits the secondary action when there is none", async () => {
    await renderSummary({ secondary: null });
    expect(screen.queryByText("Practise again")).toBeNull();
  });
});
