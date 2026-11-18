import { act, render, screen } from "@testing-library/react-native";
import * as reanimated from "react-native-reanimated";

import { PartyPopper } from "@/components/tasbeeh/party-popper";
import { captureAnimatedStyles } from "@/test-support/reanimated";

/** Renders an idle popper, then triggers burst `burstKey`. */
async function renderBurst(burstKey: number, colors: string[] = ["#111111", "#222222"]) {
  const view = await render(<PartyPopper burstKey={0} colors={colors} />);
  await view.rerender(<PartyPopper burstKey={burstKey} colors={colors} />);
  return view;
}

const particleCount = () => {
  const json = screen.toJSON();
  return json && !Array.isArray(json) ? (json.children ?? []).length : 0;
};

describe("PartyPopper", () => {
  let animatedStyles: ReturnType<typeof captureAnimatedStyles>;

  beforeEach(() => {
    jest.useFakeTimers();
    animatedStyles = captureAnimatedStyles();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("renders nothing until a burst is triggered", async () => {
    await render(<PartyPopper burstKey={0} colors={["#111111"]} />);
    expect(screen.toJSON()).toBeNull();
  });

  it("bursts 28 particles in the given colors", async () => {
    await renderBurst(1);
    expect(particleCount()).toBe(28);
    const serialized = JSON.stringify(screen.toJSON());
    expect(serialized).toContain("#111111");
    expect(serialized).toContain("#222222");
  });

  it("ends each particle faded out and shrunk", async () => {
    // The Reanimated stub resolves timings immediately, so styles show the final frame.
    await renderBurst(1);
    const style = animatedStyles.latest() as { opacity: number; transform: object[] };
    expect(style.opacity).toBe(0);
    expect(style.transform).toContainEqual({ scale: 0.65 });
  });

  it("clears the particles after the animation", async () => {
    await renderBurst(1);
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.toJSON()).toBeNull();
  });

  it("falls back to gold without colors", async () => {
    await renderBurst(2, []);
    expect(JSON.stringify(screen.toJSON())).toContain("#D4AF37");
  });

  it("skips the burst under reduced motion", async () => {
    jest.spyOn(reanimated, "useReducedMotion").mockReturnValue(true);
    await renderBurst(3);
    expect(screen.toJSON()).toBeNull();
  });
});
