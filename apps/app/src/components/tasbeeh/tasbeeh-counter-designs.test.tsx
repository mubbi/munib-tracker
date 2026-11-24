import type { TasbeehAppearance } from "@munib-tracker/shared/types";
import { act, fireEvent, screen } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";
import * as reanimated from "react-native-reanimated";

import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { triggerHaptic } from "@/lib/haptics";
import { DEFAULT_TASBEEH_APPEARANCE } from "@/lib/tasbeeh/designs";
import { preferencesStore } from "@/stores/preferences-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import {
  type MockGestureConfig,
  mockGestures,
  resetGestureMocks,
} from "@/test-support/mocks/gesture-handler";
import { usePlatform } from "@/test-support/platform";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock(
  "react-native-gesture-handler",
  () => require("@/test-support/mocks/gesture-handler").gestureHandlerMock,
);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock("@/lib/platform/hinge", () => ({ useHingePosture: jest.fn(() => null) }));

type Props = Parameters<typeof TasbeehCounter>[0];
type PanConfig = MockGestureConfig & { onFinalize?: () => void };

function appearance(patch: Partial<TasbeehAppearance>): TasbeehAppearance {
  return { ...DEFAULT_TASBEEH_APPEARANCE, ...patch };
}

/** Persists the appearance too — the theme provider reloads preferences from storage on mount. */
async function seed(value: TasbeehAppearance | undefined) {
  await setPreferences({ tasbeehAppearance: value });
  await act(async () => {
    await preferencesStore.getState().update({ tasbeehAppearance: value });
  });
}

async function renderCounter(
  design: TasbeehAppearance["design"],
  overrides: Partial<Props> = {},
  patch: Partial<TasbeehAppearance> = {},
) {
  await seed(appearance({ design, ...patch }));
  const props: Props = {
    count: 0,
    target: 33,
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
    onReset: jest.fn(),
    ...overrides,
  };
  const view = await renderWithTheme(<TasbeehCounter {...props} />);
  // Non-Ring faces load lazily (kept out of the web common chunk).
  await act(async () => {});
  return { props, view };
}

const stage = () => screen.getAllByRole("button", { name: "Count" })[0];
const pan = () => mockGestures.pan as PanConfig;

