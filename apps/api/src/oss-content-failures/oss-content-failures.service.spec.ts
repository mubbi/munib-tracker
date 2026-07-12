import { HttpStatus } from "@nestjs/common";
import { beforeEach, describe, expect, it } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { resetOssContentFailureRateLimits } from "./oss-content-failure-rate-limit";
import { OssContentFailuresService } from "./oss-content-failures.service";

const samplePayload = {
  contentKind: "quran_edition" as const,
  contentKey: "quran_edition:en-saheehintl:2",
  sourceProvider: "fawazahmed0/quran-api",
  sourceUrl: "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-saheehintl/2.json",
  contentMeta: {
    contentId: "en-saheehintl",
    sourceSlug: "eng-saheehintl",
    surah: 2,
    decisionId: "D2",
  },
  errorCode: "http_error" as const,
  errorMessage:
    "HTTP 404 for https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-saheehintl/2.json",
  httpStatus: 404,
  appVersion: "1.0.0",
  platform: "ios" as const,
  locale: "en",
  translationLocale: "en",
};

describe("OssContentFailuresService", () => {
  let authService: AuthService;
  let service: OssContentFailuresService;

  beforeEach(async () => {
    resetOssContentFailureRateLimits();
    const module = await createAuthTestingModule([OssContentFailuresService]);
    authService = module.get(AuthService);
    service = module.get(OssContentFailuresService);
  });

  it("accepts failure reports from guest sessions", async () => {
    const guest = await authService.createGuestSession({});

    await expect(service.report(guest.accessToken, samplePayload)).resolves.toBeUndefined();
  });

  it("accepts failure reports from linked OAuth users", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });

    await expect(service.report(session.accessToken, samplePayload)).resolves.toBeUndefined();
  });

  it("rate-limits repeated reports from the same user", async () => {
    const guest = await authService.createGuestSession({});

    for (let i = 0; i < 30; i += 1) {
      await service.report(guest.accessToken, {
        ...samplePayload,
        contentKey: `quran_edition:en-saheehintl:${i}`,
      });
    }

    await expect(service.report(guest.accessToken, samplePayload)).rejects.toMatchObject({
      status: HttpStatus.TOO_MANY_REQUESTS,
    });
  });
});
