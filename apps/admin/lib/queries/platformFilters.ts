import { pushTokensTable, usersTable } from "@munib-tracker/db/schema";
import { type AnyColumn, and, eq, exists, or, type SQL } from "drizzle-orm";
import { getDb } from "../db";
import type { ClientPlatform } from "../filter-options";

/** Users with a push token on the given client platform (ios/android/web). */
export function userHasPlatform(userIdColumn: AnyColumn, platform: ClientPlatform): SQL {
  const db = getDb();
  return exists(
    db
      .select({ id: pushTokensTable.id })
      .from(pushTokensTable)
      .where(
        and(eq(pushTokensTable.userId, userIdColumn), eq(pushTokensTable.clientPlatform, platform)),
      ),
  );
}

/** Platform match against the outer users row (broadcast audience filters). */
export function activeUserHasPlatform(platform: ClientPlatform): SQL {
  return userHasPlatform(usersTable.id, platform);
}

/** Device-scoped platform match via push_tokens.deviceId. */
export function deviceHasPlatform(deviceIdColumn: AnyColumn, platform: ClientPlatform): SQL {
  const db = getDb();
  return exists(
    db
      .select({ id: pushTokensTable.id })
      .from(pushTokensTable)
      .where(
        and(
          eq(pushTokensTable.deviceId, deviceIdColumn),
          eq(pushTokensTable.clientPlatform, platform),
        ),
      ),
  );
}

export function userHasAnyPlatform(
  userIdColumn: AnyColumn,
  platforms: ClientPlatform[],
): SQL | undefined {
  if (platforms.length === 0) return undefined;
  if (platforms.length === 1) return userHasPlatform(userIdColumn, platforms[0]);
  return or(...platforms.map((p) => userHasPlatform(userIdColumn, p))) as SQL;
}
