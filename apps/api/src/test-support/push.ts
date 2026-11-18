import type { RawBodyRequest } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import { type Mock, vi } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { buildRequest } from "./http";

export type TestEnv = Partial<Record<keyof EnvironmentVariables, string>>;
type TypedConfigService = ConfigService<EnvironmentVariables, true>;

/** QStash credentials + a trailing-slash API origin (the services trim it). */
export const QSTASH_TEST_ENV: TestEnv = {
  QSTASH_TOKEN: "qstash-token",
  QSTASH_CURRENT_SIGNING_KEY: "current-key",
  QSTASH_NEXT_SIGNING_KEY: "next-key",
  API_PUBLIC_URL: "https://api.example.com//",
};

/** ConfigService double that reads `env` on every call (mutations are visible). */
export function buildConfigService(env: TestEnv = {}): TypedConfigService {
  return {
    get: vi.fn((key: keyof EnvironmentVariables) => env[key]),
  } as unknown as TypedConfigService;
}

/**
 * Overrides selected keys on a real (module-provided) ConfigService; every
 * other key still reads the validated test environment.
 */
export function overrideConfig(config: ConfigService, values: TestEnv): void {
  if (vi.isMockFunction(config.get)) vi.mocked(config.get).mockRestore();
  const read = config.get.bind(config) as (key: string, options?: unknown) => unknown;
  vi.spyOn(config, "get").mockImplementation(((key: string, options?: unknown) =>
    key in values ? values[key as keyof TestEnv] : read(key, options)) as never);
}

/** Spies behind the mocked `@upstash/qstash` SDK (see {@link qstashSdkModule}). */
export const qstashSdk = {
  publishJSON: vi.fn(),
  cancelMessages: vi.fn(),
  verify: vi.fn(),
  clientOptions: vi.fn(),
  receiverOptions: vi.fn(),
};

/**
 * Module factory for `vi.mock("@upstash/qstash", () => qstashSdkModule())`.
 */
export function qstashSdkModule() {
  return {
    Client: class {
      readonly messages = { cancel: qstashSdk.cancelMessages };
      readonly publishJSON = qstashSdk.publishJSON;
      constructor(options: unknown) {
        qstashSdk.clientOptions(options);
      }
    },
    Receiver: class {
      readonly verify = qstashSdk.verify;
      constructor(options: unknown) {
        qstashSdk.receiverOptions(options);
      }
    },
  };
}

export type MockQStashService = { schedule: Mock; cancel: Mock; verify: Mock };

/** Double for SurfacePushQStashService / LiveActivityQStashService. */
export function buildMockQStashService(): MockQStashService {
  return {
    schedule: vi.fn().mockResolvedValue("msg-1"),
    cancel: vi.fn().mockResolvedValue(undefined),
    verify: vi.fn().mockResolvedValue(true),
  };
}

/** A QStash callback request carrying the raw JSON body used for signature checks. */
export function buildQStashRequest(body: unknown): RawBodyRequest<Request> {
  return Object.assign(buildRequest(), { rawBody: Buffer.from(JSON.stringify(body)) });
}
