import { getMetadataArgsStorage } from "typeorm";
import { afterEach, describe, expect, it, vi } from "vitest";

type EntitiesModule = typeof import("./index");

async function loadEntities(env: { DATABASE_TYPE: string; NODE_ENV: string }) {
  vi.stubEnv("DATABASE_TYPE", env.DATABASE_TYPE);
  vi.stubEnv("NODE_ENV", env.NODE_ENV);
  vi.resetModules();
  return (await import("./index.js")) as EntitiesModule;
}

function columnType(target: unknown, property: string): unknown {
  const columns = getMetadataArgsStorage().columns.filter(
    (c) => c.target === target && c.propertyName === property,
  );
  return columns.at(-1)?.options.type;
}

describe("entity column types per driver", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses Postgres timestamp/jsonb outside sqlite and tests", async () => {
    const { UserMediaEntity, InAppNotificationEntity } = await loadEntities({
      DATABASE_TYPE: "postgres",
      NODE_ENV: "production",
    });
    expect(columnType(UserMediaEntity, "createdAt")).toBe("timestamp");
    expect(columnType(InAppNotificationEntity, "routeData")).toBe("jsonb");
  });

  it("uses sqlite datetime/simple-json under NODE_ENV=test even with a Postgres driver", async () => {
    const { UserMediaEntity, InAppNotificationEntity } = await loadEntities({
      DATABASE_TYPE: "postgres",
      NODE_ENV: "test",
    });
    expect(columnType(UserMediaEntity, "createdAt")).toBe("datetime");
    expect(columnType(InAppNotificationEntity, "routeData")).toBe("simple-json");
  });
});
