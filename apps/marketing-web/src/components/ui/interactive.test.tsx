import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Magnetic, SpotlightCard, Tilt } from "./interactive";

vi.mock("framer-motion", async (importOriginal) =>
  (await import("@/test-support/motion")).mockFramerMotion(importOriginal),
);

const RECT = { left: 100, top: 50, width: 200, height: 100 };

function mockRect(el: HTMLElement): HTMLElement {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue(RECT as DOMRect);
  return el;
}

/** The element a wrapper component attaches its pointer handlers to. */
function wrapperOf(text: string): HTMLElement {
  return screen.getByText(text).parentElement as HTMLElement;
}

describe("SpotlightCard", () => {
  it("tracks the cursor position relative to the card in CSS variables", () => {
    render(
      <SpotlightCard className="extra">
        <span>content</span>
      </SpotlightCard>,
    );
    const card = mockRect(wrapperOf("content").parentElement as HTMLElement);

    fireEvent.mouseMove(card, { clientX: 130, clientY: 70 });

    expect(card.style.getPropertyValue("--mx")).toBe("30px");
    expect(card.style.getPropertyValue("--my")).toBe("20px");
    expect(card).toHaveClass("extra");
  });
});

describe("Magnetic", () => {
  beforeEach(() => vi.clearAllMocks());

  function setupMagnetic(reduceMotion = false) {
    vi.mocked(useReducedMotion).mockReturnValue(reduceMotion);
    render(
      <Magnetic className="extra">
        <span>content</span>
      </Magnetic>,
    );
    return mockRect(wrapperOf("content"));
  }

  it("leans toward the cursor", async () => {
    const el = setupMagnetic();
    // Centre is (200, 100); 30% of the (+100, +50) offset.
    fireEvent.mouseMove(el, { clientX: 300, clientY: 150 });
    await waitFor(() => expect(el.style.transform).toContain("translateX(30px)"));
    expect(el.style.transform).toContain("translateY(15px)");
  });

  it("springs back when the cursor leaves", async () => {
    const el = setupMagnetic();
    fireEvent.mouseMove(el, { clientX: 300, clientY: 150 });
    await waitFor(() => expect(el.style.transform).toContain("translateX(30px)"));
    fireEvent.mouseLeave(el);
    await waitFor(() => expect(el.style.transform).not.toContain("translateX(30px)"));
  });

  it("stays still when the user prefers reduced motion", async () => {
    const el = setupMagnetic(true);
    fireEvent.mouseMove(el, { clientX: 300, clientY: 150 });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(el.style.transform).not.toContain("translateX(30px)");
    expect(el).toHaveClass("inline-flex", "extra");
  });
});

describe("Tilt", () => {
  beforeEach(() => vi.clearAllMocks());

  function setupTilt(reduceMotion = false) {
    vi.mocked(useReducedMotion).mockReturnValue(reduceMotion);
    render(
      <Tilt max={10}>
        <span>content</span>
      </Tilt>,
    );
    return mockRect(wrapperOf("content"));
  }

  it("rotates toward the cursor up to the max angle", async () => {
    const el = setupTilt();
    // Bottom-right corner → px = py = 1 → rotateX = -max, rotateY = +max.
    fireEvent.mouseMove(el, { clientX: 300, clientY: 150 });
    await waitFor(() => expect(el.style.transform).toContain("rotateX(-10deg)"));
    expect(el.style.transform).toContain("rotateY(10deg)");
  });

  it("returns to flat when the cursor leaves", async () => {
    const el = setupTilt();
    fireEvent.mouseMove(el, { clientX: 300, clientY: 150 });
    await waitFor(() => expect(el.style.transform).toContain("rotateX(-10deg)"));
    fireEvent.mouseLeave(el);
    await waitFor(() => expect(el.style.transform).not.toContain("rotateX(-10deg)"));
  });

  it("ignores the cursor when the user prefers reduced motion", async () => {
    const el = setupTilt(true);
    fireEvent.mouseMove(el, { clientX: 300, clientY: 150 });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(el.style.transform).not.toContain("rotateX(-10deg)");
  });
});
