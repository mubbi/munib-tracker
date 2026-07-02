import { format, formatISO, isValid, parseISO } from "date-fns";

export function toApiDateTime(date: Date): string {
  return formatISO(date);
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
