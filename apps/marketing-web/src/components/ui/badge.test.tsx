import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>New release</Badge>);
    expect(screen.getByText("New release")).toBeInTheDocument();
  });

  it("renders a custom icon when provided", () => {
    render(<Badge icon={<span data-testid="custom-icon">★</span>}>Featured</Badge>);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it.each([
    ["default", "text-muted"],
    ["hero", "text-hero-gold"],
  ] as const)("applies the %s tone", (tone, className) => {
    render(<Badge tone={tone}>Tone</Badge>);
    expect(screen.getByText("Tone")).toHaveClass(className);
  });
});
