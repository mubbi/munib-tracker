import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildConfigService,
  QSTASH_TEST_ENV,
  qstashSdk,
  qstashSdkModule,
  type TestEnv,
} from "../test-support/push";
import { SurfacePushQStashService } from "./surface-push-qstash.service";

vi.mock("@upstash/qstash", () => qstashSdkModule());

const CALLBACK_URL = "https://api.example.com/api/v1/surface-push/internal/deliver";
const BODY = Buffer.from('{"jobId":"job-1"}');

function setup(env: TestEnv = QSTASH_TEST_ENV) {
  return new SurfacePushQStashService(buildConfigService(env));
}

describe("SurfacePushQStashService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("isConfigured", () => {
    it.each<[string, TestEnv, boolean]>([
      ["all QStash settings", QSTASH_TEST_ENV, true],
      ["no API origin", { ...QSTASH_TEST_ENV, API_PUBLIC_URL: undefined }, false],
      ["no next signing key", { ...QSTASH_TEST_ENV, QSTASH_NEXT_SIGNING_KEY: undefined }, false],
      ["no token", { ...QSTASH_TEST_ENV, QSTASH_TOKEN: undefined }, false],
    ])("with %s returns %s", (_label, env, expected) => {
      expect(setup(env).isConfigured()).toBe(expected);
    });

    it("does not build SDK clients without credentials", () => {
      setup({});
      expect(qstashSdk.clientOptions).not.toHaveBeenCalled();
      expect(qstashSdk.receiverOptions).not.toHaveBeenCalled();
    });
  });

  describe("schedule", () => {
    it.each<[string, TestEnv]>([
      ["no token", {}],
      ["no API origin", { QSTASH_TOKEN: "qstash-token" }],
    ])("returns null with %s", async (_label, env) => {
      await expect(setup(env).schedule("job-1", new Date())).resolves.toBeNull();
      expect(qstashSdk.publishJSON).not.toHaveBeenCalled();
    });

    it("publishes a delayed, deduplicated callback to the trimmed API origin", async () => {
      qstashSdk.publishJSON.mockResolvedValue({ messageId: "msg-42" });
      const executeAt = new Date("2030-01-01T00:00:10.900Z");

      await expect(setup().schedule("job-1", executeAt)).resolves.toBe("msg-42");
      expect(qstashSdk.publishJSON).toHaveBeenCalledWith(
        expect.objectContaining({
          url: CALLBACK_URL,
          body: { jobId: "job-1" },
          notBefore: Math.floor(executeAt.getTime() / 1000),
          retries: 5,
          timeout: 20,
          deduplicationId: "surface-push-job-1",
          label: "surface-push",
        }),
      );
    });
  });

  describe("cancel", () => {
    it.each<[string, TestEnv, string[]]>([
      ["no client", {}, ["msg-1"]],
      ["no message ids", QSTASH_TEST_ENV, []],
    ])("is a no-op with %s", async (_label, env, ids) => {
      await setup(env).cancel(ids);
      expect(qstashSdk.cancelMessages).not.toHaveBeenCalled();
    });

    it("cancels the given message ids", async () => {
      await setup().cancel(["a", "b"]);
      expect(qstashSdk.cancelMessages).toHaveBeenCalledWith(["a", "b"]);
    });

    it("swallows failures for messages that already ran", async () => {
      qstashSdk.cancelMessages.mockRejectedValue(new Error("already delivered"));
      await expect(setup().cancel(["a"])).resolves.toBeUndefined();
    });
  });

  describe("verify", () => {
    it.each<[string, TestEnv, string | undefined, Buffer | undefined]>([
      ["no receiver", {}, "sig", BODY],
      ["no signature", QSTASH_TEST_ENV, undefined, BODY],
      ["no raw body", QSTASH_TEST_ENV, "sig", undefined],
    ])("rejects with %s", async (_label, env, signature, body) => {
      await expect(setup(env).verify(signature, body)).resolves.toBe(false);
      expect(qstashSdk.verify).not.toHaveBeenCalled();
    });

    it("verifies the signature against the raw body and callback URL", async () => {
      qstashSdk.verify.mockResolvedValue(true);
      await expect(setup().verify("sig", BODY)).resolves.toBe(true);
      expect(qstashSdk.verify).toHaveBeenCalledWith({
        signature: "sig",
        body: '{"jobId":"job-1"}',
        url: CALLBACK_URL,
      });
    });

    it("omits the url when no API origin is configured", async () => {
      qstashSdk.verify.mockResolvedValue(true);
      await setup({ ...QSTASH_TEST_ENV, API_PUBLIC_URL: undefined }).verify("sig", BODY);
      expect(qstashSdk.verify).toHaveBeenCalledWith(expect.objectContaining({ url: undefined }));
    });

    it("treats SDK verification errors as an invalid signature", async () => {
      qstashSdk.verify.mockRejectedValue(new Error("bad signature"));
      await expect(setup().verify("sig", BODY)).resolves.toBe(false);
    });
  });
});
