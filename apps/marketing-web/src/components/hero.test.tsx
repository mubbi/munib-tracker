import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders Munib Tracker branding and CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { name: APP_TAGLINE, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(APP_NAME, "i"))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View iOS download options/i })).toHaveAttribute(
      "href",
      "/download",
    );
    expect(screen.getByRole("link", { name: /Explore features/i })).toHaveAttribute(
      "href",
      "/features",
    );
  });
});
