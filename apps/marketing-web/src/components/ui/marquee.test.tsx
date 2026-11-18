import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Marquee } from "./marquee";

function setup(reverse?: boolean) {
  render(<Marquee reverse={reverse}>item</Marquee>);
  return screen.getAllByText("item");
}

describe("Marquee", () => {
  it("duplicates its content so the loop is seamless", () => {
    const [first, copy] = setup();
    expect(first).not.toHaveAttribute("aria-hidden");
    expect(copy).toHaveAttribute("aria-hidden");
  });

  it.each([
    [undefined, "animate-marquee"],
    [true, "animate-marquee-reverse"],
  ])("uses the right animation when reverse=%s", (reverse, animation) => {
    for (const track of setup(reverse)) expect(track).toHaveClass(animation);
  });
});
