import { fireEvent, screen } from "@testing-library/react-native";
import * as Reanimated from "react-native-reanimated";

import { PracticeDock } from "@/components/quran/practice-dock";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { captureAnimatedStyles } from "@/test-support/reanimated";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

type DockProps = Parameters<typeof PracticeDock>[0];

async function renderDock(props: Partial<DockProps> = {}) {
  const handlers = {
    onHear: jest.fn(),
    onMic: jest.fn(),
    onReveal: jest.fn(),
    onRevealAll: jest.fn(),
    onEnd: jest.fn(),
  };
  await renderWithTheme(
    <PracticeDock
      showMic
      mic="idle"
      isHearing={false}
      showReveal={false}
      compact={false}
      {...handlers}
      {...props}
    />,
  );
  return handlers;
}

/**
 * The dock's pulse-ring worklet is the first `useAnimatedStyle` it registers;
 * stable shared values (from `captureAnimatedStyles`) let it see later effects.
 */
function captureRingStyle() {
  captureAnimatedStyles();
  const ring: { worklet?: () => Record<string, unknown> } = {};
  jest.spyOn(Reanimated, "useAnimatedStyle").mockImplementation((worklet) => {
    ring.worklet ??= worklet as () => Record<string, unknown>;
    return {};
  });
  return () => ring.worklet?.() ?? {};
}

describe("PracticeDock", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    resetMockWindowSize();
  });

  describe("with the listener", () => {
    it("starts listening from the mic", async () => {
      const { onMic } = await renderDock();
      const mic = screen.getByHintText("Starts listening to your recitation of this ayah");
      expect(mic).toBe(screen.getByLabelText("Start"));
      await fireEvent.press(mic);
      expect(onMic).toHaveBeenCalled();
    });

    it("turns the mic into a stop control while listening", async () => {
      await renderDock({ mic: "listening" });
      const mic = screen.getByHintText("Finishes this ayah");
      expect(mic).toBe(screen.getByLabelText("Listening"));
      expect(mic).toBeSelected();
    });

    it.each(["starting", "settling"] as const)("blocks the mic while %s", async (mic) => {
      const { onMic } = await renderDock({ mic });
      await fireEvent.press(screen.getByRole("button", { name: /Start|Listening/ }));
      expect(onMic).not.toHaveBeenCalled();
    });

    it("blocks the mic while the listener is preparing", async () => {
      const { onMic } = await renderDock({ preparing: true });
      await fireEvent.press(screen.getByLabelText("Start"));
      expect(onMic).not.toHaveBeenCalled();
    });

    it("blocks a disabled mic", async () => {
      const { onMic } = await renderDock({ micDisabled: true });
      const mic = screen.getByLabelText("Start");
      expect(mic).toBeDisabled();
      await fireEvent.press(mic);
      expect(onMic).not.toHaveBeenCalled();
    });

    it("plays the reference from Hear", async () => {
      const { onHear } = await renderDock();
      await fireEvent.press(screen.getByLabelText("Hear"));
      expect(onHear).toHaveBeenCalled();
    });

    it("offers to stop the reference while it plays", async () => {
      await renderDock({ isHearing: true });
      expect(screen.getByLabelText("Stop the recitation")).toBeSelected();
    });

    it("pulses the ring while listening", async () => {
      const ringStyle = captureRingStyle();
      await renderDock({ mic: "listening" });
      expect(ringStyle()).toEqual({ opacity: 0, transform: [{ scale: 1.45 }] });
    });

    it("keeps the ring still when motion is reduced", async () => {
      jest.spyOn(Reanimated, "useReducedMotion").mockReturnValue(true);
      const ringStyle = captureRingStyle();
      await renderDock({ mic: "listening" });
      expect(ringStyle()).toEqual({ opacity: 0.45, transform: [{ scale: 1 }] });
    });
  });

  describe("listen-only", () => {
    it("makes Listen the primary control", async () => {
      const { onHear, onMic } = await renderDock({ showMic: false });
      await fireEvent.press(screen.getByLabelText("Listen"));
      expect(onHear).toHaveBeenCalled();
      expect(onMic).not.toHaveBeenCalled();
      expect(screen.queryByLabelText("Hear")).toBeNull();
    });

    it("offers to stop while the recitation plays", async () => {
      await renderDock({ showMic: false, isHearing: true });
      expect(screen.getByLabelText("Stop the recitation")).toBeSelected();
    });
  });

  describe("reveal controls", () => {
    it("reveals the next word on tap and the rest on long-press", async () => {
      const { onReveal, onRevealAll } = await renderDock({ showReveal: true });
      const reveal = screen.getByLabelText("Reveal");
      await fireEvent.press(reveal);
      await fireEvent(reveal, "longPress");
      expect(onReveal).toHaveBeenCalled();
      expect(onRevealAll).toHaveBeenCalled();
    });

    it("keeps Reveal all as a gesture on phones", async () => {
      await renderDock({ showReveal: true });
      expect(screen.queryByLabelText("Reveal all")).toBeNull();
    });

    it("adds a Reveal all button on wide windows", async () => {
      setMockWindowSize(1024);
      const { onRevealAll } = await renderDock({ showReveal: true });
      await fireEvent.press(screen.getByLabelText("Reveal all"));
      expect(onRevealAll).toHaveBeenCalled();
    });
  });

  it("ends the session", async () => {
    const { onEnd } = await renderDock();
    await fireEvent.press(screen.getByLabelText("End"));
    expect(onEnd).toHaveBeenCalled();
  });

  it.each([
    [false, 1],
    [true, 0],
  ])("compact=%s shows %s visible End label", async (compact, count) => {
    await renderDock({ compact });
    expect(screen.queryAllByText("End")).toHaveLength(count);
  });
});
