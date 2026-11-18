import { conditionFromMetNoSymbol, conditionFromWmoCode } from "./conditions";

describe("conditionFromWmoCode", () => {
  it.each([
    [0, "clear"],
    [1, "clear"],
    [2, "partly_cloudy"],
    [3, "cloudy"],
    [45, "fog"],
    [48, "fog"],
    [51, "rain"],
    [67, "rain"],
    [71, "snow"],
    [77, "snow"],
    [80, "rain"],
    [82, "rain"],
    [85, "snow"],
    [86, "snow"],
    [95, "thunderstorm"],
    [99, "thunderstorm"],
    [4, "partly_cloudy"],
    [90, "partly_cloudy"],
  ])("code %i → %s", (code, expected) => {
    expect(conditionFromWmoCode(code)).toBe(expected);
  });
});

describe("conditionFromMetNoSymbol", () => {
  it.each([
    ["clearsky_day", "clear"],
    ["fair_night", "clear"],
    ["partlycloudy_polartwilight", "partly_cloudy"],
    ["cloudy", "cloudy"],
    ["fog", "fog"],
    ...[
      "lightrain",
      "rain",
      "heavyrain",
      "lightrainshowers_day",
      "rainshowers_day",
      "heavyrainshowers_day",
      "sleet",
      "lightsleet",
      "heavysleet",
      "sleetshowers_day",
      "lightsleetshowers_day",
      "heavysleetshowers_day",
    ].map((s) => [s, "rain"]),
    ...[
      "snow",
      "lightsnow",
      "heavysnow",
      "snowshowers_day",
      "lightsnowshowers_day",
      "heavysnowshowers_day",
    ].map((s) => [s, "snow"]),
    ["rainandthunder", "thunderstorm"],
    ["mystery", "partly_cloudy"],
  ])("%s → %s", (symbol, expected) => {
    expect(conditionFromMetNoSymbol(symbol)).toBe(expected);
  });
});
