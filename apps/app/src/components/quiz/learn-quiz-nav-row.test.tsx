import { fireEvent, screen } from "@testing-library/react-native";

import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
// Imported transitively (jannah primitives → audio provider); never played here.
jest.mock("expo-audio", () => ({ __esModule: true }));

// The first render warms the theme + i18n graph, which is slow on a busy machine.

async function renderNavRow(props: Partial<Parameters<typeof LearnQuizNavRow>[0]> = {}) {
  return await renderWithTheme(<LearnQuizNavRow quizPath="/salah-guide/quiz" {...props} />);
}

describe("LearnQuizNavRow", () => {
  beforeEach(resetExpoRouterMock);

  it.each([
    { props: {}, title: "Review quiz", subtitle: "Review what you learned" },
    {
      props: { titleKey: "common.quiz.complete", subtitleKey: "common.quiz.retry" },
      title: "Quiz complete",
      subtitle: "Try again",
    },
  ])("shows $title / $subtitle", async ({ props, title, subtitle }) => {
    await renderNavRow(props);
    expect(screen.getByRole("button", { name: `${title}. ${subtitle}` })).toBeTruthy();
  });

  it("navigates to the quiz route on press", async () => {
    await renderNavRow();
    await fireEvent.press(screen.getByRole("button", { name: /Review quiz/ }));
    expect(mockRouter.push).toHaveBeenCalledWith("/salah-guide/quiz");
  });
});
