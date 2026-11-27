import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { assertCronSecret, safeEqual } from "./cron-secret";

describe("safeEqual", () => {
  it.each([
    ["abc", "abc", true],
    ["abc", "abd", false],
    ["abc", "abcd", false],
    ["", "", true],
  ])("%s vs %s → %s", (a, b, expected) => {
    expect(safeEqual(a, b)).toBe(expected);
  });
});

describe("assertCronSecret", () => {
  it("accepts the bearer of the trimmed configured secret", () => {
    expect(() => assertCronSecret("Bearer s3cret", "  s3cret ", "surface push")).not.toThrow();
  });

  it.each([
    ["no header", undefined, "s3cret", "Invalid surface push cron secret"],
    ["wrong secret", "Bearer nope", "s3cret", "Invalid surface push cron secret"],
    ["missing scheme", "s3cret", "s3cret", "Invalid surface push cron secret"],
    ["unset secret", "Bearer s3cret", undefined, "Surface push cron is not configured"],
    ["blank secret", "Bearer ", "   ", "Surface push cron is not configured"],
  ])("refuses %s", (_label, authorization, secret, message) => {
    expect(() => assertCronSecret(authorization, secret, "surface push")).toThrow(
      new UnauthorizedException(message),
    );
  });

  it("keeps the label's casing in both messages", () => {
    expect(() => assertCronSecret(undefined, undefined, "Live Activity")).toThrow(
      "Live Activity cron is not configured",
    );
    expect(() => assertCronSecret("Bearer x", "y", "Live Activity")).toThrow(
      "Invalid Live Activity cron secret",
    );
  });
});
