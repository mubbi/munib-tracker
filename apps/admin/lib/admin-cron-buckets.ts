/**
 * HTTP cron buckets for external schedulers (e.g. cron-job.org).
 * Admin jobs are separate from API notification crons in apps/api/src/cron/buckets.ts.
 */

export type AdminCronHttpBucket = {
  /** URL segment: GET|POST /api/cron/:bucketId */
  id: string;
  description: string;
  /** Recommended UTC schedule for cron-job.org (5-field cron). */
  scheduleUtc: string;
  jobIds: readonly string[];
};

export const ADMIN_CRON_HTTP_BUCKETS: readonly AdminCronHttpBucket[] = [
  {
    id: "process-broadcasts",
    description: "Scheduled broadcasts + stuck immediate sends (batched delivery)",
    scheduleUtc: "*/15 * * * *",
    jobIds: ["process-broadcasts"],
  },
] as const;

const bucketsById = new Map<string, AdminCronHttpBucket>(
  ADMIN_CRON_HTTP_BUCKETS.map((b) => [b.id, b]),
);

export function getAdminCronHttpBucket(bucketId: string): AdminCronHttpBucket | undefined {
  return bucketsById.get(bucketId);
}
