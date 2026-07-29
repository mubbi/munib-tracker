import {
  ApnsLiveActivityClient,
  type ApnsLiveActivityResult,
  LiveActivityDeliveryError,
} from "@munib-tracker/live-activity-delivery";
import { Injectable, OnModuleDestroy, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { EnvironmentVariables } from "../config/env.schema";

/**
 * Nest wrapper around the shared APNs client so ConfigService credentials
 * stay in the API layer while delivery logic lives in the package.
 */
@Injectable()
export class ApnsLiveActivityService implements OnModuleDestroy {
  private readonly client: ApnsLiveActivityClient;

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    this.client = ApnsLiveActivityClient.fromEnv({
      APNS_TEAM_ID: config.get("APNS_TEAM_ID", { infer: true }),
      APNS_KEY_ID: config.get("APNS_KEY_ID", { infer: true }),
      APNS_PRIVATE_KEY: config.get("APNS_PRIVATE_KEY", { infer: true }),
      APNS_BUNDLE_ID: config.get("APNS_BUNDLE_ID", { infer: true }),
    });
  }

  onModuleDestroy(): void {
    this.client.close();
  }

  isConfigured(): boolean {
    return this.client.isConfigured();
  }

  getClient(): ApnsLiveActivityClient {
    return this.client;
  }

  async sendUpdate(input: {
    token: string;
    environment: "sandbox" | "production";
    contentState: Record<string, unknown>;
    staleAt?: Date | null;
    expiresAt: Date;
  }): Promise<ApnsLiveActivityResult> {
    try {
      return await this.client.sendUpdate(input);
    } catch (error: unknown) {
      if (error instanceof LiveActivityDeliveryError && error.code === "NOT_CONFIGURED") {
        throw new ServiceUnavailableException(error.message);
      }
      throw error;
    }
  }
}
