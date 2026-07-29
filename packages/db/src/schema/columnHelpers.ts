import { timestamp } from "drizzle-orm/pg-core";

/** App-side default so inserts work without relying on SQL `now()`. */
export function timestampNow(name: string) {
  return timestamp(name, { mode: "date" })
    .notNull()
    .$defaultFn(() => new Date());
}

export function timestampNowOptional(name: string) {
  return timestamp(name, { mode: "date" }).$defaultFn(() => new Date());
}
