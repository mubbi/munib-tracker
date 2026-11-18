import { cronRunsTable } from "@munib-tracker/db";
import { getDb } from "@/lib/db";

export type CronRunStatus = "ok" | "error";

export type CronRunRecord = {
  bucketId: string;
  status: CronRunStatus;
  jobIds: string[];
  durationMs: number;
  errorMessage: string | null;
  startedAt: Date;
  finishedAt: Date;
};

export type CronRunWriter = (record: CronRunRecord) => Promise<void>;

const MAX_ERROR_LENGTH = 2000;

async function insertCronRun(record: CronRunRecord): Promise<void> {
  await getDb().insert(cronRunsTable).values(record);
}

/**
 * Runs `task` and writes one `cron_runs` row (status `ok` | `error`) for the admin
 * Notifications overview. A failed log write is reported but never fails the cron;
 * a failed task is logged and then rethrown.
 */
export async function recordCronRun<T>(
  bucketId: string,
  jobIds: readonly string[],
  task: () => Promise<T>,
  write: CronRunWriter = insertCronRun,
): Promise<T> {
  const startedAt = new Date();
  const finish = async (status: CronRunStatus, errorMessage: string | null) => {
    const finishedAt = new Date();
    try {
      await write({
        bucketId,
        status,
        jobIds: [...jobIds],
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        errorMessage: errorMessage?.slice(0, MAX_ERROR_LENGTH) ?? null,
        startedAt,
        finishedAt,
      });
    } catch (logError) {
      console.error(`[cron:${bucketId}] failed to record cron run`, logError);
    }
  };

  try {
    const result = await task();
    await finish("ok", null);
    return result;
  } catch (error) {
    await finish("error", error instanceof Error ? error.message : String(error));
    throw error;
  }
}
