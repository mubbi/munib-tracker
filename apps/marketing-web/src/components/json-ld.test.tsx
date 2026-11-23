import { APP_NAME } from "@munib-tracker/shared/constants";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqJsonLd, JsonLd, SoftwareJsonLd } from "./json-ld";

function parse(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).toBeInTheDocument();
  return JSON.parse(script?.textContent ?? "{}");
}

describe("JsonLd", () => {
  it("renders the sitewide Organization + WebSite graph", () => {
    const schema = parse(render(<JsonLd />).container);
    const types = schema["@graph"].map((n: { "@type": string }) => n["@type"]);
    expect(types).toEqual(["Organization", "WebSite"]);
    expect(schema["@graph"][0].name).toBe(APP_NAME);
  });

  it("renders SoftwareApplication without ratings", () => {
    const node = parse(render(<SoftwareJsonLd />).container)["@graph"][0];
    expect(node["@type"]).toBe("SoftwareApplication");
    expect(node.name).toBe(APP_NAME);
    expect(node.offers.price).toBe("0");
    expect(node.aggregateRating).toBeUndefined();
  });
});

describe("FaqJsonLd", () => {
  it("renders FAQPage JSON-LD from items and strips inline markup", () => {
    const items = [
      { question: "Is the app free?", answer: "Yes, Munib Tracker is free." },
      { question: "Does it work offline?", answer: "See [offline data](/faq) for **details**." },
    ] as const;
    const node = parse(render(<FaqJsonLd items={items} />).container)["@graph"][0];
    expect(node["@type"]).toBe("FAQPage");
    expect(node.mainEntity).toHaveLength(2);
    expect(node.mainEntity[0].name).toBe("Is the app free?");
    expect(node.mainEntity[1].acceptedAnswer.text).toBe("See offline data for details.");
  });
});
