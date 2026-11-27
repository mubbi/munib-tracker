import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotFoundContent } from "@/components/not-found-content";
import { renderWithIntl } from "@/test-support/intl";

describe("NotFoundContent", () => {
  it("renders translated copy and locale-aware links", () => {
    renderWithIntl(<NotFoundContent />);
    expect(screen.getByRole("heading", { name: "This page has wandered off" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "Explore Munib Tracker" })).toHaveAttribute(
      "href",
      "/en/features",
    );
  });
});
