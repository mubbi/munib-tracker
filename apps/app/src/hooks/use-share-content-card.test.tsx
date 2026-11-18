import { act, render, renderHook, screen } from "@testing-library/react-native";
import type { ReactElement } from "react";

import type { ShareScheduleEntry } from "@/components/share/share-schedule-content";
import { shareViewSnapshot, waitForViewRef } from "@/lib/share/shareViewSnapshot";
import { sharePreparedWebFile } from "@/lib/share/shareViewSnapshotWeb";
import { usePlatform } from "@/test-support/platform";

import {
  appendShareBranding,
  buildAyahSharePayload,
  buildHadithSharePayload,
  formatAchievementShare,
  formatGuideShare,
  formatReadingShare,
  formatScheduleShare,
  type ShareContentBody,
  type ShareContentPayload,
  useShareContentCard,
} from "./use-share-content-card";

/** Each share body renders as a Text naming its component (function is hoisted for jest.mock). */
function mockShareBody(name: string) {
  const { Text } = require("react-native");
  return { [name]: () => <Text>{name}</Text> };
}

jest.mock("@/components/share/share-achievement-content", () =>
  mockShareBody("ShareAchievementContent"),
);
jest.mock("@/components/share/share-ayah-content", () => mockShareBody("ShareAyahContent"));
jest.mock("@/components/share/share-guide-content", () => mockShareBody("ShareGuideContent"));
jest.mock("@/components/share/share-hadith-content", () => mockShareBody("ShareHadithContent"));
jest.mock("@/components/share/share-reading-content", () => mockShareBody("ShareReadingContent"));
jest.mock("@/components/share/share-schedule-content", () => mockShareBody("ShareScheduleContent"));
jest.mock("@/components/share/share-content-snapshot", () => {
  const { forwardRef } = require("react");
  const { View } = require("react-native");
  return {
    ShareContentSnapshot: forwardRef(
      (props: { children: unknown; sectionTitle: string }, ref: unknown) => (
        <View ref={ref} testID={`snapshot:${props.sectionTitle}`}>
          {props.children}
        </View>
      ),
    ),
  };
});

jest.mock("@/hooks/use-share-snapshot-width", () => ({ useShareSnapshotWidth: () => 360 }));

jest.mock("@/lib/share/shareViewSnapshot", () => ({
  SHARE_SNAPSHOT_NATIVE_HOST_STYLE: { opacity: 0 },
  SHARE_SNAPSHOT_WEB_HOST_STYLE: { left: -12000 },
  shareViewSnapshot: jest.fn(),
  waitForViewRef: jest.fn(async () => true),
}));

jest.mock("@/lib/share/shareViewSnapshotWeb", () => ({
  sharePreparedWebFile: jest.fn(),
}));

jest.mock("@/lib/share/useShareProofQrReadyGate", () => ({
  useShareProofQrReadyGate: () => mockQrGate,
}));

const mockQrGate = {
  markQrReady: jest.fn(),
  waitForQrCodes: jest.fn(async () => undefined),
  reset: jest.fn(),
};

type SnapshotOptions = {
  filename: string;
  dialogTitle: string;
  message: string;
  beforeCapture: () => Promise<void>;
  afterCapture: () => void;
};

const shareSnapshotMock = shareViewSnapshot as jest.Mock;
const waitForViewRefMock = waitForViewRef as jest.Mock;
const sharePreparedMock = sharePreparedWebFile as jest.Mock;

const SCHEDULE_ITEMS: ShareScheduleEntry[] = [
  { id: "fajr", name: "Fajr", time: "05:00", kind: "obligatory", status: "past" },
  { id: "dhuhr", name: "Dhuhr", time: "12:30", kind: "obligatory", status: "active" },
  { id: "asr", name: "Asr", time: "16:00", kind: "obligatory", status: "upcoming" },
];

function payloadFor(content: ShareContentBody, overrides: Partial<ShareContentPayload> = {}) {
  return { message: "msg", sectionTitle: "Section", content, ...overrides };
}

