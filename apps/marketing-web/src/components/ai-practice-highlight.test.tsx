import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRODUCT_APP_URL } from "@/lib/site";
import { renderWithIntl } from "@/test-support/intl";
import { AiPracticeHighlight } from "./ai-practice-highlight";

describe("AiPracticeHighlight", () => {
  it("renders the practice spotlight with its app deep link and feature page", () => {
    renderWithIntl(<AiPracticeHighlight />);
    expect(document.querySelectorAll("#quran-practice")).toHaveLength(1);
    const links = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(links).toContain(`${PRODUCT_APP_URL}/quran/practice`);
    expect(links).toContain("/en/features/quran-practice");
  });
});
