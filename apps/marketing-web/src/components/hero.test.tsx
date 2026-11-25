import { APP_TAGLINE } from "@munib-tracker/shared/constants";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test-support/intl";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the Day Arc headline and CTAs", () => {
    renderWithIntl(<Hero />);
    expect(screen.getByRole("heading", { name: APP_TAGLINE, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get the app/i })).toHaveAttribute(
      "href",
      "/en/download",
    );
    expect(screen.getByRole("link", { name: /Explore features/i })).toHaveAttribute(
      "href",
      "/en/features",
    );
  });
});