/** A shareViewSnapshot that runs its capture hooks and waits until `finish` is called. */
function deferSnapshot(result: unknown = {}) {
  let finish!: () => void;
  shareSnapshotMock.mockImplementationOnce(
    (_ref: unknown, options: SnapshotOptions) =>
      new Promise((resolve, reject) => {
        finish = () => {
          options.beforeCapture().then(() => {
            options.afterCapture();
            resolve(result);
          }, reject);
        };
      }),
  );
  return { finish: () => finish() };
}

async function setup() {
  return renderHook(() => useShareContentCard());
}

beforeEach(() => {
  jest.clearAllMocks();
  shareSnapshotMock.mockResolvedValue({});
  waitForViewRefMock.mockResolvedValue(true);
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("share text formatters", () => {
  it("appends the branding footer", () => {
    const lines = appendShareBranding("Hello").split("\n");
    expect(lines[0]).toBe("Hello");
    expect(lines[1]).toBe("");
    expect(lines.at(-1)).toMatch(/^https?:\/\//);
  });

  it("formats a reading with every optional part", () => {
    const text = formatReadingShare({
      title: "Morning",
      arabic: "سبحان الله",
      transliteration: "SubhanAllah",
      translation: "Glory be to Allah",
      reference: "Muslim",
    });
    expect(
      text.startsWith("Morning\n\nسبحان الله\n\nSubhanAllah\n\nGlory be to Allah\n\n— Muslim\n"),
    ).toBe(true);
  });

  it("formats a bare reading", () => {
    expect(formatReadingShare({ arabic: "A", translation: "T" })).toBe(
      appendShareBranding("A\n\nT"),
    );
  });

  it("formats an achievement", () => {
    expect(formatAchievementShare("Streak", "7 days")).toContain("Streak");
  });

  it("formats a guide with summary and excerpt", () => {
    const text = formatGuideShare({
      title: "Wudu",
      summary: "How to",
      path: "/learn/wudu",
      bodyExcerpt: "Step one",
      readAtLabel: "Read at",
    });
    expect(text).toMatch(
      /^Wudu\n\nHow to\n\nStep one\n\nRead at\nhttps?:\/\/[^\n]+\/learn\/wudu\n/,
    );
  });

  it("formats a guide without the optional parts", () => {
    const text = formatGuideShare({ title: "Wudu", path: "/learn/wudu", readAtLabel: "Read at" });
    expect(text.startsWith("Wudu\n\nRead at\n")).toBe(true);
  });

  it("formats a schedule marking the current and next entries", () => {
    const text = formatScheduleShare({
      dateLabel: "Mon",
      locationLabel: "Lahore",
      items: SCHEDULE_ITEMS,
      nextScheduleId: "asr",
      nextIn: "in 2h",
    });
    expect(text).toContain("Lahore");
    expect(text).toContain("Fajr  05:00\n");
    expect(text).toMatch(/Dhuhr {2}12:30 · \S+/);
    expect(text).toContain("Asr  16:00 · in 2h");
  });

  it("formats a schedule without a location or countdown", () => {
    const text = formatScheduleShare({
      dateLabel: "Mon",
      items: SCHEDULE_ITEMS.slice(2),
      nextScheduleId: null,
    });
    expect(text).toContain("Asr  16:00\n");
    expect(text).not.toContain("Lahore");
  });
});

describe("share payload builders", () => {
  it("builds an ayah payload with surah name and transliteration", () => {
    const payload = buildAyahSharePayload("A", "T", 2, 255, {
      surahName: "Al-Baqarah",
      transliteration: "tr",
      sectionTitle: "Qur'an",
    });
    expect(payload.contentLabel).toBe("Al-Baqarah · 2:255");
    expect(payload.filenameSlug).toBe("quran");
    expect(payload.content).toEqual({
      kind: "ayah",
      arabic: "A",
      translation: "T",
      reference: "2:255",
      transliteration: "tr",
    });
    expect(payload.message).toContain("tr");
  });

  it("builds an ayah payload with defaults", () => {
    const payload = buildAyahSharePayload("A", "T", 1, 1);
    expect(payload.sectionTitle).toBe("Qur'an");
    expect(payload.contentLabel).toBe("1:1");
  });

  it("builds a hadith payload with defaults", () => {
    const payload = buildHadithSharePayload("A", "E", "Bukhari 1");
    expect(payload.sectionTitle).toBe("Hadith");
    expect(payload.contentLabel).toBe("Bukhari 1");
    expect(payload.content).toEqual({
      kind: "hadith",
      arabic: "A",
      english: "E",
      reference: "Bukhari 1",
    });
  });

  it("builds a hadith payload with a custom label", () => {
    const payload = buildHadithSharePayload("A", "E", "B1", {
      sectionTitle: "Nawawi",
      contentLabel: "No. 1",
    });
    expect(payload.sectionTitle).toBe("Nawawi");
    expect(payload.contentLabel).toBe("No. 1");
  });
});

describe("useShareContentCard — native", () => {
  it("captures the snapshot and shares it with the message", async () => {
    const { result } = await setup();
    await act(async () => {
      await result.current.share(
        payloadFor(
          { kind: "hadith", arabic: "A", english: "E", reference: "R" },
          {
            filenameSlug: "hadith",
          },
        ),
      );
    });
    const options = shareSnapshotMock.mock.calls[0][1] as SnapshotOptions;
    expect(options.message).toBe("msg");
    expect(options.filename).toContain("hadith");
    expect(result.current.activeShareKey).toBeNull();
    expect(result.current.SnapshotHost).not.toBeNull();
  });

  it("runs the QR gate before capture and hides the host afterwards", async () => {
    const pending = deferSnapshot();
    const { result } = await setup();
    let done!: Promise<void>;
    await act(async () => {
      done = result.current.share(
        payloadFor(
          { kind: "ayah", arabic: "A", translation: "T", reference: "1:1" },
          {
            shareKey: "card-1",
          },
        ),
      );
    });
    expect(result.current.isSharing("card-1")).toBe(true);
    expect(result.current.isSharing("card-2")).toBe(false);
    await act(async () => {
      pending.finish();
      await done;
    });
    expect(mockQrGate.reset).toHaveBeenCalled();
    expect(mockQrGate.waitForQrCodes).toHaveBeenCalled();
    expect(result.current.SnapshotHost).toBeNull();
    expect(result.current.isSharing("card-1")).toBe(false);
  });

  it("ignores taps while another share is in flight", async () => {
    const pending = deferSnapshot();
    const { result } = await setup();
    let done!: Promise<void>;
    await act(async () => {
      done = result.current.share(
        payloadFor({ kind: "hadith", arabic: "A", english: "E", reference: "R" }),
      );
    });
    await act(async () => {
      await result.current.share(
        payloadFor({ kind: "hadith", arabic: "B", english: "E", reference: "R" }),
      );
    });
    expect(shareSnapshotMock).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.finish();
      await done;
    });
  });

  it("clears the host and warns when the view never attaches", async () => {
    waitForViewRefMock.mockResolvedValueOnce(false);
    const pending = deferSnapshot();
    const { result } = await setup();
    let done!: Promise<void>;
    await act(async () => {
      done = result.current.share(
        payloadFor({ kind: "hadith", arabic: "A", english: "E", reference: "R" }),
      );
    });
    await act(async () => {
      pending.finish();
      await done;
    });
    expect(console.warn).toHaveBeenCalledWith("Share failed", new Error("SHARE_SNAPSHOT_NO_VIEW"));
    expect(result.current.SnapshotHost).toBeNull();
    expect(result.current.activeShareKey).toBeNull();
  });

  it("does not offer a gesture retry on native", async () => {
    shareSnapshotMock.mockResolvedValueOnce({ web: { status: "needsUserGesture", payloads: [] } });
    const { result } = await setup();
    await act(async () => {
      await result.current.share(
        payloadFor({ kind: "hadith", arabic: "A", english: "E", reference: "R" }),
      );
    });
    expect(result.current.gesturePendingKey).toBeNull();
  });

  it.each<[string, ShareContentBody]>([
    ["ShareReadingContent", { kind: "reading", item: { arabic: "A", translation: "T" } }],
    ["ShareAyahContent", { kind: "ayah", arabic: "A", translation: "T", reference: "1:1" }],
    ["ShareHadithContent", { kind: "hadith", arabic: "A", english: "E", reference: "R" }],
    [
      "ShareAchievementContent",
      { kind: "achievement", title: "T", description: "D", trackLabel: "L", level: 2 },
    ],
    ["ShareGuideContent", { kind: "guide", title: "T", summary: "S", url: "https://x" }],
    [
      "ShareScheduleContent",
      { kind: "schedule", dateLabel: "Mon", items: SCHEDULE_ITEMS, nextScheduleId: null },
    ],
  ])("renders %s in the off-screen snapshot host", async (component, content) => {
    const pending = deferSnapshot();
    const { result } = await setup();
    let done!: Promise<void>;
    await act(async () => {
      done = result.current.share(payloadFor(content, { sectionTitle: "Sec" }));
    });
    await render(result.current.SnapshotHost as ReactElement);
    expect(screen.getByTestId("snapshot:Sec")).toBeTruthy();
    expect(screen.getByText(new RegExp(`^${component}`))).toBeTruthy();
    await act(async () => {
      pending.finish();
      await done;
    });
  });
});

describe("useShareContentCard — web", () => {
  usePlatform({ OS: "web" });

  const gestureResult = { web: { status: "needsUserGesture", payloads: [{ title: "x" }] } };
  const body: ShareContentBody = { kind: "hadith", arabic: "A", english: "E", reference: "R" };

  async function setupWithPendingGesture() {
    shareSnapshotMock.mockResolvedValueOnce(gestureResult);
    const hook = await setup();
    await act(async () => {
      await hook.result.current.share(payloadFor(body, { shareKey: "k" }));
    });
    return hook;
  }

  it("asks for a fresh tap when the browser needs a user gesture", async () => {
    const { result } = await setupWithPendingGesture();
    expect(result.current.gesturePendingKey).toBe("k");
    expect(result.current.isGesturePending("k")).toBe(true);
    expect(result.current.isGesturePending("other")).toBe(false);
  });

  it("shares the prepared file instantly on the re-tap", async () => {
    sharePreparedMock.mockResolvedValueOnce({ status: "shared" });
    const { result } = await setupWithPendingGesture();
    await act(async () => {
      await result.current.share(payloadFor(body, { shareKey: "k" }));
    });
    expect(sharePreparedMock).toHaveBeenCalledWith([{ title: "x" }]);
    expect(shareSnapshotMock).toHaveBeenCalledTimes(1);
    expect(result.current.gesturePendingKey).toBeNull();
    expect(result.current.activeShareKey).toBeNull();
  });

  it("keeps the prepared file when the re-tap still needs a gesture", async () => {
    sharePreparedMock.mockResolvedValueOnce({ status: "needsUserGesture" });
    const { result } = await setupWithPendingGesture();
    await act(async () => {
      await result.current.share(payloadFor(body, { shareKey: "k" }));
    });
    expect(result.current.gesturePendingKey).toBe("k");
    sharePreparedMock.mockResolvedValueOnce({ status: "shared" });
    await act(async () => {
      await result.current.share(payloadFor(body, { shareKey: "k" }));
    });
    expect(sharePreparedMock).toHaveBeenCalledTimes(2);
  });

  it("warns when sharing the prepared file fails", async () => {
    sharePreparedMock.mockRejectedValueOnce(new Error("denied"));
    const { result } = await setupWithPendingGesture();
    await act(async () => {
      await result.current.share(payloadFor(body, { shareKey: "k" }));
    });
    expect(console.warn).toHaveBeenCalledWith("Share failed", new Error("denied"));
    expect(result.current.gesturePendingKey).toBeNull();
  });

  it("captures afresh for a different button", async () => {
    const { result } = await setupWithPendingGesture();
    await act(async () => {
      await result.current.share(payloadFor(body));
    });
    expect(shareSnapshotMock).toHaveBeenCalledTimes(2);
    expect(sharePreparedMock).not.toHaveBeenCalled();
  });
});
