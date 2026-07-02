import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders Munib Tracker branding", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { name: /Munib Tracker/i })).toBeInTheDocument();
    expect(screen.getByText(/Track salah, dhikr, and qadha/i)).toBeInTheDocument();
  });
});
