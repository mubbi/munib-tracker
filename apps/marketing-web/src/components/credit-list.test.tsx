import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CreditList } from "./credit-list";

const sampleSources = [
  {
    name: "Quran.com API",
    attribution: "Quran text and translations",
    license: "Various open licenses",
    url: "https://quran.com",
    note: "Used for offline bundles",
  },
  {
    name: "Hadith Database",
    attribution: "Hadith collections",
    license: "Public domain",
    url: "https://example.com/hadith",
  },
] as const;

describe("CreditList", () => {
  it("renders credit sources with attribution and license", () => {
    render(<CreditList sources={sampleSources} />);

    expect(screen.getByRole("link", { name: "Quran.com API" })).toHaveAttribute(
      "href",
      "https://quran.com",
    );
    expect(screen.getByText("Quran text and translations")).toBeInTheDocument();
    expect(screen.getByText("Various open licenses")).toBeInTheDocument();
    expect(screen.getByText("Used for offline bundles")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Hadith Database" })).toHaveAttribute(
      "href",
      "https://example.com/hadith",
    );
    expect(screen.getByText("Hadith collections")).toBeInTheDocument();
    expect(screen.getByText("Public domain")).toBeInTheDocument();
  });
});
