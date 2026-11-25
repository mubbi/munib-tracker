import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test-support/intl";
import { SkipLink } from "./skip-link";

describe("SkipLink", () => {
  it("renders an accessible skip link to main content", () => {
    renderWithIntl(<SkipLink />);

    const link = screen.getByRole("link", { name: /Skip to main content/i });
    expect(link).toHaveAttribute("href", "#main-content");
    expect(link).toHaveClass("skip-link");
  });
});
