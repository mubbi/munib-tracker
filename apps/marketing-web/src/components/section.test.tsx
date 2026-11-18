import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./section";

type Props = Parameters<typeof Section>[0];

function setup(props: Partial<Props> = {}) {
  const { container } = render(<Section title="Title" {...props} />);
  return container.querySelector("section") as HTMLElement;
}

describe("Section", () => {
  it("renders only the title when nothing else is given", () => {
    const section = setup();
    expect(screen.getByRole("heading", { name: "Title" })).not.toHaveClass("mt-3");
    expect(section.querySelector("p")).toBeNull();
    expect(section.querySelector(".mt-12")).toBeNull();
  });

  it.each([
    ["default", "text-brand", "text-white/65"],
    ["hero-band", "text-hero-gold", "text-hero-muted"],
  ] as const)("styles the %s eyebrow and description", (variant, eyebrowClass, descClass) => {
    setup({ variant, eyebrow: "Eyebrow", description: "Desc" });
    expect(screen.getByText("Eyebrow")).toHaveClass(eyebrowClass);
    expect(screen.getByText("Desc")).toHaveClass(descClass);
    expect(screen.getByRole("heading", { name: "Title" })).toHaveClass("mt-3");
  });

  it("left-aligns the header when asked", () => {
    setup({ align: "left", eyebrow: "Eyebrow" });
    expect(screen.getByText("Eyebrow").parentElement).not.toHaveClass("text-center");
  });

  it("renders children below the header", () => {
    setup({ id: "s", children: <span>Body</span> });
    expect(screen.getByText("Body").parentElement).toHaveClass("mt-12");
  });
});
