import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client, Receiver } from "@upstash/qstash";
import type { EnvironmentVariables } from "../config/env.schema";

@Injectable()
export class LiveActivityQStashService {
  private readonly client: Client | null;
  private readonly receiver: Receiver | null;

  constructor(private readonly config: ConfigService<EnvironmentVariables, true>) {
    const token = config.get("QSTASH_TOKEN", { infer: true });
    const currentSigningKey = config.get("QSTASH_CURRENT_SIGNING_KEY", { infer: true });
    const nextSigningKey = config.get("QSTASH_NEXT_SIGNING_KEY", { infer: true });
    this.client = token ? new Client({ token }) : null;
    this.receiver =
      currentSigningKey && nextSigningKey
        ? new Receiver({ currentSigningKey, nextSigningKey })
        : null;
  }

  isConfigured(): boolean {
    return this.client != null && this.receiver != null && this.callbackUrl() != null;
  }

  async schedule(jobId: string, executeAt: Date): Promise<string | null> {
    if (!this.client) return null;
    const url = this.callbackUrl();
    if (!url) return null;
    const result = await this.client.publishJSON({
      url,
      body: { jobId },
      notBefore: Math.floor(executeAt.getTime() / 1000),
      retries: 5,
      timeout: 20,
      deduplicationId: `live-activity-${jobId}`,
      label: "live-activity",
    });
    return result.messageId;
  }

  async cancel(messageIds: string[]): Promise<void> {
    if (!this.client || messageIds.length === 0) return;
    try {
      await this.client.messages.cancel(messageIds);
    } catch {
      // A delivered/in-flight message cannot be cancelled; the DB status check
      // in the callback remains the authoritative idempotency guard.
    }
  }

  async verify(signature: string | undefined, rawBody: Buffer | undefined): Promise<boolean> {
    if (!this.receiver || !signature || !rawBody) return false;
    try {
      return await this.receiver.verify({
        signature,
        body: rawBody.toString("utf8"),
        url: this.callbackUrl() ?? undefined,
      });
    } catch {
      return false;
    }
  }

  private callbackUrl(): string | null {
    const origin = this.config.get("API_PUBLIC_URL", { infer: true })?.replace(/\/+$/, "");
    return origin ? `${origin}/api/v1/live-activities/internal/deliver` : null;
  }
}
