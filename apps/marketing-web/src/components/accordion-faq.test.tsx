import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { trackFaqToggle } from "@/lib/analytics";
import { AccordionFaq } from "./accordion-faq";

vi.mock("@/lib/analytics");

const ITEMS = [
  { question: "First?", answer: "One." },
  { question: "Second?", answer: "Two." },
];

function setup() {
  render(<AccordionFaq items={ITEMS} />);
  return {
    first: screen.getByRole("button", { name: "First?" }),
    second: screen.getByRole("button", { name: "Second?" }),
  };
}

describe("AccordionFaq", () => {
  beforeEach(() => vi.clearAllMocks());

  it("opens the first answer by default", () => {
    const { first, second } = setup();
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("One.")).toBeInTheDocument();
  });

  it("opens another question and tracks the expansion", () => {
    const { first, second } = setup();
    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(trackFaqToggle).toHaveBeenCalledWith(1, true);
  });

  it("collapses the open question without tracking", () => {
    const { first } = setup();
    fireEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(trackFaqToggle).not.toHaveBeenCalled();
  });
});
