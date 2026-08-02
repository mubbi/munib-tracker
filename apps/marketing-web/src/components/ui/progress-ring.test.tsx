import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressRing } from "./progress-ring";

describe("ProgressRing", () => {
  it("renders an svg progress indicator", () => {
    render(<ProgressRing progress={0.75} />);

    const svg = screen.getByRole("img", { name: "progress" });
    expect(svg.tagName.toLowerCase()).toBe("svg");
    expect(svg.querySelector("circle[stroke-dasharray]")).toBeInTheDocument();
    expect(svg.querySelector("linearGradient")).toBeInTheDocument();
  });

  it("renders children in the center", () => {
    render(
      <ProgressRing progress={0.5}>
        <span>75%</span>
      </ProgressRing>,
    );
    expect(screen.getByText("75%")).toBeInTheDocument();
  });
});
