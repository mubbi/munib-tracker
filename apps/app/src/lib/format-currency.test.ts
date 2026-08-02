import { describe, expect, it } from "@jest/globals";

import {
  currencyPickerLabel,
  DEFAULT_NUMBER_FORMAT,
  formatAmount,
  formatMoneyAmount,
  formatNumberForInput,
  formatNumberInput,
  getDecimalSeparator,
  isNumberFormatStyle,
  parseNumberInput,
  reformatNumberString,
} from "./format-currency";

describe("isNumberFormatStyle", () => {
  it("accepts known styles", () => {
    expect(isNumberFormatStyle("comma_dot")).toBe(true);
    expect(isNumberFormatStyle("dot_comma")).toBe(true);
    expect(isNumberFormatStyle("space_dot")).toBe(true);
    expect(isNumberFormatStyle("space_comma")).toBe(true);
  });

  it("rejects unknown values", () => {
    expect(isNumberFormatStyle("invalid")).toBe(false);
    expect(isNumberFormatStyle(null)).toBe(false);
    expect(isNumberFormatStyle(undefined)).toBe(false);
  });
});

describe("formatAmount", () => {
  it("formats comma_dot style", () => {
    expect(formatAmount(22000.03, "comma_dot")).toBe("22,000.03");
    expect(formatAmount(-1234.5, "comma_dot", 1)).toBe("-1,234.5");
  });

  it("formats dot_comma style", () => {
    expect(formatAmount(22000.03, "dot_comma")).toBe("22.000,03");
  });

  it("formats space_dot style with non-breaking space thousands", () => {
    expect(formatAmount(22000.03, "space_dot")).toBe("22\u00A0000.03");
  });

  it("formats space_comma style", () => {
    expect(formatAmount(22000.03, "space_comma")).toBe("22\u00A0000,03");
  });

  it("omits fractional part when decimals is 0", () => {
    expect(formatAmount(1000, "comma_dot", 0)).toBe("1,000");
  });
});

describe("getDecimalSeparator", () => {
  it("returns dot or comma per style", () => {
    expect(getDecimalSeparator("comma_dot")).toBe(".");
    expect(getDecimalSeparator("dot_comma")).toBe(",");
    expect(getDecimalSeparator("space_comma")).toBe(",");
  });
});

describe("parseNumberInput", () => {
  it("parses grouped comma_dot input", () => {
    expect(parseNumberInput("22,000.03", "comma_dot")).toBe(22000.03);
  });

  it("parses dot_comma input", () => {
    expect(parseNumberInput("22.000,03", "dot_comma")).toBe(22000.03);
  });

  it("returns 0 for empty or non-numeric input", () => {
    expect(parseNumberInput("", "comma_dot")).toBe(0);
    expect(parseNumberInput("-", "comma_dot")).toBe(0);
    expect(parseNumberInput("abc", "comma_dot")).toBe(0);
  });
});

describe("formatNumberInput", () => {
  it("groups digits while typing", () => {
    expect(formatNumberInput("22000", DEFAULT_NUMBER_FORMAT)).toBe("22,000");
  });

  it("preserves trailing decimal point", () => {
    expect(formatNumberInput("22000.", DEFAULT_NUMBER_FORMAT)).toBe("22,000.");
  });

  it("limits fractional digits", () => {
    expect(formatNumberInput("1.23456", 2, "comma_dot")).toBe("1.23");
  });

  it("formats dot_comma style", () => {
    expect(formatNumberInput("22000,03", 4, "dot_comma")).toBe("22.000,03");
  });
});

describe("formatNumberForInput", () => {
  it("returns empty for non-positive values", () => {
    expect(formatNumberForInput(0)).toBe("");
    expect(formatNumberForInput(-5)).toBe("");
    expect(formatNumberForInput(Number.NaN)).toBe("");
  });

  it("formats positive values with grouping", () => {
    expect(formatNumberForInput(1234.5)).toBe("1,234.5");
  });
});

describe("reformatNumberString", () => {
  it("converts between number format styles", () => {
    expect(reformatNumberString("22,000.03", "comma_dot", "dot_comma")).toBe("22.000,03");
  });

  it("returns empty for blank input", () => {
    expect(reformatNumberString("   ", "comma_dot", "dot_comma")).toBe("");
  });
});

describe("formatMoneyAmount", () => {
  it("prefixes USD symbol and omits decimals for whole amounts", () => {
    expect(formatMoneyAmount(1000, "USD")).toBe("$1,000");
  });

  it("shows two decimals for fractional amounts", () => {
    expect(formatMoneyAmount(99.5, "USD")).toBe("$99.50");
  });

  it("falls back to code when currency is unknown", () => {
    expect(formatMoneyAmount(10, "XYZ")).toBe("XYZ 10");
  });
});

describe("currencyPickerLabel", () => {
  it("returns code and name for known currencies", () => {
    expect(currencyPickerLabel("USD")).toBe("USD · US Dollar");
  });

  it("returns bare code for unknown currencies", () => {
    expect(currencyPickerLabel("NOPE")).toBe("NOPE");
  });
});
