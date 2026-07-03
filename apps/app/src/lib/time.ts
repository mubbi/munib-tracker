/** Parses an "HH:mm" string into hour/minute, with a safe fallback. */
export function parseHhMm(
  value: string | undefined,
  fallback: { hour: number; minute: number } = { hour: 8, minute: 0 },
): { hour: number; minute: number } {
  const [h, m] = (value ?? "").split(":").map((part) => Number.parseInt(part, 10));
  return {
    hour: Number.isFinite(h) ? (h as number) : fallback.hour,
    minute: Number.isFinite(m) ? (m as number) : fallback.minute,
  };
}

/** Formats hour/minute as a zero-padded "HH:mm" string. */
export function formatHhMm(hour: number, minute: number): string {
  return `${`${hour}`.padStart(2, "0")}:${`${minute}`.padStart(2, "0")}`;
}
