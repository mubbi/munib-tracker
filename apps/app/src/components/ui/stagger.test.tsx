import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import * as Reanimated from "react-native-reanimated";

import { LearnContentGate } from "@/components/learn-content-loading";
import { Stagger } from "@/components/ui/stagger";
import { LEARN_SECTION_ROUTES } from "@/lib/library-menu";
import { completeAllStaggerEntrances } from "@/lib/stagger-entrances";
import { captureAppStateListener } from "@/test-support/app-state";
import { resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// jest.setup stubs Stagger globally; this suite exercises the real one.
jest.unmock("@/components/ui/stagger");
jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

type Props = Omit<Parameters<typeof Stagger>[0], "children">;

/** Every test needs its own key: completed entrances are remembered per session. */
let keyCounter = 0;
const uniqueKey = () => `stagger-test-${++keyCounter}`;

const stagger = (props: Props, labels = ["A", "B", "C"]) => (
  <Stagger {...props}>
    {labels.map((label) => (
      <Text key={label}>{label}</Text>
    ))}
  </Stagger>
);

const renderStagger = (props: Props = {}, labels?: string[]) => render(stagger(props, labels));

/** A revealed item renders its child directly in the full-width slot (no Animated wrapper). */
const isRevealed = (label: string) =>
  flattenStyle(parentOf(screen.getByText(label)).props.style).width === "100%";

const advance = (ms: number) => act(async () => jest.advanceTimersByTime(ms));

beforeEach(() => {
  jest.useFakeTimers();
  resetExpoRouterMock();
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("Stagger entrance", () => {
  it("starts children hidden for the cascade", async () => {
    await renderStagger({ entranceKey: uniqueKey() });

    expect(isRevealed("A")).toBe(false);
  });

  it("reveals every child once the capped cascade finishes", async () => {
    await renderStagger({ entranceKey: uniqueKey() });

    await advance(600);

    expect(["A", "B", "C"].every(isRevealed)).toBe(true);
  });

  it("reveals a stalled item through its own failsafe", async () => {
    await renderStagger({ entranceKey: uniqueKey(), delay: 0, step: 300 }, ["A", "B"]);

    await advance(500);

    expect(isRevealed("A")).toBe(true);
  });

  it("reveals an item when its timing animation finishes", async () => {
    jest.spyOn(Reanimated, "withTiming").mockImplementation((value, _config, callback) => {
      callback?.(true);
      return value;
    });
    await renderStagger({ entranceKey: uniqueKey() });

    expect(isRevealed("A")).toBe(true);
  });

  it("skips the fade-in when the same entrance remounts", async () => {
    const entranceKey = uniqueKey();
    const { unmount } = await renderStagger({ entranceKey });
    await advance(600);
    await unmount();

    await renderStagger({ entranceKey });

    expect(isRevealed("A")).toBe(true);
  });

  it("remembers an entrance interrupted by unmount", async () => {
    const entranceKey = uniqueKey();
    const { unmount } = await renderStagger({ entranceKey });
    await unmount();

    await renderStagger({ entranceKey });

    expect(isRevealed("B")).toBe(true);
  });

  it("keys the entrance by pathname by default", async () => {
    setMockPathname(`/${uniqueKey()}`);
    const { unmount } = await renderStagger();
    await advance(600);
    await unmount();

    await renderStagger();

    expect(isRevealed("C")).toBe(true);
  });
});

describe("Stagger skips the entrance", () => {
  it("when animate is false", async () => {
    await renderStagger({ animate: false, entranceKey: uniqueKey() });

    expect(isRevealed("A")).toBe(true);
  });

  it("with no children", async () => {
    await renderStagger({ entranceKey: uniqueKey() }, []);

    expect(screen.toJSON()).not.toBeNull();
  });

  it("on learn routes", async () => {
    setMockPathname(`${LEARN_SECTION_ROUTES[0]}/detail`);
    await renderStagger();

    expect(isRevealed("A")).toBe(true);
  });

  it("inside a ready learn content gate", async () => {
    await renderWithTheme(
      <LearnContentGate ready>{stagger({ entranceKey: uniqueKey() })}</LearnContentGate>,
    );

    expect(isRevealed("A")).toBe(true);
  });

  it("under reduced motion", async () => {
    jest.spyOn(Reanimated, "useReducedMotion").mockReturnValue(true);
    await renderStagger({ entranceKey: uniqueKey() });

    expect(isRevealed("A")).toBe(true);
  });
});

describe("Stagger finishes early", () => {
  it.each(["background", "inactive"])("when the app goes %s", async (state) => {
    const appState = captureAppStateListener();
    await renderStagger({ entranceKey: uniqueKey() });

    await act(async () => appState.emit(state));

    expect(isRevealed("A")).toBe(true);
  });

  it("but not when the app returns to active", async () => {
    const appState = captureAppStateListener();
    await renderStagger({ entranceKey: uniqueKey() });

    await act(async () => appState.emit("active"));

    expect(isRevealed("A")).toBe(false);
  });

  it("after a locale / layout change", async () => {
    await renderStagger({ entranceKey: uniqueKey() });

    await act(async () => completeAllStaggerEntrances());

    expect(isRevealed("A")).toBe(true);
  });

  it("when the child count changes after the first paint", async () => {
    const entranceKey = uniqueKey();
    const { rerender } = await renderStagger({ entranceKey });

    await rerender(stagger({ entranceKey }, ["A", "B", "C", "D"]));

    expect(isRevealed("D")).toBe(true);
  });
});
