import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanParam,
  filterParamsForPagination,
  hasActiveFilters,
  parseClientPlatform,
  parseDateEnd,
  parseDateRangeParams,
  parseDateStart,
  parseOptionalBool,
  parseOptionalInt,
  resolveDateRange,
} from "./filters";

describe("parseDateStart", () => {
  it("returns undefined for empty or invalid input", () => {
    expect(parseDateStart(undefined)).toBeUndefined();
    expect(parseDateStart("")).toBeUndefined();
    expect(parseDateStart("not-a-date")).toBeUndefined();
  });

  it("returns start of day", () => {
    const date = parseDateStart("2024-03-15");
    expect(date?.getHours()).toBe(0);
    expect(date?.getMinutes()).toBe(0);
    expect(date?.getFullYear()).toBe(2024);
    expect(date?.getMonth()).toBe(2);
    expect(date?.getDate()).toBe(15);
  });
});

describe("parseDateEnd", () => {
  it("returns end of day", () => {
    const date = parseDateEnd("2024-03-15");
    expect(date?.getHours()).toBe(23);
    expect(date?.getMinutes()).toBe(59);
    expect(date?.getSeconds()).toBe(59);
  });
});

describe("cleanParam", () => {
  it("trims and drops empty strings", () => {
    expect(cleanParam("  hello  ")).toBe("hello");
    expect(cleanParam("   ")).toBeUndefined();
    expect(cleanParam(undefined)).toBeUndefined();
  });
});

describe("hasActiveFilters", () => {
  it("returns true when any param is non-empty", () => {
    expect(hasActiveFilters(undefined, "  ", "active")).toBe(true);
    expect(hasActiveFilters(undefined, "", undefined)).toBe(false);
  });
});

describe("parseOptionalInt", () => {
  it("parses integers and rejects invalid", () => {
    expect(parseOptionalInt("42")).toBe(42);
    expect(parseOptionalInt("42.9")).toBe(42);
    expect(parseOptionalInt("abc")).toBeUndefined();
    expect(parseOptionalInt("")).toBeUndefined();
  });
});

describe("parseOptionalBool", () => {
  it("parses truthy and falsy tokens", () => {
    expect(parseOptionalBool("1")).toBe(true);
    expect(parseOptionalBool("true")).toBe(true);
    expect(parseOptionalBool("yes")).toBe(true);
    expect(parseOptionalBool("0")).toBe(false);
    expect(parseOptionalBool("false")).toBe(false);
    expect(parseOptionalBool("no")).toBe(false);
  });

  it("returns undefined for unknown values", () => {
    expect(parseOptionalBool("maybe")).toBeUndefined();
    expect(parseOptionalBool(undefined)).toBeUndefined();
  });
});

describe("parseClientPlatform", () => {
  it("accepts known platforms", () => {
    expect(parseClientPlatform("ios")).toBe("ios");
    expect(parseClientPlatform(" android ")).toBe("android");
    expect(parseClientPlatform("web")).toBe("web");
  });

  it("rejects unknown platforms", () => {
    expect(parseClientPlatform("tvos")).toBeUndefined();
    expect(parseClientPlatform("")).toBeUndefined();
  });
});

describe("resolveDateRange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("prefers explicit from/to over period preset", () => {
    const range = resolveDateRange("30d", "2024-01-01", "2024-01-31");
    expect(range.preset).toBe("custom");
    expect(range.from?.getFullYear()).toBe(2024);
    expect(range.to?.getFullYear()).toBe(2024);
  });

  it("defaults to now when only from is set", () => {
    const range = resolveDateRange(undefined, "2024-01-01", undefined);
    expect(range.preset).toBe("custom");
    expect(range.to?.toISOString()).toBe("2024-06-15T12:00:00.000Z");
  });

  it("applies period presets", () => {
    const range = resolveDateRange("7d", undefined, undefined);
    expect(range.preset).toBe("7d");
    expect(range.from).toBeDefined();
    expect(range.to?.toISOString()).toBe("2024-06-15T12:00:00.000Z");
  });

  it("returns empty object when no filters", () => {
    expect(resolveDateRange(undefined, undefined, undefined)).toEqual({});
  });
});

describe("filterParamsForPagination", () => {
  it("drops page and empty values", () => {
    expect(
      filterParamsForPagination({
        page: "2",
        q: "  hello ",
        status: "",
        from: "2024-01-01",
      }),
    ).toEqual({
      q: "hello",
      from: "2024-01-01",
    });
  });
});

describe("parseDateRangeParams", () => {
  it("delegates to resolveDateRange with cleaned params", () => {
    const range = parseDateRangeParams({ period: " 30d ", from: "", to: "" });
    expect(range.preset).toBe("30d");
  });
});
