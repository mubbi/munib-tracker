import { describe, expect, it } from "vitest";
import { ADMIN_CRON_HTTP_BUCKETS, getAdminCronHttpBucket } from "./admin-cron-buckets";

describe("ADMIN_CRON_HTTP_BUCKETS", () => {
  it("defines process-broadcasts bucket", () => {
    expect(ADMIN_CRON_HTTP_BUCKETS).toHaveLength(1);
    expect(ADMIN_CRON_HTTP_BUCKETS[0]).toMatchObject({
      id: "process-broadcasts",
      scheduleUtc: "*/15 * * * *",
      jobIds: ["process-broadcasts"],
    });
  });
});

describe("getAdminCronHttpBucket", () => {
  it("returns bucket by id", () => {
    const bucket = getAdminCronHttpBucket("process-broadcasts");
    expect(bucket?.description).toContain("broadcasts");
  });

  it("returns undefined for unknown id", () => {
    expect(getAdminCronHttpBucket("unknown")).toBeUndefined();
  });
});
