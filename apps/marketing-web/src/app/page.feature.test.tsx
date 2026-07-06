import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page feature", () => {
  it("shows hero and feature sections", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: APP_TAGLINE, level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(APP_NAME, "i")).length).toBeGreaterThanOrEqual(1);

    const features = document.getElementById("features");
    if (!features) {
      throw new Error("expected #features element");
    }
    expect(within(features).getByRole("heading", { level: 2 })).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /Salah tracking/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Salah on your journey/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all questions/i })).toHaveAttribute(
      "href",
      "/faq",
    );
  });
});
