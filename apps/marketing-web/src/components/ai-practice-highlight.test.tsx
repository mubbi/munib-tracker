import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRODUCT_APP_URL } from "@/lib/site";
import { AiPracticeBanner } from "./ai-practice-highlight";

describe("AiPracticeBanner", () => {
  it("renders the compact practice banner with its app deep link", () => {
    render(<AiPracticeBanner placement="features" />);
    expect(screen.getByRole("heading", { name: /Qur'an practice with AI/ })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Highlights" })).toBeInTheDocument();
    const links = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(links).toContain(`${PRODUCT_APP_URL}/quran/practice`);
  });
});
