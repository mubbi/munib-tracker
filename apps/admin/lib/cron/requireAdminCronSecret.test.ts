import { afterEach, describe, expect, it, vi } from "vitest";
import { requireAdminCronSecret } from "./requireAdminCronSecret";

describe("requireAdminCronSecret", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 503 when ADMIN_CRON_SECRET is unset", async () => {
    vi.stubEnv("ADMIN_CRON_SECRET", "");
    const response = requireAdminCronSecret(new Request("http://localhost/api/cron/test"));
    expect(response?.status).toBe(503);
    expect(await response?.json()).toEqual({ error: "Cron not configured" });
  });

  it("returns 401 when bearer token is missing or wrong", async () => {
    vi.stubEnv("ADMIN_CRON_SECRET", "test-secret");
    const missing = requireAdminCronSecret(new Request("http://localhost/api/cron/test"));
    expect(missing?.status).toBe(401);
    expect(await missing?.json()).toEqual({ error: "Unauthorized" });

    const wrong = requireAdminCronSecret(
      new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Bearer wrong" },
      }),
    );
    expect(wrong?.status).toBe(401);
  });

  it("returns null when bearer token matches", () => {
    vi.stubEnv("ADMIN_CRON_SECRET", "test-secret");
    const result = requireAdminCronSecret(
      new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Bearer test-secret" },
      }),
    );
    expect(result).toBeNull();
  });

  it("trims whitespace from configured secret", () => {
    vi.stubEnv("ADMIN_CRON_SECRET", "  test-secret  ");
    const result = requireAdminCronSecret(
      new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Bearer test-secret" },
      }),
    );
    expect(result).toBeNull();
  });
});
