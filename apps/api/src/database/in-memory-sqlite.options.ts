import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AuthSessionEntity, SyncRecordEntity, UserEntity } from "./entities";

const testEntities = [UserEntity, AuthSessionEntity, SyncRecordEntity];

/** Shared in-memory SQLite options for unit, e2e, and OpenAPI export runs. */
export function createInMemorySqliteOptions(
  entities: TypeOrmModuleOptions["entities"] = testEntities,
): TypeOrmModuleOptions {
  return {
    type: "better-sqlite3",
    database: ":memory:",
    entities,
    synchronize: true,
  };
}
