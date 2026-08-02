import { APP_HOME_FEATURES, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureGrid } from "./feature-grid";

describe("FeatureGrid", () => {
  it("renders the section and home feature cards", () => {
    render(<FeatureGrid />);

    expect(screen.getByRole("heading", { name: APP_TAGLINE, level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();

    for (const feature of APP_HOME_FEATURES) {
      expect(screen.getByRole("heading", { name: feature.title, level: 3 })).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    }

    expect(screen.getAllByRole("link", { name: /Learn more/i }).length).toBe(
      APP_HOME_FEATURES.length,
    );
  });
});
