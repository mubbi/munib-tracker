import { APP_TAGLINE } from "@munib-tracker/shared/constants";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the Day Arc headline and CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { name: APP_TAGLINE, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get the app/i })).toHaveAttribute("href", "/download");
    expect(screen.getByRole("link", { name: /Explore features/i })).toHaveAttribute(
      "href",
      "/features",
    );
  });
});
