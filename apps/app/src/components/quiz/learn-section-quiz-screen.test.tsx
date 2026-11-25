import { act, fireEvent, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { LearnSectionQuizScreen } from "@/components/quiz/learn-section-quiz-screen";
import type { QuizPlayerQuestion } from "@/components/quiz/quiz-player";
import i18n from "@/i18n";
import {
  ensureSectionQuizContent,
  getLearnSectionDef,
  getQuestionsForSection,
  type LearnQuizSectionId,
  toQuizPlayerQuestions,
} from "@/lib/flash-cards";
import { goBackOrReplace } from "@/lib/navigation";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
// Imported transitively (jannah primitives → audio provider); never played here.
jest.mock("@/lib/navigation", () => ({ goBackOrReplace: jest.fn() }));

/** Header chrome reduced to labelled text + a back button. */
jest.mock("@/components/screen-layout", () => {
  const { Pressable, Text, View } = require("react-native");
  return {
    ScreenLayout: (props: {
      eyebrow: string;
      title: string;
      subtitle: string;
      onBack: () => void;
      children: ReactNode;
    }) => (
      <View>
        <Text>{`eyebrow:${props.eyebrow}`}</Text>
        <Text>{`title:${props.title}`}</Text>
        <Text>{`subtitle:${props.subtitle}`}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="back" onPress={props.onBack} />
        {props.children}
      </View>
    ),
  };
});

jest.mock("@/components/learn-content-loading", () => {
  const { Pressable, Text } = require("react-native");
  return {
    LearnContentGate: ({
      ready,
      error,
      onRetry,
      children,
    }: {
      ready: boolean;
      error?: unknown;
      onRetry?: () => void;
      children: ReactNode;
    }) =>
      ready ? (
        children
      ) : error ? (
        <Pressable accessibilityRole="button" accessibilityLabel="retry" onPress={onRetry} />
      ) : (
        <Text>loading</Text>
      ),
  };
});

jest.mock("@/lib/flash-cards", () => ({
  ensureSectionQuizContent: jest.fn(),
  getLearnSectionDef: jest.fn(),
  getQuestionsForSection: jest.fn(),
  toQuizPlayerQuestions: jest.fn(),
}));

// The first render warms the theme + i18n graph, which is slow on a busy machine.

const ensureMock = jest.mocked(ensureSectionQuizContent);
const defMock = jest.mocked(getLearnSectionDef);
const questionsMock = jest.mocked(getQuestionsForSection);
const toPlayerMock = jest.mocked(toQuizPlayerQuestions);

type SectionDef = NonNullable<ReturnType<typeof getLearnSectionDef>>;

const sectionId = "salahGuide" as LearnQuizSectionId;

function buildDef(overrides: Partial<SectionDef> = {}): SectionDef {
  return {
    id: sectionId,
    route: "/salah-guide",
    quizPath: "/salah-guide/quiz",
    i18nNamespace: "testQuizNs",
    ensure: jest.fn(),
    isReady: () => true,
    collect: () => [],
    ...overrides,
  } as SectionDef;
}

function buildQuestion(overrides: Partial<QuizPlayerQuestion> = {}): QuizPlayerQuestion {
  const id = overrides.id ?? "q1";
  return {
    id,
    prompt: `Prompt ${id}`,
    options: [`${id} A`, `${id} B`],
    correctIndex: 0,
    explanation: `Because ${id}`,
    type: "mcq",
    ...overrides,
  };
}

/** `def: null` simulates an unknown section id. */
async function renderScreen({
  def = buildDef(),
  questions = [],
}: {
  def?: SectionDef | null;
  questions?: QuizPlayerQuestion[];
} = {}) {
  defMock.mockReturnValue(def ?? undefined);
  toPlayerMock.mockReturnValue(questions);
  return await renderWithTheme(<LearnSectionQuizScreen sectionId={sectionId} />);
}

describe("LearnSectionQuizScreen", () => {
  beforeAll(() => {
    i18n.addResourceBundle(
      "en",
      "translation",
      {
        testQuizNsFull: {
          quizTitle: "NS quiz title",
          quizSubtitle: "NS subtitle",
          eyebrow: "NS eyebrow",
          quizIntro: "NS intro",
          disclaimer: "NS disclaimer",
        },
        testQuizCategory: { known: "Known category" },
      },
      true,
      true,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    resetExpoRouterMock();
    ensureMock.mockResolvedValue(undefined);
    questionsMock.mockReturnValue([]);
  });

  it("keeps the chrome and offers a way back for an unknown section", async () => {
    await renderScreen({ def: null });
    expect(screen.getByText("title:Review quiz")).toBeTruthy();
    expect(screen.getByText(i18n.t("learnKit.quizEmptyTitle"))).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: i18n.t("learnKit.backToGuide") }));
    expect(goBackOrReplace).toHaveBeenCalledWith(mockRouter, "/library");
  });

  it("loads the section's quiz content on mount", async () => {
    await renderScreen();
    expect(ensureMock).toHaveBeenCalledWith(sectionId);
    // (t, schoolFor): school-dependent questions follow "My madhhab" (NF-3.0a).
    expect(questionsMock).toHaveBeenCalledWith(
      sectionId,
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("falls back to the common quiz copy when the namespace has none", async () => {
    await renderScreen();
    expect(screen.getByText("title:Review quiz")).toBeTruthy();
    expect(
      screen.getByText("subtitle:Test your understanding — not your standing with Allah"),
    ).toBeTruthy();
    expect(screen.getByText("eyebrow:Learn")).toBeTruthy();
  });

  it("uses the namespace's own copy, intro and disclaimer", async () => {
    await renderScreen({
      def: buildDef({ i18nNamespace: "testQuizNsFull" }),
      questions: [buildQuestion()],
    });
    expect(screen.getByText("title:NS quiz title")).toBeTruthy();
    expect(screen.getByText("subtitle:NS subtitle")).toBeTruthy();
    expect(screen.getByText("eyebrow:NS eyebrow")).toBeTruthy();
    expect(screen.getByText("NS intro")).toBeTruthy();
    expect(screen.getByText("NS disclaimer")).toBeTruthy();
  });

  it("says plainly there is no quiz yet and links back to the guide", async () => {
    await renderScreen();
    expect(screen.queryByText(/still loading/)).toBeNull();
    expect(screen.getByText(i18n.t("learnKit.quizEmptyTitle"))).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: i18n.t("learnKit.backToGuide") }));
    expect(goBackOrReplace).toHaveBeenCalledWith(mockRouter, "/salah-guide");
  });

  it("goes back to the section route", async () => {
    await renderScreen();
    await fireEvent.press(screen.getByRole("button", { name: "back" }));
    expect(goBackOrReplace).toHaveBeenCalledWith(mockRouter, "/salah-guide");
  });

  it("shows the loading gate until content is ready, then the quiz", async () => {
    let resolveEnsure: () => void = () => {};
    ensureMock.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveEnsure = resolve;
      }),
    );
    await renderScreen({ def: buildDef({ isReady: () => false }) });
    expect(screen.getByText("loading")).toBeTruthy();

    toPlayerMock.mockReturnValue([buildQuestion({ prompt: "Late question" })]);
    await act(async () => resolveEnsure());
    expect(screen.getByText("Late question")).toBeTruthy();
  });

  it("offers Try again when the quiz content fails to load, and re-runs the load", async () => {
    ensureMock.mockRejectedValueOnce(new Error("chunk failed"));
    await renderScreen({ def: buildDef({ isReady: () => false }) });
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByText("loading")).toBeNull();
    ensureMock.mockResolvedValueOnce(undefined);
    toPlayerMock.mockReturnValue([buildQuestion({ prompt: "After retry" })]);
    await fireEvent.press(screen.getByRole("button", { name: "retry" }));
    expect(ensureMock).toHaveBeenCalledTimes(2);
    expect(screen.getByText("After retry")).toBeTruthy();
  });

  it.each([
    { category: "testQuizCategory.known", chip: "Known category" },
    { category: "testQuizCategory.missing", chip: null },
    { category: undefined, chip: null },
  ])("labels category $category as $chip", async ({ category, chip }) => {
    await renderScreen({ questions: [buildQuestion({ category })] });
    if (chip) expect(screen.getByText(chip)).toBeTruthy();
    else expect(screen.queryByText(/testQuizCategory|Known category/)).toBeNull();
  });

  it("translates question text with the active locale", async () => {
    await renderScreen();
    const translate = questionsMock.mock.calls[0]?.[1] as (key: string) => string;
    expect(translate("common.next")).toBe("Next");
  });
});
