import { fireEvent, screen } from "@testing-library/react-native";

import { KnowledgeFlashCard } from "@/components/knowledge-flash-card";
import { useKnowledgeCard } from "@/hooks/use-knowledge-card";
import type { ResolvedKnowledgeCard } from "@/lib/knowledge-card";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/hooks/use-knowledge-card", () => ({ useKnowledgeCard: jest.fn() }));

const refresh = jest.fn();
const showCard = (overrides: Partial<ResolvedKnowledgeCard> = {}) =>
  jest.mocked(useKnowledgeCard).mockReturnValue({
    refresh,
    card: {
      key: "hadith-1",
      kind: "hadith",
      titleKey: "home.knowledgeKind.hadith",
      body: "Actions are by intentions.",
      icon: { ios: "book", android: "book", web: "book" },
      palette: "accent",
      ...overrides,
    } as ResolvedKnowledgeCard,
  });

const renderCard = (overrides: Partial<ResolvedKnowledgeCard> = {}) => {
  showCard(overrides);
  return renderWithTheme(<KnowledgeFlashCard />);
};

beforeEach(() => {
  resetExpoRouterMock();
  refresh.mockClear();
});

describe("KnowledgeFlashCard", () => {
  it("shows a plain card without a destination", async () => {
    await renderCard();

    expect(screen.getByText("Hadith")).toBeTruthy();
    expect(screen.getByText("Actions are by intentions.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Actions are/ })).toBeNull();
  });

  it("shows Arabic, reference and opens the source", async () => {
    await renderCard({
      palette: "info",
      arabic: "إِنَّمَا الأَعْمَالُ",
      reference: "Bukhari 1",
      href: "/hadith/bukhari",
      actionKey: "home.knowledgeAction.hadith",
    });

    await fireEvent.press(screen.getByRole("button", { name: /Bukhari 1/ }));

    expect(screen.getByText("Bukhari 1")).toBeTruthy();
    expect(mockRouter.push).toHaveBeenCalledWith("/hadith/bukhari");
  });

  it("shuffles to another card", async () => {
    await renderCard();

    await fireEvent.press(screen.getByLabelText("Show another card"));

    expect(refresh).toHaveBeenCalled();
  });
});
