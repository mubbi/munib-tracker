import { act, render, screen } from "@testing-library/react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Counter } from "./counter";

vi.mock("framer-motion", async (importOriginal) => ({
  ...(await (await import("@/test-support/motion")).mockFramerMotion(importOriginal)),
  animate: vi.fn(),
}));

type AnimateOptions = { onUpdate: (value: number) => void };

function setup({ inView = true, reduceMotion = false } = {}) {
  const stop = vi.fn();
  vi.mocked(useInView).mockReturnValue(inView);
  vi.mocked(useReducedMotion).mockReturnValue(reduceMotion);
  vi.mocked(animate).mockImplementation(((_from: number, to: number, opts: AnimateOptions) => {
    opts.onUpdate(to);
    return { stop };
  }) as unknown as typeof animate);
  const view = render(<Counter value={1234.5} prefix="~" suffix="+" decimals={1} />);
  return { ...view, stop };
}

describe("Counter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows zero until it scrolls into view", () => {
    setup({ inView: false });
    expect(screen.getByText("~0.0+")).toBeInTheDocument();
    expect(animate).not.toHaveBeenCalled();
  });

  it("animates up to the formatted value once visible", () => {
    setup();
    expect(screen.getByText("~1,234.5+")).toBeInTheDocument();
    expect(animate).toHaveBeenCalledWith(0, 1234.5, expect.objectContaining({ duration: 1.8 }));
  });

  it("stops the animation on unmount", () => {
    const { unmount, stop } = setup();
    act(() => unmount());
    expect(stop).toHaveBeenCalled();
  });

  it("jumps straight to the value when the user prefers reduced motion", () => {
    setup({ reduceMotion: true });
    expect(screen.getByText("~1,234.5+")).toBeInTheDocument();
    expect(animate).not.toHaveBeenCalled();
  });
});
