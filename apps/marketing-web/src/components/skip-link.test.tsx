import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipLink } from "./skip-link";

describe("SkipLink", () => {
  it("renders an accessible skip link to main content", () => {
    render(<SkipLink />);

    const link = screen.getByRole("link", { name: /Skip to main content/i });
    expect(link).toHaveAttribute("href", "#main-content");
    expect(link).toHaveClass("skip-link");
  });
});
