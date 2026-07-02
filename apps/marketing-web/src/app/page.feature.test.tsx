import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page feature", () => {
  it("shows hero and all feature sections", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /Munib Tracker/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Built for your journey/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /salah/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /dhikr/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /qadha/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore features/i })).toHaveAttribute(
      "href",
      "#features",
    );
  });
});
