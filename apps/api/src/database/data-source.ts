import "reflect-metadata";
import { DataSource } from "typeorm";
import { AuthSessionEntity, SyncRecordEntity, UserEntity } from "./entities";

/**
 * Standalone DataSource for the TypeORM CLI (migration generate/run/revert).
 *
 * Production runs with `synchronize: false` (see `database.module.ts`), so schema
 * changes are applied through committed migrations rather than auto-sync. Load
 * your `.env` before invoking, e.g. `pnpm --filter api migration:run`.
 */
const port = Number(process.env.DATABASE_PORT ?? 5432);

export default new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST ?? "localhost",
  port: Number.isFinite(port) ? port : 5432,
  username: process.env.DATABASE_USER ?? "postgres",
  password: process.env.DATABASE_PASSWORD ?? "postgres",
  database: process.env.DATABASE_NAME ?? "munib_tracker",
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  entities: [UserEntity, AuthSessionEntity, SyncRecordEntity],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
});
