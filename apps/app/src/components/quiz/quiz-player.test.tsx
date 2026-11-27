import { act, fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { QuizPlayer, type QuizPlayerQuestion } from "@/components/quiz/quiz-player";
import { captureAnimationFrames } from "@/test-support/animation-frames";
import { installBrowser } from "@/test-support/browser";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { setPlatform, usePlatform } from "@/test-support/platform";
import { queryHostsByRole } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
// Imported transitively (learn layout → reading typography → audio provider); never played.

/** Scored multiple-choice question; options are `"<id> A" | "<id> B" | "<id> C"`. */
function buildQuestion(overrides: Partial<QuizPlayerQuestion> = {}): QuizPlayerQuestion {
  const id = overrides.id ?? "q1";
  return {
    id,
    prompt: `Prompt ${id}`,
    options: [`${id} A`, `${id} B`, `${id} C`],
    correctIndex: 0,
    explanation: `Because ${id}`,
    type: "mcq",
    ...overrides,
  };
}

const reflection: QuizPlayerQuestion = {
  id: "r1",
  prompt: "Reflect on this",
  explanation: "Reflection explanation",
  type: "reflection",
};

const questionsWithIds = (...ids: string[]) => ids.map((id) => buildQuestion({ id }));

type QuizProps = Parameters<typeof QuizPlayer>[0];

async function renderQuiz(props: Partial<QuizProps> = {}) {
  return await renderWithTheme(<QuizPlayer questions={questionsWithIds("q1", "q2")} {...props} />);
}

const press = async (name: string) => await fireEvent.press(screen.getByRole("button", { name }));

/** Picks option `picks[i]` (0-based) for each question, then opens the results. */
async function completeQuiz(questions: QuizPlayerQuestion[], picks: number[]) {
  for (const [i, question] of questions.entries()) {
    const option = question.options?.[picks[i] ?? 0];
    await press(`${(picks[i] ?? 0) + 1}. ${option}`);
    await press(i === questions.length - 1 ? "See results" : "Next");
  }
}

// The first render warms the theme + i18n graph, which is slow on a busy machine.

describe("QuizPlayer", () => {
  // Hold the results ring's animation frames so they never fire outside act().
  beforeEach(() => captureAnimationFrames());

  afterEach(() => {
    resetMockWindowSize();
    jest.restoreAllMocks();
  });

  it("renders only the intro and footer when there are no questions", async () => {
    await renderQuiz({
      questions: [],
      intro: <Text>Intro copy</Text>,
      footer: <Text>Footer copy</Text>,
    });
    expect(screen.getByText("Intro copy")).toBeTruthy();
    expect(screen.getByText("Footer copy")).toBeTruthy();
    expect(screen.queryByText(/Question/)).toBeNull();
  });

  it("shows progress, the answered count and the category chip", async () => {
    await renderQuiz({ categoryLabel: (q) => (q.id === "q1" ? "Basics" : undefined) });
    expect(screen.getByText("Question 1 of 2")).toBeTruthy();
    expect(screen.getByText("0 answered")).toBeTruthy();
    expect(screen.getByText("Basics")).toBeTruthy();
    expect(screen.getByText("Choose an answer to see the explanation.")).toBeTruthy();
  });

  it("keeps Next locked until the question is answered", async () => {
    await renderQuiz();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    await press("Next");
    expect(screen.getByText("Question 1 of 2")).toBeTruthy();
  });

  it.each([
    { pick: "1. q1 A", title: "Correct — well done", pill: "Correct" },
    { pick: "3. q1 C", title: "Not quite — here's why", pill: "Incorrect" },
  ])("grades $pick with feedback and the explanation", async ({ pick, title, pill }) => {
    await renderQuiz();
    await press(pick);
    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByText(pill)).toBeTruthy();
    expect(screen.getByText("Because q1")).toBeTruthy();
    expect(screen.getByText("1 answered")).toBeTruthy();
  });

  it("locks the answer after the first pick", async () => {
    await renderQuiz();
    await press("1. q1 A");
    await fireEvent(screen.getByRole("button", { name: "2. q1 B" }), "press");
    expect(screen.getByText("Correct — well done")).toBeTruthy();
    expect(screen.getByRole("button", { name: "2. q1 B" })).not.toBeSelected();
  });

  it.each([
    { tv: false, focus: undefined },
    { tv: true, focus: true },
  ])("gives the first option TV preferred focus only on TV (tv=$tv)", async ({ tv, focus }) => {
    const restore = setPlatform({ isTV: tv });
    try {
      await renderQuiz();
      expect(screen.getByRole("button", { name: "1. q1 A" }).props.hasTVPreferredFocus).toBe(focus);
    } finally {
      restore();
    }
  });

  it("moves between questions with Next and Previous", async () => {
    await renderQuiz();
    await press("1. q1 A");
    await press("Next");
    expect(screen.getByText("Question 2 of 2")).toBeTruthy();
    await press("Previous");
    expect(screen.getByText("Question 1 of 2")).toBeTruthy();
  });

  it.each([
    {
      label: "perfect",
      ids: ["a", "b"],
      picks: [0, 0],
      detail: "2 of 2 scored questions correct",
      message: "Beautiful review — may Allah increase you in beneficial knowledge.",
    },
    {
      label: "strong",
      ids: ["a", "b", "c", "d"],
      picks: [0, 0, 0, 1],
      detail: "3 of 4 scored questions correct",
      message: "Strong understanding. Revisit any misses to lock them in.",
    },
    {
      label: "steady",
      ids: ["a", "b", "c"],
      picks: [0, 0, 1],
      detail: "2 of 3 scored questions correct",
      message: "Good progress. Use the misses as your next study targets.",
    },
    {
      label: "keep going",
      ids: ["a", "b", "c"],
      picks: [0, 1, 2],
      detail: "1 of 3 scored questions correct",
      message: "Every miss is a lesson. Review the notes, then try again.",
    },
  ])(
    "shows the $label encouragement on the results card",
    async ({ ids, picks, detail, message }) => {
      const questions = questionsWithIds(...ids);
      await renderQuiz({ questions });
      await completeQuiz(questions, picks);
      expect(screen.getByText("Quiz complete")).toBeTruthy();
      expect(screen.getByText(detail)).toBeTruthy();
      expect(screen.getByText(message)).toBeTruthy();
    },
  );

  it("lists each answer's status in the review and renders completion actions", async () => {
    const questions = questionsWithIds("q1", "q2");
    await renderQuiz({ questions, completeActions: <Text>Related lesson</Text> });
    await completeQuiz(questions, [0, 1]);
    expect(screen.getByText("Review your answers")).toBeTruthy();
    expect(screen.getAllByText(/· Correct/)).toHaveLength(1);
    expect(screen.getAllByText(/· Incorrect/)).toHaveLength(1);
    expect(screen.getByText("Related lesson")).toBeTruthy();
  });

  it("reopens a question from its review row", async () => {
    const questions = questionsWithIds("q1", "q2");
    await renderQuiz({ questions });
    await completeQuiz(questions, [0, 1]);
    await press("Question 2 of 2. Incorrect. Prompt q2");
    expect(screen.getByText("Question 2 of 2")).toBeTruthy();
    expect(screen.getByText("Not quite — here's why")).toBeTruthy();
  });

  it("restarts from the first question on Try again", async () => {
    const questions = questionsWithIds("q1", "q2");
    await renderQuiz({ questions });
    await completeQuiz(questions, [0, 0]);
    await press("Try again");
    expect(screen.getByText("Question 1 of 2")).toBeTruthy();
    expect(screen.getByText("0 answered")).toBeTruthy();
  });

  it("offers results early once every question is answered", async () => {
    await renderQuiz({ questions: questionsWithIds("q1", "q2", "q3") });
    for (const id of ["q1", "q2"]) {
      await press(`1. ${id} A`);
      await press("Next");
    }
    await press("1. q3 A");
    await press("Previous");
    await press("See results");
    expect(screen.getByText("3 of 3 scored questions correct")).toBeTruthy();
  });

  it("notes a reflection and shows its explanation", async () => {
    await renderQuiz({ questions: [reflection] });
    expect(screen.getByText("Take a moment, then continue when you are ready.")).toBeTruthy();
    await press("I have reflected");
    expect(screen.getByText("Intention noted")).toBeTruthy();
    expect(screen.getByText("Reflection explanation")).toBeTruthy();
  });

  it("counts a reflection in the review without scoring it", async () => {
    await renderQuiz({ questions: [reflection, buildQuestion()] });
    await press("I have reflected");
    await press("Next");
    await press("1. q1 A");
    await press("See results");
    expect(screen.getByText("1 of 1 scored questions correct")).toBeTruthy();
    expect(screen.getAllByText(/· Reflection/)).toHaveLength(1);
  });

  it("skips the review list for a reflection-only quiz", async () => {
    await renderQuiz({ questions: [reflection] });
    await press("I have reflected");
    await press("See results");
    expect(screen.getByText("0 of 0 scored questions correct")).toBeTruthy();
    expect(screen.queryByText("Review your answers")).toBeNull();
  });

  it("highlights a pick without grading an unscored multiple-choice question", async () => {
    await renderQuiz({ questions: [buildQuestion({ id: "u1", correctIndex: undefined })] });
    await press("2. u1 B");
    expect(screen.getByRole("button", { name: "2. u1 B" })).toBeSelected();
    expect(screen.queryByText("Correct — well done")).toBeNull();
    expect(screen.queryByText("Not quite — here's why")).toBeNull();
  });

  it.each([
    { count: 5, max: 5 },
    { count: 12, max: 100 },
  ])("uses a progress bar scaled to $max for $count questions", async ({ count, max }) => {
    setMockWindowSize(1024);
    const ids = Array.from({ length: count }, (_, i) => `m${i}`);
    await renderQuiz({ questions: questionsWithIds(...ids) });
    expect(queryHostsByRole("progressbar")[0]?.props.accessibilityValue).toEqual(
      expect.objectContaining({ max, now: 0 }),
    );
  });

  describe("web keyboard shortcuts", () => {
    usePlatform({ OS: "web" });

    type Listener = (event: Partial<KeyboardEvent>) => void;
    let listeners: Listener[];
    let restoreBrowser: () => void;

    class FakeElement {
      isContentEditable = false;
      constructor(
        readonly tagName: string,
        private readonly control = false,
      ) {}
      closest() {
        return this.control ? this : null;
      }
    }

    beforeEach(() => {
      listeners = [];
      restoreBrowser = installBrowser({
        window: {
          HTMLElement: FakeElement,
          addEventListener: (type: string, fn: Listener) => {
            if (type === "keydown") listeners.push(fn);
          },
          removeEventListener: (_type: string, fn: Listener) => {
            listeners = listeners.filter((l) => l !== fn);
          },
        },
      });
    });

    afterEach(async () => {
      await screen.unmount();
      restoreBrowser();
    });

    /** Dispatches a keydown; returns the event's `preventDefault` spy. */
    const key = async (name: string, extra: Partial<KeyboardEvent> = {}) => {
      const preventDefault = jest.fn();
      await act(async () => {
        for (const listener of listeners)
          listener({ key: name, target: null, preventDefault, ...extra });
      });
      return preventDefault;
    };

    it("shows the keyboard hint on wide screens", async () => {
      setMockWindowSize(1024);
      await renderQuiz();
      expect(screen.getByText(/Press 1–4 to answer, Enter to continue\./)).toBeTruthy();
    });

    it("answers with a digit key", async () => {
      await renderQuiz();
      expect(await key("2")).toHaveBeenCalled();
      expect(screen.getByText("Not quite — here's why")).toBeTruthy();
    });

    it("ignores digits beyond the option count", async () => {
      await renderQuiz();
      expect(await key("9")).not.toHaveBeenCalled();
      expect(screen.getByText("0 answered")).toBeTruthy();
    });

    it("marks a reflection with Enter", async () => {
      await renderQuiz({ questions: [reflection] });
      expect(await key("1")).not.toHaveBeenCalled();
      expect(await key("Enter")).toHaveBeenCalled();
      expect(screen.getByText("Intention noted")).toBeTruthy();
    });

    it("continues with Enter once answered", async () => {
      await renderQuiz();
      await key("1");
      expect(await key("Enter")).toHaveBeenCalled();
      expect(screen.getByText("Question 2 of 2")).toBeTruthy();
    });

    it("ignores Enter on an unanswered scored question", async () => {
      await renderQuiz();
      expect(await key("Enter")).not.toHaveBeenCalled();
    });

    it.each([
      { label: "a modifier key", extra: { metaKey: true } },
      { label: "a handled event", extra: { defaultPrevented: true } },
      { label: "a typing target", extra: { target: new FakeElement("INPUT") } },
      { label: "a focused button", extra: { target: new FakeElement("BUTTON", true) } },
    ])("ignores Enter from $label", async ({ extra }) => {
      await renderQuiz({ questions: [reflection] });
      expect(await key("Enter", extra as Partial<KeyboardEvent>)).not.toHaveBeenCalled();
      expect(screen.queryByText("Intention noted")).toBeNull();
    });

    it("ignores keys once the results are showing", async () => {
      await renderQuiz({ questions: [buildQuestion()] });
      await key("1");
      await key("Enter");
      expect(screen.getByText("Quiz complete")).toBeTruthy();
      expect(await key("Enter")).not.toHaveBeenCalled();
    });

    it("removes the listener on unmount", async () => {
      await renderQuiz();
      expect(listeners).toHaveLength(1);
      await screen.unmount();
      expect(listeners).toHaveLength(0);
    });

    it("does not listen on TV", async () => {
      const restore = setPlatform({ isTV: true });
      try {
        await renderQuiz();
        expect(listeners).toHaveLength(0);
      } finally {
        restore();
      }
    });
  });
});