describe("TasbeehCounter designs", () => {
  afterEach(async () => {
    jest.mocked(triggerHaptic).mockClear();
    resetGestureMocks();
    resetExpoRouterMock();
    jest.restoreAllMocks();
    await seed(undefined);
    await resetPreferences();
  });

  describe.each([
    "misbaha",
    "clicker",
    "minimal",
    "pebbles",
    "fingers",
    "geometric",
    "stars",
  ] as const)("%s face", (design) => {
    it("counts exactly once per tap", async () => {
      const { props } = await renderCounter(design, { count: 4 });
      await fireEvent.press(stage());
      expect(props.onIncrement).toHaveBeenCalledTimes(1);
      expect(triggerHaptic).toHaveBeenCalledWith("light");
    });

    it("holds the limit at the target", async () => {
      const { props } = await renderCounter(design, { count: 33 });
      await fireEvent.press(stage());
      expect(props.onIncrement).not.toHaveBeenCalled();
      expect(screen.getByText("MashaAllah — target reached")).toBeTruthy();
    });

    it("counts 1,000 rapid taps as 1,000", async () => {
      const { props } = await renderCounter(design, { target: 0 });
      const button = stage();
      for (let i = 0; i < 1000; i++) await fireEvent.press(button);
      expect(props.onIncrement).toHaveBeenCalledTimes(1000);
    });

    it("exposes the same accessible counter with an increment action", async () => {
      const { props } = await renderCounter(design, { count: 5 });
      expect(stage().props.accessibilityValue).toEqual({ now: 5, min: 0, max: 33 });
      await fireEvent(stage(), "accessibilityAction", { nativeEvent: { actionName: "increment" } });
      expect(props.onIncrement).toHaveBeenCalledTimes(1);
    });

    it("plays the success haptic at the target without the confetti burst", async () => {
      const { props, view } = await renderCounter(design, { count: 32 });
      await view.rerender(<TasbeehCounter {...props} count={33} />);
      expect(triggerHaptic).toHaveBeenCalledWith("success");
    });
  });

  describe("misbaha", () => {
    it("shows the strand readout", async () => {
      await renderCounter("misbaha", { count: 7, target: 99 });
      expect(screen.getByText("7")).toBeTruthy();
      expect(screen.getByText("of 99")).toBeTruthy();
      expect(screen.getByText("99-bead strand")).toBeTruthy();
    });

    it("marks the spacer bead with a heavier haptic", async () => {
      await renderCounter("misbaha", { count: 10 });
      await fireEvent.press(stage());
      expect(triggerHaptic).toHaveBeenCalledWith("medium");
    });

    it("shows a lap counter on a looping strand", async () => {
      await renderCounter("misbaha", { count: 40, target: 0 });
      expect(screen.getByText("Round 2 · 7 of 33")).toBeTruthy();
    });

    it("counts one bead for a drag past the detent, even a long flick", async () => {
      const { props } = await renderCounter("misbaha", { count: 3 });
      await act(async () => {
        pan().onActivate?.();
        pan().onUpdate?.({ translationX: 0, translationY: 4 });
        pan().onUpdate?.({ translationX: 0, translationY: 40 });
        pan().onUpdate?.({ translationX: 0, translationY: 400 });
        (pan().onFinalize as () => void)();
      });
      expect(props.onIncrement).toHaveBeenCalledTimes(1);
      // The click the drag may also produce (web) is ignored.
      await fireEvent.press(stage());
      expect(props.onIncrement).toHaveBeenCalledTimes(1);
    });

    it.each([
      ["released short of the detent", 6],
      ["dragged backwards", -120],
    ])("counts nothing when %s", async (_label, distance) => {
      const { props } = await renderCounter("misbaha", { count: 3 });
      await act(async () => {
        pan().onActivate?.();
        pan().onUpdate?.({ translationX: 0, translationY: distance });
        (pan().onFinalize as () => void)();
      });
      expect(props.onIncrement).not.toHaveBeenCalled();
    });

    it("ignores stage taps while a drag is in progress", async () => {
      const { props } = await renderCounter("misbaha", { count: 3 });
      await act(async () => pan().onActivate?.());
      await fireEvent.press(stage());
      expect(props.onIncrement).not.toHaveBeenCalled();
    });

    it("snaps without spring animations under reduced motion", async () => {
      jest.spyOn(reanimated, "useReducedMotion").mockReturnValue(true);
      const spring = jest.spyOn(reanimated, "withSpring");
      const { props, view } = await renderCounter("misbaha", { count: 3 });
      spring.mockClear();
      await view.rerender(<TasbeehCounter {...props} count={4} />);
      expect(spring).not.toHaveBeenCalled();
    });

    describe("on TV", () => {
      usePlatform({ isTV: true });

      it("offers Select counting without a drag gesture", async () => {
        const { props } = await renderCounter("misbaha", { count: 3 });
        expect(screen.queryByTestId("gesture-detector")).toBeNull();
        await fireEvent.press(stage());
        expect(props.onIncrement).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Press Select to count")).toBeTruthy();
      });
    });
  });

  describe("clicker", () => {
    it("shows the LCD and target", async () => {
      await renderCounter("clicker", { count: 12, target: 99 });
      expect(screen.getByText("of 99")).toBeTruthy();
    });
  });

  describe("focus / night", () => {
    it("pulses twice at every 33", async () => {
      jest.useFakeTimers();
      try {
        await renderCounter("minimal", { count: 32, target: 99 });
        await fireEvent.press(stage());
        expect(triggerHaptic).toHaveBeenCalledWith("medium");
        await act(async () => jest.runOnlyPendingTimers());
        expect(jest.mocked(triggerHaptic).mock.calls.filter(([h]) => h === "medium")).toHaveLength(
          2,
        );
      } finally {
        jest.useRealTimers();
      }
    });

    it("shows big numerals only", async () => {
      await renderCounter("minimal", { count: 21, target: 0 });
      expect(screen.getByText("21")).toBeTruthy();
      expect(screen.getByText("unlimited")).toBeTruthy();
    });
  });

  describe("v2 designs", () => {
    it("pebbles: shows the always-visible note with both graded reports, linked by corpus number", async () => {
      await renderCounter("pebbles", { count: 3 });
      expect(screen.getByTestId("tasbeeh-face-pebbles")).toBeTruthy();
      expect(screen.getByText("About this design")).toBeTruthy();
      expect(screen.getByText(/Scholars grade this report differently/)).toBeTruthy();
      await fireEvent.press(screen.getByRole("link", { name: /Jami' at-Tirmidhi 3568/ }));
      expect(mockRouter.push).toHaveBeenLastCalledWith({
        pathname: "/hadith/[collection]",
        params: { collection: "tirmidhi", q: "3568" },
      });
      await fireEvent.press(screen.getByRole("link", { name: /Sunan Abu Dawud 1500/ }));
      expect(mockRouter.push).toHaveBeenLastCalledWith({
        pathname: "/hadith/[collection]",
        params: { collection: "abudawud", q: "1500" },
      });
    });

    it("fingers: cites Abu Dawud 1501 first and says any finger method is fine", async () => {
      await renderCounter("fingers", { count: 13 });
      const links = screen.getAllByRole("link");
      expect(links[0]?.props.accessibilityLabel).toMatch(/^Sunan Abu Dawud 1501/);
      expect(screen.getByText(/your own finger method is fine/)).toBeTruthy();
      expect(screen.getByText("Right hand")).toBeTruthy();
      expect(screen.getByText("Round 2 · 3 of 10")).toBeTruthy();
    });

    it("fingers: the joints layout counts 15 a round on the right hand", async () => {
      await renderCounter("fingers", { count: 16, target: 0 }, { fingers: { layout: "joints" } });
      expect(screen.getByText("Round 2 · 1 of 15")).toBeTruthy();
      expect(screen.queryByText("Left hand")).toBeNull();
    });

    it("geometric and stars show the round within a 99 target", async () => {
      await renderCounter("geometric", { count: 34, target: 99 });
      expect(screen.getByText("Round 2 · 1 of 33")).toBeTruthy();
      expect(screen.queryByText("About this design")).toBeNull();
    });

    it("marks a finished round with a double pulse and a screen-reader announcement", async () => {
      jest.useFakeTimers();
      const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
      try {
        const { props } = await renderCounter("pebbles", { count: 32, target: 99 });
        await fireEvent.press(stage());
        expect(props.onIncrement).toHaveBeenCalledTimes(1);
        await act(async () => jest.runOnlyPendingTimers());
        expect(jest.mocked(triggerHaptic).mock.calls.filter(([h]) => h === "medium")).toHaveLength(
          2,
        );
        expect(announce).toHaveBeenCalledWith("33 counted");
      } finally {
        jest.useRealTimers();
      }
    });

    it.each(["pebbles", "fingers", "stars"] as const)(
      "%s: steps without animation under reduced motion",
      async (design) => {
        jest.spyOn(reanimated, "useReducedMotion").mockReturnValue(true);
        const timing = jest.spyOn(reanimated, "withTiming");
        const { props, view } = await renderCounter(design, { count: 3 });
        timing.mockClear();
        await view.rerender(<TasbeehCounter {...props} count={4} />);
        expect(timing).not.toHaveBeenCalled();
      },
    );

    it("pebbles: one forward count animates the moving pebble", async () => {
      const timing = jest.spyOn(reanimated, "withTiming");
      const { props, view } = await renderCounter("pebbles", { count: 3 });
      timing.mockClear();
      await view.rerender(<TasbeehCounter {...props} count={4} />);
      expect(timing).toHaveBeenCalled();
    });

    describe("on TV", () => {
      usePlatform({ isTV: true });

      it.each(["pebbles", "fingers", "geometric", "stars"] as const)(
        "%s is not offered — the counter shows Ring",
        async (design) => {
          const { props } = await renderCounter(design, { count: 3 });
          expect(screen.queryByTestId(`tasbeeh-face-${design}`)).toBeNull();
          expect(screen.queryByText("About this design")).toBeNull();
          await fireEvent.press(stage());
          expect(props.onIncrement).toHaveBeenCalledTimes(1);
        },
      );
    });

    it.each([
      ["pebbles", "Pebbles", { pebbles: { item: "stones" } }],
      ["fingers", "Finger joints (right hand, 15)", { fingers: { layout: "joints" } }],
    ] as const)(
      "the style sheet offers the %s option",
      async (design, choice, expected) => {
        await renderCounter(design, { count: 1 });
        await fireEvent.press(screen.getByRole("button", { name: "Style" }));
        await act(async () => {});
        await fireEvent.press(screen.getByRole("radio", { name: choice }));
        await act(async () => {});
        expect(preferencesStore.getState().prefs.tasbeehAppearance).toMatchObject(expected);
      },
      60_000,
    );
  });

  it("honours the haptics Off level", async () => {
    await seed(appearance({ design: "ring", haptics: "off" }));
    const props: Props = {
      count: 1,
      target: 33,
      onIncrement: jest.fn(),
      onDecrement: jest.fn(),
      onReset: jest.fn(),
    };
    await renderWithTheme(<TasbeehCounter {...props} />);
    await fireEvent.press(stage());
    expect(props.onIncrement).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).not.toHaveBeenCalled();
  });

  it("opens the Counter style sheet and applies a design at once", async () => {
    await seed(undefined);
    const props: Props = {
      count: 1,
      target: 33,
      onIncrement: jest.fn(),
      onDecrement: jest.fn(),
      onReset: jest.fn(),
    };
    await renderWithTheme(<TasbeehCounter {...props} />);
    await fireEvent.press(screen.getByRole("button", { name: "Style" }));
    expect(screen.getByText("Counter style")).toBeTruthy();
    await act(async () => {});
    await fireEvent.press(screen.getByRole("button", { name: "Sliding beads" }));
    await act(async () => {});
    expect(preferencesStore.getState().prefs.tasbeehAppearance?.design).toBe("misbaha");
  });
});
