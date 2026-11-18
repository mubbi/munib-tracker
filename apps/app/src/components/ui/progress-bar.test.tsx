import { ProgressBar, SegmentedProgress } from "@/components/ui/progress-bar";
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
    await renderWithTheme(<ProgressBar value={0.5} />);

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
      <ProgressBar value={value} height={4} color="#ff0000" trackColor="#00ff00" />,
    );

    expect(bar().props.accessibilityValue).toEqual({ now, min: 0, max: 100 });
  });
});

describe("SegmentedProgress", () => {
  afterEach(() => jest.mocked(progressSweepRtl).mockReturnValue(false));

  it.each([
    [5, 7, 5],
    [4, 2, 2],
    [-1, -3, 0],
  ])("total=%i completed=%i reports %i", async (total, completed, now) => {
    await renderWithTheme(<SegmentedProgress total={total} completed={completed} />);

    expect(bar().props.accessibilityValue).toEqual({ min: 0, max: Math.max(0, total), now });
    expect(bar().children).toHaveLength(Math.max(0, total));
  });

  it("fills ticks from the end in RTL", async () => {
    jest.mocked(progressSweepRtl).mockReturnValue(true);
    await renderWithTheme(
      <SegmentedProgress total={4} completed={1} color="#ff0000" trackColor="#eee" />,
    );

    const segments = bar().children as { children: unknown[] }[];
    expect(segments.map((segment) => segment.children.length)).toEqual([0, 0, 0, 1]);
  });
});
