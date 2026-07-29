import type { TemperatureUnit } from "@munib-tracker/shared/types";

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = unit === "fahrenheit" ? celsiusToFahrenheit(celsius) : celsius;
  return `${Math.round(value)}°`;
}
