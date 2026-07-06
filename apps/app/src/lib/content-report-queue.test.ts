import type { CreateContentReportPayload } from "@munib-tracker/shared/types/content-report";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import {
  clearContentReportQueueForTests,
  enqueueContentReport,
  readContentReportQueueForTests,
} from "@/lib/content-report-queue";

describe("content-report-queue", () => {
  beforeEach(async () => {
    await clearContentReportQueueForTests();
  });

  it("enqueues and reads back a report payload", async () => {
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
});
