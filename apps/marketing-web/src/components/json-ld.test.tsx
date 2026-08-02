import { APP_NAME } from "@munib-tracker/shared/constants";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqJsonLd, JsonLd } from "./json-ld";

describe("JsonLd", () => {
  it("renders SoftwareApplication JSON-LD", () => {
    const { container } = render(<JsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).toBeInTheDocument();
    const schema = JSON.parse(script?.textContent ?? "{}");
    expect(schema["@type"]).toBe("SoftwareApplication");
    expect(schema.name).toBe(APP_NAME);
  });
});

describe("FaqJsonLd", () => {
  it("renders FAQPage JSON-LD from items", () => {
    const items = [
      { question: "Is the app free?", answer: "Yes, Munib Tracker is free." },
      { question: "Does it work offline?", answer: "Core content works offline." },
    ] as const;

    const { container } = render(<FaqJsonLd items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).toBeInTheDocument();
    const schema = JSON.parse(script?.textContent ?? "{}");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0].name).toBe("Is the app free?");
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe("Yes, Munib Tracker is free.");
  });
});
