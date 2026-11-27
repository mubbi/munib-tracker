import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { FlashCardPlayer } from "@/components/flash-cards/flash-card-player";
import type { StudyMcq } from "@/lib/flash-cards";
import {
  MOCK_INTERACTIVE_TARGET,
  pressWebKey,
  resetWebKeyHandlerMock,
  webKeyHandlerState,
} from "@/test-support/mocks/web-key-handler";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/hooks/use-web-key-handler",
  () => require("@/test-support/mocks/web-key-handler").webKeyHandlerMock,
);

/** Every card shares the same options so assertions don't depend on shuffle order. */
function card(id: string, categoryLabelKey?: string): StudyMcq {
  return {
    id,
    sourceId: "quran",
    prompt: `Prompt ${id}`,
    options: ["Right", "Wrong", "Other"],
    correctIndex: 0,
    explanation: `Because ${id}`,
    categoryLabelKey,
  };
}

const pool = [card("q1", "flashCards.category.quran"), card("q2", "missing.key"), card("q3")];

async function renderPlayer(cards: StudyMcq[] = pool) {
  return renderWithTheme(
    <FlashCardPlayer pool={cards} intro={<Text>Intro</Text>} footer={<Text>Footer</Text>} />,
  );
}

describe("FlashCardPlayer", () => {
  beforeEach(resetWebKeyHandlerMock);

  it("shows the empty state with intro and footer when the pool is empty", async () => {
    await renderPlayer([]);
    expect(screen.getByText(/Building your flash card deck/)).toBeTruthy();
    expect(screen.getByText("Intro")).toBeTruthy();
    expect(screen.getByText("Footer")).toBeTruthy();
  });

  it("ignores keys when there is no card", async () => {
    await renderPlayer([]);
    expect(await pressWebKey("a")).toBeUndefined();
  });

  it("starts unanswered with the answer hint", async () => {
    await renderPlayer();
    expect(screen.getByText("0 cards studied")).toBeTruthy();
    expect(screen.getByText(/Choose an answer/)).toBeTruthy();
  });

  it("reveals the explanation after a correct answer", async () => {
    await renderPlayer();
    await fireEvent.press(screen.getByLabelText("A. Right"));
    expect(screen.getByText("Correct")).toBeTruthy();
    expect(screen.getByText("Nice — locked in")).toBeTruthy();
    expect(screen.getByText(/^Because q/)).toBeTruthy();
  });

  it("marks a wrong answer and disables the options", async () => {
    await renderPlayer();
    await fireEvent.press(screen.getByLabelText("B. Wrong"));
    expect(screen.getByText("Almost — here's the idea")).toBeTruthy();
    expect(screen.getByLabelText("B. Wrong").props.accessibilityState).toEqual(
      expect.objectContaining({ checked: true, disabled: true }),
    );
  });

  it("advances to the next card and counts it as studied", async () => {
    await renderPlayer();
    await fireEvent.press(screen.getByLabelText("A. Right"));
    await fireEvent.press(screen.getByText("Next card"));
    expect(screen.getByText("1 cards studied")).toBeTruthy();
    expect(screen.queryByText("Nice — locked in")).toBeNull();
  });

  it("skips to another card", async () => {
    await renderPlayer();
    await fireEvent.press(screen.getByText("Skip"));
    expect(screen.getByText(/Prompt q/)).toBeTruthy();
    expect(screen.getByText("0 cards studied")).toBeTruthy();
  });

  it("shows translated category chips", async () => {
    await renderPlayer([card("solo", "flashCards.category.quran")]);
    expect(screen.getByText("Qur'an")).toBeTruthy();
  });

  it("cannot skip the last remaining card but reshuffles after answering it", async () => {
    await renderPlayer([card("solo")]);
    expect(await pressWebKey("ArrowRight")).toBe(true);
    await fireEvent.press(screen.getByLabelText("C. Other"));
    await fireEvent.press(screen.getByText("Next card"));
    expect(screen.getByText("Prompt solo")).toBeTruthy();
    expect(screen.getByText("1 cards studied")).toBeTruthy();
  });

  describe("web keyboard shortcuts", () => {
    it.each(["Escape", "Enter", "d"])("ignores %s before answering", async (key) => {
      await renderPlayer();
      expect(await pressWebKey(key)).toBeUndefined();
    });

    it("answers with a digit key", async () => {
      await renderPlayer();
      expect(await pressWebKey("1")).toBe(true);
      expect(screen.getByText("Nice — locked in")).toBeTruthy();
    });

    it("ignores option keys once answered", async () => {
      await renderPlayer();
      await pressWebKey("a");
      expect(await pressWebKey("b")).toBeUndefined();
    });

    it("lets a focused button keep Enter", async () => {
      await renderPlayer();
      await pressWebKey("a");
      expect(await pressWebKey("Enter", MOCK_INTERACTIVE_TARGET)).toBeUndefined();
    });

    it.each(["Enter", "ArrowRight"])("advances with %s after answering", async (key) => {
      await renderPlayer();
      await pressWebKey("a");
      expect(await pressWebKey(key)).toBe(true);
      expect(screen.getByText("1 cards studied")).toBeTruthy();
    });
  });

  it("restarts the deck when the pool changes", async () => {
    const utils = await renderPlayer([card("x")]);
    await utils.rerender(<FlashCardPlayer pool={[card("y")]} />);
    expect(screen.getByText("Prompt y")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("disables web shortcuts and focuses the first option", async () => {
      await renderPlayer([card("x")]);
      expect(webKeyHandlerState.enabled).toBe(false);
      expect(screen.getByLabelText("A. Right")).toBeTruthy();
    });
  });

  it("exposes the options as a radio group with a live feedback region", async () => {
    await renderPlayer();
    expect(screen.getAllByRole("radio").length).toBeGreaterThanOrEqual(3);
    await fireEvent.press(screen.getByLabelText("B. Wrong"));
    expect(screen.getByText("Almost — here's the idea")).toBeTruthy();
  });
});
