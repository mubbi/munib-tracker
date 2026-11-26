import type { TasbeehAppearance } from "@munib-tracker/shared/types";
import { act, fireEvent, screen } from "@testing-library/react-native";
import { AccessibilityInfo, I18nManager } from "react-native";
import * as reanimated from "react-native-reanimated";

import { ScreenLayout } from "@/components/screen-layout";
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
import { flattenStyle } from "@/test-support/style";

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

const stage = () => screen.getAllByRole("button", { name: "Tasbeeh counter" })[0];
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
      expect(stage().props.accessibilityValue).toEqual({
        now: 5,
        min: 0,
        max: 33,
        text: "5 of 33",
      });
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

    it("undoes one bead when dragged back past the detent (light haptic, one undo per gesture)", async () => {
      const { props } = await renderCounter("misbaha", { count: 3 });
      await act(async () => {
        pan().onActivate?.();
        pan().onUpdate?.({ translationX: 0, translationY: -6 });
        pan().onUpdate?.({ translationX: 0, translationY: -60 });
        pan().onUpdate?.({ translationX: 0, translationY: -400 });
        (pan().onFinalize as () => void)();
      });
      expect(props.onDecrement).toHaveBeenCalledTimes(1);
      expect(props.onIncrement).not.toHaveBeenCalled();
      expect(triggerHaptic).toHaveBeenCalledWith("light");
      // The click the drag may also produce (web) does not count.
      await fireEvent.press(stage());
      expect(props.onIncrement).not.toHaveBeenCalled();
    });

    it("never undoes below zero", async () => {
      const { props } = await renderCounter("misbaha", { count: 0 });
      await act(async () => {
        pan().onActivate?.();
        pan().onUpdate?.({ translationX: 0, translationY: -400 });
        (pan().onFinalize as () => void)();
      });
      expect(props.onDecrement).not.toHaveBeenCalled();
    });

    it("can still take the last bead back at the target", async () => {
      const { props } = await renderCounter("misbaha", { count: 33 });
      await act(async () => {
        pan().onActivate?.();
        pan().onUpdate?.({ translationX: 0, translationY: -400 });
        (pan().onFinalize as () => void)();
      });
      expect(props.onDecrement).toHaveBeenCalledTimes(1);
    });

    it("hangs the imam tassel outward from the strand end, beneath the bead", async () => {
      await renderCounter("misbaha", { count: 33, target: 33 });
      const tassel = screen.getByTestId("misbaha-tassel");
      // Hung from the bead's centre (the outward quarter turn is the animated style;
      // the side itself is covered by `outwardSide` in bead-layout.test.ts).
      const flat = flattenStyle(tassel.props.style) as { top?: number };
      expect(flat.top).toBeGreaterThan(0);
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

  describe("pebbles swipe", () => {
    it("counts a forward swipe towards the counted dish and undoes a backward one", async () => {
      const { props } = await renderCounter("pebbles", { count: 3 });
      await act(async () => {
        pan().onActivate?.();
        pan().onUpdate?.({ translationX: 12, translationY: 0 });
        pan().onUpdate?.({ translationX: 300, translationY: 0 });
        (pan().onFinalize as () => void)();
      });
      expect(props.onIncrement).toHaveBeenCalledTimes(1);
      await act(async () => {
        pan().onActivate?.();
        pan().onUpdate?.({ translationX: -300, translationY: 0 });
        (pan().onFinalize as () => void)();
      });
      expect(props.onDecrement).toHaveBeenCalledTimes(1);
      // The tap a swipe may also produce is ignored.
      await fireEvent.press(stage());
      expect(props.onIncrement).toHaveBeenCalledTimes(1);
    });

    it("keeps the pan horizontal so the page still scrolls", async () => {
      await renderCounter("pebbles", { count: 3 });
      expect(pan()).toMatchObject({ activeOffsetX: [-10, 10], failOffsetY: [-14, 14] });
    });

    it("counts towards the reading end in RTL (leftwards)", async () => {
      jest.replaceProperty(I18nManager, "isRTL", true);
      const { props } = await renderCounter("pebbles", { count: 3 });
      await act(async () => {
        pan().onActivate?.();
        pan().onUpdate?.({ translationX: -300, translationY: 0 });
        (pan().onFinalize as () => void)();
      });
      expect(props.onIncrement).toHaveBeenCalledTimes(1);
      expect(props.onDecrement).not.toHaveBeenCalled();
    });
  });

  describe("clicker", () => {
    it("shows the LCD and target", async () => {
      await renderCounter("clicker", { count: 12, target: 99 });
      expect(screen.getByText("of 99")).toBeTruthy();
    });
  });

  describe("focus / night full-screen surface", () => {
    it("takes the whole screen, and the whole surface counts", async () => {
      const { props } = await renderCounter("minimal", { count: 4 });
      expect(screen.getByTestId("tasbeeh-night-surface")).toBeTruthy();
      expect(stage().props.accessibilityValue).toEqual({
        now: 4,
        min: 0,
        max: 33,
        text: "4 of 33",
      });
      await fireEvent.press(stage());
      expect(props.onIncrement).toHaveBeenCalledTimes(1);
      // The dim control strip keeps undo / style / reset.
      expect(screen.getByRole("button", { name: "Style" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Reset" })).toBeTruthy();
    });

    it("uses the screen's own back action", async () => {
      await seed(appearance({ design: "minimal" }));
      const onBack = jest.fn();
      await renderWithTheme(
        <ScreenLayout title="Tasbeeh" onBack={onBack}>
          <TasbeehCounter
            count={1}
            target={33}
            onIncrement={jest.fn()}
            onDecrement={jest.fn()}
            onReset={jest.fn()}
          />
        </ScreenLayout>,
      );
      await act(async () => {});
      // The night surface is a fullscreen Sheet: its close control goes back.
      await fireEvent.press(screen.getByTestId("sheet-close"));
      expect(onBack).toHaveBeenCalledTimes(1);
    }, 60_000);

    it("falls back to the router outside a ScreenLayout", async () => {
      await renderCounter("minimal", { count: 1 });
      await fireEvent.press(screen.getByTestId("sheet-close"));
      expect(mockRouter.replace).toHaveBeenCalledWith("/");
    });

    it("hides the target picker on the night surface", async () => {
      await renderCounter("minimal", { count: 1, onSelectMode: jest.fn() });
      expect(screen.queryByRole("tab", { name: /^99/ })).toBeNull();
    });

    it("steps aside while the screen is not focused", async () => {
      const router = jest.requireMock("expo-router") as { useIsFocused: () => boolean };
      const original = router.useIsFocused;
      router.useIsFocused = () => false;
      try {
        await renderCounter("minimal", { count: 1 });
        expect(screen.queryByTestId("tasbeeh-night-surface")).toBeNull();
      } finally {
        router.useIsFocused = original;
      }
    });

    describe("on TV", () => {
      usePlatform({ isTV: true });

      it("keeps Focus / Night inside the landscape card", async () => {
        await renderCounter("minimal", { count: 1 });
        expect(screen.queryByTestId("tasbeeh-night-surface")).toBeNull();
        expect(screen.getByText("1")).toBeTruthy();
      });
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

  it("gives the count that reaches the target the completion cue alone", async () => {
    jest.useFakeTimers();
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    try {
      // Focus / Night at 33 of 33: a milestone *and* the target — only the target cue plays.
      const { props, view } = await renderCounter("minimal", { count: 32, target: 33 });
      announce.mockClear();
      await fireEvent.press(stage());
      expect(props.onIncrement).toHaveBeenCalledTimes(1);
      await act(async () => jest.runOnlyPendingTimers());
      expect(triggerHaptic).not.toHaveBeenCalled();
      expect(announce).not.toHaveBeenCalledWith("33 counted");
      await view.rerender(<TasbeehCounter {...props} count={33} />);
      expect(jest.mocked(triggerHaptic).mock.calls).toEqual([["success"]]);
      expect(announce).toHaveBeenCalledWith("MashaAllah — target reached");
    } finally {
      jest.useRealTimers();
    }
  });

  describe("Counter style sheet", () => {
    async function openStyleSheet(design: TasbeehAppearance["design"] = "misbaha") {
      await renderCounter(design, { count: 1 });
      await fireEvent.press(screen.getByRole("button", { name: "Style" }));
      await act(async () => {});
    }

    it("shows misbaha presets first and the fine-tuning behind Customize beads", async () => {
      await openStyleSheet("misbaha");
      expect(screen.getByRole("radio", { name: "Onyx night" })).toBeTruthy();
      expect(screen.queryByRole("radio", { name: "Faceted" })).toBeNull();

      await fireEvent.press(screen.getByRole("button", { name: "Customize beads" }));
      await fireEvent.press(screen.getByRole("radio", { name: "Faceted" }));
      await act(async () => {});
      expect(preferencesStore.getState().prefs.tasbeehAppearance?.misbaha?.shape).toBe("faceted");
      // A silk tassel offers its colours; a metal chain does not.
      expect(screen.getByText("Tassel color")).toBeTruthy();
      await fireEvent.press(screen.getByRole("radio", { name: "Metal chain" }));
      await act(async () => {});
      expect(screen.queryByText("Tassel color")).toBeNull();
    }, 60_000);

    it("applies a preset over the strand size, which it keeps", async () => {
      await openStyleSheet("misbaha");
      await fireEvent.press(screen.getByRole("button", { name: "Customize beads" }));
      await fireEvent.press(screen.getByRole("radio", { name: "Always 99" }));
      await act(async () => {});
      await fireEvent.press(screen.getByRole("radio", { name: "Onyx night" }));
      await act(async () => {});
      expect(preferencesStore.getState().prefs.tasbeehAppearance?.misbaha).toMatchObject({
        preset: "onyxNight",
        material: "onyx",
        strand: 99,
      });
    }, 60_000);

    it("lets the demo stage be felt at the chosen haptic level", async () => {
      await openStyleSheet("ring");
      jest.mocked(triggerHaptic).mockClear();
      await fireEvent.press(screen.getByRole("button", { name: "Tap the preview to try it" }));
      expect(triggerHaptic).toHaveBeenCalledWith("light");
      // Haptic levels are a SegmentedControl, which exposes options as radios.
      await fireEvent.press(screen.getByRole("radio", { name: "Rich" }));
      await act(async () => {});
      jest.mocked(triggerHaptic).mockClear();
      await fireEvent.press(screen.getByRole("button", { name: "Tap the preview to try it" }));
      expect(triggerHaptic).toHaveBeenCalledWith("tick");
    }, 60_000);

    it("reveals the sound pack and volume only once click sound is on", async () => {
      await openStyleSheet("ring");
      expect(screen.queryByText("Sound pack")).toBeNull();
      await fireEvent(screen.getByRole("switch", { name: "Click sound" }), "valueChange", true);
      await act(async () => {});
      expect(preferencesStore.getState().prefs.tasbeehAppearance?.sound.enabled).toBe(true);
      expect(screen.getByText("Sound pack")).toBeTruthy();
      expect(screen.getByText("60%")).toBeTruthy();
    }, 60_000);
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
