import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Magnetic, SpotlightCard } from "./interactive";

const RECT = { left: 100, top: 50, width: 200, height: 100 };

function mockRect(el: HTMLElement): HTMLElement {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue(RECT as DOMRect);
  return el;
}

/** The element a wrapper component attaches its pointer handlers to. */
function wrapperOf(text: string): HTMLElement {
  return screen.getByText(text).parentElement as HTMLElement;
}

/** Make `prefers-reduced-motion: reduce` match (or not) for the next render. */
function setReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: reduce && query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

afterEach(() => vi.unstubAllGlobals());

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
  function setupMagnetic(reduceMotion = false) {
    setReducedMotion(reduceMotion);
    render(
      <Magnetic className="extra">
        <span>content</span>
      </Magnetic>,
    );
    return mockRect(wrapperOf("content"));
  }

  it("leans toward the cursor", () => {
    const el = setupMagnetic();
    // Centre is (200, 100); 30% of the (+100, +50) offset.
    fireEvent.mouseMove(el, { clientX: 300, clientY: 150 });
    expect(el.style.transform).toContain("translateX(30px)");
    expect(el.style.transform).toContain("translateY(15px)");
  });

  it("springs back when the cursor leaves", () => {
    const el = setupMagnetic();
    fireEvent.mouseMove(el, { clientX: 300, clientY: 150 });
    fireEvent.mouseLeave(el);
    expect(el.style.transform).toBe("");
    // The return is animated by CSS, not script.
    expect(el.className).toContain("transition-transform");
  });

  it("stays still when the user prefers reduced motion", () => {
    const el = setupMagnetic(true);
    fireEvent.mouseMove(el, { clientX: 300, clientY: 150 });
    expect(el.style.transform).toBe("");
    expect(el).toHaveClass("inline-flex", "extra");
  });
});
