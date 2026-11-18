import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { trackCtaClick } from "@/lib/analytics";
import { CtaBand } from "./cta-band";

vi.mock("@/lib/analytics");

describe("CtaBand", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    [/Get the app/, "get_app", "/download"],
    [/Explore features/, "explore_features", "/features"],
  ])("links %s and tracks the click", (name, cta, href) => {
    render(<CtaBand />);
    const link = screen.getByRole("link", { name });
    expect(link).toHaveAttribute("href", href);
    fireEvent.click(link);
    expect(trackCtaClick).toHaveBeenCalledWith(cta, "cta");
  });
});
