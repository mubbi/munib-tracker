import { describe, expect, it, vi } from "vitest";
import { getDb } from "@/lib/db";
import { type CronRunRecord, recordCronRun } from "./recordCronRun";

vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));

describe("recordCronRun", () => {
  it("records an ok run and returns the task result", async () => {
    const writes: CronRunRecord[] = [];
    const result = await recordCronRun(
      "bucket",
      ["job-a"],
      async () => 42,
      async (r) => {
        writes.push(r);
      },
    );

    expect(result).toBe(42);
    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatchObject({
      bucketId: "bucket",
      status: "ok",
      jobIds: ["job-a"],
      errorMessage: null,
    });
    expect(writes[0].durationMs).toBeGreaterThanOrEqual(0);
    expect(writes[0].finishedAt.getTime()).toBeGreaterThanOrEqual(writes[0].startedAt.getTime());
  });

  it("records an error run and rethrows", async () => {
    const writes: CronRunRecord[] = [];
    await expect(
      recordCronRun(
        "bucket",
        ["job-a"],
        async () => {
          throw new Error("boom");
        },
        async (r) => {
          writes.push(r);
        },
      ),
    ).rejects.toThrow("boom");

    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatchObject({ status: "error", errorMessage: "boom" });
  });

  it("does not fail the cron when the log write fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await recordCronRun(
      "bucket",
      [],
      async () => "done",
      async () => {
        throw new Error("db down");
      },
    );

    expect(result).toBe("done");
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("writes through the default Drizzle writer when none is given", async () => {
    const values = vi.fn().mockResolvedValue(undefined);
    vi.mocked(getDb).mockReturnValue({ insert: vi.fn(() => ({ values })) } as never);
    await expect(recordCronRun("bucket", [], async () => "done")).resolves.toBe("done");
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({ bucketId: "bucket", status: "ok" }),
    );
  });
});
