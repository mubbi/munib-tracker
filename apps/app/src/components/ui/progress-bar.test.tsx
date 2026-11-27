import * as Reanimated from "react-native-reanimated";

import { ProgressBar, SegmentedProgress } from "@/components/ui/progress-bar";
import { Springs } from "@/constants/motion";
import { progressSweepRtl } from "@/lib/chart-rtl";
import { queryHostsByRole } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/lib/chart-rtl", () => ({
  ...jest.requireActual("@/lib/chart-rtl"),
  progressSweepRtl: jest.fn(() => false),
}));

const bar = () => queryHostsByRole("progressbar")[0];

describe("ProgressBar", () => {
  it("defaults to an 8pt accent bar", async () => {
    await renderWithTheme(<ProgressBar value={0.5} accessibilityLabel="Progress" />);

    expect(bar().props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ height: 8 })]),
    );
  });

  it.each([
    [1.5, 100],
    [-1, 0],
    [0.42, 42],
  ])("clamps %f to %i%%", async (value, now) => {
    await renderWithTheme(
      <ProgressBar
        value={value}
        accessibilityLabel="Progress"
        height={4}
        color="#ff0000"
        trackColor="#00ff00"
      />,
    );

    expect(bar().props.accessibilityValue).toEqual({ now, min: 0, max: 100 });
  });
});

describe("ProgressBar naming and motion", () => {
  afterEach(() => jest.restoreAllMocks());

  it("is named by accessibilityLabel", async () => {
    await renderWithTheme(<ProgressBar value={0.3} accessibilityLabel="Khatm progress" />);
    expect(bar().props.accessibilityLabel).toBe("Khatm progress");
  });

  it("springs the fill normally", async () => {
    const spring = jest.spyOn(Reanimated, "withSpring");
    await renderWithTheme(<ProgressBar value={0.3} accessibilityLabel="Progress" />);

    expect(spring).toHaveBeenCalledWith(0.3, Springs.gentle);
  });

  it("jumps to the value under reduced motion", async () => {
    jest.spyOn(Reanimated, "useReducedMotion").mockReturnValue(true);
    const { rerender } = await renderWithTheme(
      <ProgressBar value={0.3} accessibilityLabel="Progress" />,
    );
    const spring = jest.spyOn(Reanimated, "withSpring");

    await rerender(<ProgressBar value={0.6} accessibilityLabel="Progress" />);

    expect(spring).not.toHaveBeenCalled();
  });

  it("names segmented progress too", async () => {
    await renderWithTheme(
      <SegmentedProgress total={5} completed={2} accessibilityLabel="Daily Salah" />,
    );
    expect(bar().props.accessibilityLabel).toBe("Daily Salah");
  });
});

describe("SegmentedProgress", () => {
  afterEach(() => jest.mocked(progressSweepRtl).mockReturnValue(false));

  it.each([
    [5, 7, 5],
    [4, 2, 2],
    [-1, -3, 0],
  ])("total=%i completed=%i reports %i", async (total, completed, now) => {
    await renderWithTheme(
      <SegmentedProgress accessibilityLabel="Progress" total={total} completed={completed} />,
    );

    expect(bar().props.accessibilityValue).toEqual({ min: 0, max: Math.max(0, total), now });
    expect(bar().children).toHaveLength(Math.max(0, total));
  });

  it("fills ticks from the end in RTL", async () => {
    jest.mocked(progressSweepRtl).mockReturnValue(true);
    await renderWithTheme(
      <SegmentedProgress
        accessibilityLabel="Progress"
        total={4}
        completed={1}
        color="#ff0000"
        trackColor="#eee"
      />,
    );

    const segments = bar().children as { children: unknown[] }[];
    expect(segments.map((segment) => segment.children.length)).toEqual([0, 0, 0, 1]);
  });
});
