import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackNavClick } from "@/lib/analytics";
import { renderWithIntl } from "@/test-support/intl";
import { BackToTop } from "./back-to-top";

vi.mock("@/lib/analytics");
vi.mock("@/i18n/navigation", () => ({ usePathname: () => "/features" }));

/** Scrolls the window to `y` and lets the rAF-throttled check run. */
function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
    window.dispatchEvent(new Event("scroll"));
    vi.runAllTimers();
  });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame"] });
  Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  window.scrollTo = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("BackToTop", () => {
  it("stays hidden near the top of the page", () => {
    renderWithIntl(<BackToTop />);
    scrollTo(600);
    expect(screen.queryByRole("button", { name: "Back to top" })).toBeNull();
  });

  it("appears after about a screen and a half of scrolling", () => {
    renderWithIntl(<BackToTop />);
    scrollTo(1300);
    expect(screen.getByRole("button", { name: "Back to top" })).toBeInTheDocument();
  });

  it("scrolls to the top, moves focus to the content start and records the click", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    document.body.append(main);
    renderWithIntl(<BackToTop />);
    scrollTo(2000);

    fireEvent.click(screen.getByRole("button", { name: "Back to top" }));

    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    expect(document.activeElement).toBe(main);
    expect(trackNavClick).toHaveBeenCalledWith("back_to_top", "/features");
    main.remove();
  });
});
