import { describe, expect, it } from "vitest";
import { resolveUpdateRequired } from "./app-version.service";

describe("resolveUpdateRequired", () => {
  it("returns none when client meets all thresholds", () => {
    expect(resolveUpdateRequired("1.2.0", "1.2.0", "1.1.0", "1.0.0")).toMatchObject({
      updateRequired: "none",
    });
  });

  it("returns soft when client is below latest but above hard floor", () => {
    expect(resolveUpdateRequired("1.1.0", "1.2.0", "1.0.0", "1.0.0")).toMatchObject({
      updateRequired: "soft",
    });
  });

  it("returns soft when client is below min soft version", () => {
    expect(resolveUpdateRequired("1.0.5", "1.2.0", "1.1.0", "1.0.0")).toMatchObject({
      updateRequired: "soft",
    });
  });

  it("returns hard when client is below min hard version", () => {
    expect(resolveUpdateRequired("0.9.0", "1.2.0", "1.1.0", "1.0.0")).toMatchObject({
      updateRequired: "hard",
    });
  });

  it("hard update takes priority over soft", () => {
    expect(resolveUpdateRequired("0.5.0", "2.0.0", "1.5.0", "1.0.0")).toMatchObject({
      updateRequired: "hard",
    });
  });
});
