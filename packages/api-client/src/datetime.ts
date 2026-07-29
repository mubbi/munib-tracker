import { format, isValid, parseISO } from "date-fns";

/**
 * Serializes a Date as a UTC ISO-8601 string. Timestamps must be timezone-safe
 * so they compare correctly on the server and match the sync engine's
 * `Date.prototype.toISOString()` format (both are UTC "Z" instants).
 */
export function toApiDateTime(date: Date): string {
  return date.toISOString();
}

export function fromApiDateTime(value: string): Date {
  const parsed = parseISO(value);

  if (!isValid(parsed)) {
    throw new Error(`Invalid API datetime: ${value}`);
  }

  return parsed;
}

export function formatApiDateTime(value: string, pattern = "PPpp"): string {
  return format(fromApiDateTime(value), pattern);
}
