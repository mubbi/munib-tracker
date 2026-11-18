import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { type LearnAsideTopic, LearnTopicAside } from "@/components/learn-guide/learn-topic-aside";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

const topics: LearnAsideTopic[] = [
  { id: "a", title: "First", href: "/learn/a" },
  { id: "b", title: "Second", href: "/learn/b" },
  { id: "c", title: "Third", href: "/learn/c" },
];

type Props = Parameters<typeof LearnTopicAside>[0];

async function renderAside(overrides: Partial<Props> = {}) {
  await renderWithTheme(
    <LearnTopicAside title="Learn the Qur'an" hubHref="/learn" topics={topics} {...overrides} />,
  );
}

describe("LearnTopicAside", () => {
  beforeEach(resetExpoRouterMock);

  it("links the heading back to the hub", async () => {
    await renderAside();
    await fireEvent.press(screen.getByLabelText("Learn the Qur'an"));
    expect(mockRouter.push).toHaveBeenCalledWith("/learn");
  });

  it("navigates to another topic but not the current one", async () => {
    await renderAside({ currentId: "b" });
    await fireEvent.press(screen.getByLabelText("Second"));
    expect(mockRouter.push).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByLabelText("Third"));
    expect(mockRouter.push).toHaveBeenCalledWith("/learn/c");
  });

  it.each([
    ["Previous", "/learn/a"],
    ["Next", "/learn/c"],
  ])("pages to the %s topic", async (label, href) => {
    await renderAside({ currentId: "b" });
    await fireEvent.press(screen.getByText(label));
    expect(mockRouter.push).toHaveBeenCalledWith(href);
  });

  it("disables previous on the first topic", async () => {
    await renderAside({ currentId: "a" });
    await fireEvent.press(screen.getByText("Previous"));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("disables next on the last topic", async () => {
    await renderAside({ currentId: "c" });
    await fireEvent.press(screen.getByText("Next"));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("hides the pager without a current topic", async () => {
    await renderAside();
    expect(screen.queryByText("Next")).toBeNull();
    expect(screen.getByText("1")).toBeTruthy();
  });

  it("shows progress for completed topics", async () => {
    await renderAside({ completedIds: ["a", "c"], currentId: "b", children: <Text>extra</Text> });
    expect(screen.getByText("2/3")).toBeTruthy();
    expect(screen.getByText("extra")).toBeTruthy();
    expect(screen.queryByText("1")).toBeNull();
  });

  it("handles an empty topic list with progress", async () => {
    await renderAside({ topics: [], completedIds: [] });
    expect(screen.getByText("0/0")).toBeTruthy();
  });
});
