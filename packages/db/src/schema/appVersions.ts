import { pgTable, text } from "drizzle-orm/pg-core";
import { timestampNow } from "./columnHelpers";

/** Mirrors TypeORM `AppVersionEntity` — camelCase columns. */
export const appVersionsTable = pgTable("app_versions", {
  platform: text("platform").primaryKey().$type<"web" | "android" | "ios">(),
  latestVersion: text("latestVersion").notNull(),
  minSoftVersion: text("minSoftVersion").notNull(),
  minHardVersion: text("minHardVersion").notNull(),
  message: text("message"),
  storeUrl: text("storeUrl"),
  updatedAt: timestampNow("updatedAt"),
});

export type AppVersion = typeof appVersionsTable.$inferSelect;
export type InsertAppVersion = typeof appVersionsTable.$inferInsert;
