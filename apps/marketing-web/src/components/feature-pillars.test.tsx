import { APP_FEATURE_PILLARS } from "@munib-tracker/shared/constants";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturePillars } from "./feature-pillars";

describe("FeaturePillars", () => {
  it("links to the full feature list when the grid is truncated", () => {
    render(<FeaturePillars limit={2} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    expect(screen.getByRole("link", { name: /features/i })).toHaveAttribute("href", "/features");
  });

  it("shows every pillar without a see-all link by default", () => {
    render(<FeaturePillars align="left" eyebrow="All tools" />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(APP_FEATURE_PILLARS.length);
    expect(screen.queryByRole("link", { name: /features/i })).toBeNull();
    expect(screen.getByText("All tools")).toBeInTheDocument();
  });
});
