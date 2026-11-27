import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Counter } from "./counter";

/** An IntersectionObserver whose callback the test fires by hand. */
let fireIntersect: (isIntersecting: boolean) => void = () => {};
const disconnect = vi.fn();

class ControlledObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {
    fireIntersect = (isIntersecting) =>
      this.callback(
        [{ isIntersecting } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
  }
  observe() {}
  disconnect() {
    disconnect();
  }
}

function setReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: reduce && query.includes("reduced-motion"),
      media: query,
    })),
  );
}

/** Runs every queued animation frame at a time far past the animation's end. */
function finishAnimation() {
  act(() => {
    vi.advanceTimersByTime(5000);
  });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  vi.stubGlobal("IntersectionObserver", ControlledObserver);
  setReducedMotion(false);
  disconnect.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const renderCounter = () => render(<Counter value={1234.5} prefix="~" suffix="+" decimals={1} />);

describe("Counter", () => {
  it("shows zero until it scrolls into view", () => {
    renderCounter();
    expect(screen.getByText("~0.0+")).toBeInTheDocument();
  });

  it("counts up to the formatted value once visible", () => {
    renderCounter();
    act(() => fireIntersect(true));
    finishAnimation();
    expect(screen.getByText("~1,234.5+")).toBeInTheDocument();
    expect(disconnect).toHaveBeenCalled();
  });

  it("stops observing on unmount", () => {
    const { unmount } = renderCounter();
    act(() => unmount());
    expect(disconnect).toHaveBeenCalled();
  });

  it("shows the value straight away when the user prefers reduced motion", () => {
    setReducedMotion(true);
    renderCounter();
    expect(screen.getByText("~1,234.5+")).toBeInTheDocument();
  });
});
