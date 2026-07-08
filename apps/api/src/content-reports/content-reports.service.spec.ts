import { beforeEach, describe, expect, it } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { resetContentReportRateLimits } from "./content-report-rate-limit";
import { ContentReportsService } from "./content-reports.service";

const samplePayload = {
  issueType: "incorrect_translation" as const,
  description: "The English translation does not match the Arabic meaning here.",
  suggestedCorrection: "Corrected translation text.",
  userReference: "Tafsir Ibn Kathir",
  content: {
    kind: "dua" as const,
    contentId: "daily-before-eating",
    route: "/dua/detail/daily-before-eating",
    locale: "en",
    snapshot: {
      title: "Before eating",
      arabic: "بِسْمِ اللَّهِ",
      translation: "In the name of Allah",
    },
  },
  appVersion: "1.0.0",
  platform: "ios",
};

describe("ContentReportsService", () => {
  let authService: AuthService;
  let contentReportsService: ContentReportsService;

  beforeEach(async () => {
    resetContentReportRateLimits();
    const module = await createAuthTestingModule([ContentReportsService]);
    authService = module.get(AuthService);
    contentReportsService = module.get(ContentReportsService);
  });

  it("blocks guest accounts from submitting reports", async () => {
    const guest = await authService.createGuestSession({});

    await expect(contentReportsService.create(guest.accessToken, samplePayload)).rejects.toThrow(
      "Content reporting requires a linked account",
    );
  });

  it("creates a report for linked OAuth users", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });

    const report = await contentReportsService.create(session.accessToken, samplePayload);

    expect(report.id).toBeTruthy();
    expect(report.status).toBe("pending");
    expect(report.issueType).toBe("incorrect_translation");
    expect(report.content.contentId).toBe("daily-before-eating");
    expect(report.attachmentCount).toBe(0);
  });

  it("lists only the caller's reports", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    await contentReportsService.create(session.accessToken, samplePayload);

    const list = await contentReportsService.list(session.accessToken);

    expect(list.total).toBe(1);
    expect(list.items[0]?.description).toBe(samplePayload.description);
  });

  it("rejects invalid attachment mime types", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });

    await expect(
      contentReportsService.create(session.accessToken, samplePayload, [
        {
          buffer: Buffer.from("test"),
          mimetype: "application/pdf",
          originalname: "proof.pdf",
          size: 4,
        },
      ]),
    ).rejects.toThrow("Unsupported attachment type");
  });

  it("allows admin status updates with a valid admin key", async () => {
    process.env.REPORT_ADMIN_KEY = "test-admin-key";
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    const report = await contentReportsService.create(session.accessToken, samplePayload);

    const updated = await contentReportsService.adminUpdate("test-admin-key", report.id, {
      status: "completed",
      adminNotes: "Fixed in content pipeline.",
    });

    expect(updated.status).toBe("completed");
    expect(updated.adminNotes).toBe("Fixed in content pipeline.");
    expect(updated.resolvedAt).toBeTruthy();
    delete process.env.REPORT_ADMIN_KEY;
  });

  it("rejects admin updates with a wrong or missing admin key", async () => {
    process.env.REPORT_ADMIN_KEY = "test-admin-key";
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    const report = await contentReportsService.create(session.accessToken, samplePayload);

    await expect(
      contentReportsService.adminUpdate("wrong-key", report.id, { status: "completed" }),
    ).rejects.toThrow("Invalid admin key");

    // A near-miss of a different length must also be rejected (guards the
    // constant-time comparison against length-mismatch throws).
    await expect(
      contentReportsService.adminUpdate("test-admin-key-longer", report.id, { status: "spam" }),
    ).rejects.toThrow("Invalid admin key");

    await expect(
      contentReportsService.adminUpdate(undefined, report.id, { status: "completed" }),
    ).rejects.toThrow("Invalid admin key");

    delete process.env.REPORT_ADMIN_KEY;
  });
});
