import { screen } from "@testing-library/react-native";
import * as Reanimated from "react-native-reanimated";

import { ProgressRing } from "@/components/ui/progress-ring";
import { captureAnimationFrames } from "@/test-support/animation-frames";
import { queryHostsByRole } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof ProgressRing>[0];

const renderRing = async (props: Props) => {
  const { rerender, unmount } = await renderWithTheme(<ProgressRing {...props} />);
  return {
    unmount,
    setProgress: (progress: number) => rerender(<ProgressRing {...props} progress={progress} />),
  };
};

const ring = () => queryHostsByRole("progressbar")[0]!;

describe("ProgressRing", () => {
  let animation: ReturnType<typeof captureAnimationFrames>;
  beforeEach(() => {
    animation = captureAnimationFrames();
  });
  afterEach(() => jest.restoreAllMocks());

  it("labels the ring with its caption", async () => {
    await renderRing({ progress: 0.5, caption: "done", valueFontSize: 20 });

    expect(ring().props.accessibilityLabel).toBe("50% done");
    expect(screen.getByText("done")).toBeTruthy();
  });

  it("counts the centre value up from zero", async () => {
    await renderRing({ progress: 0.5 });
    expect(screen.getByText("0%")).toBeTruthy();

    await animation.flush(0, 450, 900);

    expect(screen.getByText("50%")).toBeTruthy();
    expect(animation.frames).toHaveLength(0);
  });

  it("animates from the current value to a new, clamped target", async () => {
    const { setProgress } = await renderRing({
      progress: 0.2,
      color: "#f00",
      trackColor: "#eee",
      surfaceColor: "#fff",
    });
    await animation.flush(0, 2000);

    await setProgress(1.4);
    await animation.flush(0, 2000);

    expect(screen.getByText("100%")).toBeTruthy();
    expect(ring().props.accessibilityLabel).toBeUndefined();
  });

  it("cancels a pending frame on unmount", async () => {
    const { unmount } = await renderRing({ progress: 0.6 });

    await unmount();

    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("snaps to the target under reduced motion", async () => {
    jest.spyOn(Reanimated, "useReducedMotion").mockReturnValue(true);
    await renderRing({ progress: 0.75 });

    expect(screen.getByText("75%")).toBeTruthy();
  });

  it("hides the knob at zero progress", async () => {
    await renderRing({ progress: -1 });

    expect(ring().children).toHaveLength(2);
  });
});
