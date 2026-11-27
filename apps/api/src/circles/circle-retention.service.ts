import { Injectable, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { purgeExpiredCircleData } from "./circle-lifecycle";

/** A tick runs the sweep at most this often per process. */
export const CIRCLE_RETENTION_INTERVAL_MS = 60 * 60_000;

/**
 * Circles retention sweep (`purgeExpiredCircleData`, docs/CIRCLES.md › Deletion
 * & retention): departed members' signals after 30 days, old signals / nudges /
 * invites / tombstones, and D34 child profiles whose consent was not
 * re-confirmed within 30 days.
 *
 * Driven by the existing surface-push cron (`POST /surface-push/internal/
 * dispatch-due`, every 1–5 min — even when that run's push dispatch fails) so
 * retention never depends on circle traffic and never runs inside a user's
 * request. Throttled per process; the sweep is idempotent (deletes by cut-off
 * only), so running it twice — or on several instances at once — is harmless.
 */
@Injectable()
export class CircleRetentionService {
  private readonly logger = new Logger(CircleRetentionService.name);
  private lastRunAt = 0;
  private running: Promise<void> | null = null;

  constructor(private readonly dataSource: DataSource) {}

  /** Throttled entry point for the cron. Never throws. */
  async maybeRun(now: Date = new Date()): Promise<void> {
    if (this.running || now.getTime() - this.lastRunAt < CIRCLE_RETENTION_INTERVAL_MS) return;
    this.lastRunAt = now.getTime();
    this.running = this.run(now);
    try {
      await this.running;
    } catch (error) {
      // Logged by class only; retried on the next interval.
      this.logger.warn(
        `circle retention sweep failed: ${error instanceof Error ? error.name : "error"}`,
      );
    } finally {
      this.running = null;
    }
  }

  /** One sweep in its own transaction (unthrottled; used by tests). */
  run(now: Date = new Date()): Promise<void> {
    return this.dataSource.transaction((manager) => purgeExpiredCircleData(manager, now));
  }
}
