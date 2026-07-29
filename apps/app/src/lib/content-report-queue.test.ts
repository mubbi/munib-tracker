import type { CreateContentReportPayload } from "@munib-tracker/shared/types/content-report";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import {
  clearContentReportQueueForTests,
  enqueueContentReport,
  flushContentReportQueue,
  readContentReportQueueForTests,
} from "@/lib/content-report-queue";

const payload: CreateContentReportPayload = {
  issueType: "typo",
  description: "There is a spelling mistake in this dua translation text.",
  content: {
    kind: "dua",
    contentId: "daily-before-eating",
    route: "/dua/detail/daily-before-eating",
    locale: "en",
  },
};

jest.mock("@/lib/content-report-api", () => {
  const actual = jest.requireActual<typeof import("@/lib/content-report-api")>(
    "@/lib/content-report-api",
  );
  return {
    ...actual,
    submitContentReport: jest.fn(),
  };
});

const { submitContentReport, isOfflineReportError } = jest.requireMock(
  "@/lib/content-report-api",
) as {
  submitContentReport: jest.Mock;
  isOfflineReportError: typeof import("@/lib/content-report-api").isOfflineReportError;
};

describe("content-report-queue", () => {
  beforeEach(async () => {
    await clearContentReportQueueForTests();
    submitContentReport.mockReset();
  });

  it("enqueues and reads back a report payload", async () => {
    await enqueueContentReport(payload, []);

    const queue = await readContentReportQueueForTests();
    expect(queue).toHaveLength(1);
    expect(queue[0]?.payload.description).toBe(payload.description);
    expect(queue[0]?.payload.content.contentId).toBe("daily-before-eating");
  });

  it("persists queue in AsyncStorage", async () => {
    await enqueueContentReport(
      {
        issueType: "other",
        description: "Another valid report description here.",
        content: {
          kind: "screen",
          contentId: "/settings",
          route: "/settings",
          locale: "en",
        },
      },
      [],
    );

    const raw = await AsyncStorage.getItem(DB_KEYS.contentReportQueue);
    expect(raw).toContain("Another valid report description");
  });

  it("clears legacy v1 queue that may contain 5xx-poisoned payloads", async () => {
    await AsyncStorage.setItem(
      DB_KEYS.contentReportQueue,
      JSON.stringify([
        {
          id: "queued-old",
          createdAt: new Date().toISOString(),
          payload,
          attachments: [],
        },
      ]),
    );

    const queue = await readContentReportQueueForTests();
    expect(queue).toHaveLength(0);
  });

  it("keeps items when flush hits an offline error", async () => {
    await enqueueContentReport(payload, []);
    submitContentReport.mockRejectedValue(new TypeError("Failed to fetch"));

    const sent = await flushContentReportQueue("token");
    expect(sent).toBe(0);
    expect(await readContentReportQueueForTests()).toHaveLength(1);
  });

  it("drops items on permanent HTTP failures so they are not retried", async () => {
    const { ApiError } = jest.requireActual<typeof import("@munib-tracker/api-client")>(
      "@munib-tracker/api-client",
    );
    await enqueueContentReport(payload, []);
    submitContentReport.mockRejectedValue(new ApiError("Internal server error", 500, {}));

    const sent = await flushContentReportQueue("token");
    expect(sent).toBe(0);
    expect(await readContentReportQueueForTests()).toHaveLength(0);
  });
});

describe("isOfflineReportError", () => {
  it("treats network TypeError as offline", () => {
    expect(isOfflineReportError(new TypeError("Failed to fetch"))).toBe(true);
  });

  it("does not treat HTTP 500 as offline", () => {
    const { ApiError } = jest.requireActual<typeof import("@munib-tracker/api-client")>(
      "@munib-tracker/api-client",
    );
    expect(isOfflineReportError(new ApiError("Internal server error", 500, {}))).toBe(false);
  });
});
