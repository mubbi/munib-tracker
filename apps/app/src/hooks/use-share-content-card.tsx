import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { ShareAchievementContent } from "@/components/share/share-achievement-content";
import { ShareAyahContent } from "@/components/share/share-ayah-content";
import { ShareContentSnapshot } from "@/components/share/share-content-snapshot";
import { ShareGuideContent } from "@/components/share/share-guide-content";
import { ShareHadithContent } from "@/components/share/share-hadith-content";
import { ShareReadingContent } from "@/components/share/share-reading-content";
import {
  ShareScheduleContent,
  type ShareScheduleEntry,
} from "@/components/share/share-schedule-content";
import { absoluteUrl } from "@/config/seo";
import { useShareSnapshotWidth } from "@/hooks/use-share-snapshot-width";
import i18n from "@/i18n";
import {
  groupScheduleItemsInOrder,
  SCHEDULE_GROUP_LABEL_KEY,
  scheduleGroupFor,
} from "@/lib/schedule-ui";
import type { ShareableReading } from "@/lib/share";
import { contentShareFilename } from "@/lib/share/shareFilename";
import { formatShareExportStamp, SHARE_PROOF_QR_COUNT } from "@/lib/share/shareProofLayout";
import {
  SHARE_SNAPSHOT_NATIVE_HOST_STYLE,
  SHARE_SNAPSHOT_WEB_HOST_STYLE,
  shareViewSnapshot,
  waitForViewRef,
} from "@/lib/share/shareViewSnapshot";
import { sharePreparedWebFile } from "@/lib/share/shareViewSnapshotWeb";
import { useShareProofQrReadyGate } from "@/lib/share/useShareProofQrReadyGate";

const MARKETING_URL = process.env.EXPO_PUBLIC_SITE_URL ?? "https://munibtracker.app";

type PendingWebShare = {
  shareKey: string;
  payloads: ShareData[];
};

export type ShareContentBody =
  | { kind: "reading"; item: ShareableReading & { virtues?: string } }
  | {
      kind: "ayah";
      arabic: string;
      translation: string;
      reference: string;
      transliteration?: string;
    }
  | { kind: "hadith"; arabic: string; english: string; reference: string }
  | { kind: "achievement"; title: string; description: string; trackLabel: string; level: number }
  | { kind: "guide"; title: string; summary: string; excerpt?: string; url: string }
  | {
      kind: "schedule";
      dateLabel: string;
      locationLabel?: string;
      items: ShareScheduleEntry[];
      nextScheduleId: string | null;
      nextIn?: string;
    };

export type ShareContentPayload = {
  message: string;
  sectionTitle: string;
  contentLabel?: string;
  filenameSlug?: string;
  /** Unique id for the tapped share button so only that button shows loading. */
  shareKey?: string;
  content: ShareContentBody;
};

export function buildAyahSharePayload(
  arabic: string,
  translation: string,
  surah: number,
  ayah: number,
  options?: { surahName?: string; transliteration?: string; sectionTitle: string },
): ShareContentPayload {
  const reference = `${surah}:${ayah}`;
  return {
    message: formatAyahShare(arabic, translation, reference, options?.transliteration),
    sectionTitle: options?.sectionTitle ?? "Qur'an",
    contentLabel: options?.surahName ? `${options.surahName} · ${reference}` : reference,
    filenameSlug: "quran",
    content: {
      kind: "ayah",
      arabic,
      translation,
      reference,
      transliteration: options?.transliteration,
    },
  };
}

export function buildHadithSharePayload(
  arabic: string,
  english: string,
  reference: string,
  options?: { sectionTitle: string; contentLabel?: string },
): ShareContentPayload {
  return {
    message: formatHadithShare(arabic, english, reference),
    sectionTitle: options?.sectionTitle ?? "Hadith",
    contentLabel: options?.contentLabel ?? reference,
    filenameSlug: "hadith",
    content: { kind: "hadith", arabic, english, reference },
  };
}

/** Appends Munib branding footer to a plain-text share message. */
export function appendShareBranding(message: string): string {
  return [
    message,
    "",
    i18n.t("share.brandingFooterName", { appName: i18n.t("common.appName") }),
    i18n.t("common.appTagline"),
    MARKETING_URL,
  ].join("\n");
}

/** Formats a piece of religious text for the native share sheet. */
export function formatReadingShare(item: ShareableReading): string {
  const lines: string[] = [];
  if (item.title) lines.push(item.title, "");
  lines.push(item.arabic, "");
  if (item.transliteration) lines.push(item.transliteration, "");
  lines.push(item.translation);
  if (item.reference) lines.push("", `— ${item.reference}`);
  return appendShareBranding(lines.join("\n"));
}

export function formatAyahShare(
  arabic: string,
  translation: string,
  reference: string,
  transliteration?: string,
): string {
  const lines = [arabic, ""];
  if (transliteration) lines.push(transliteration, "");
  lines.push(translation, "", `— ${reference}`);
  return appendShareBranding(lines.join("\n"));
}

export function formatHadithShare(arabic: string, english: string, reference: string): string {
  return appendShareBranding(
    [arabic, "", english, "", `— ${reference}`].filter(Boolean).join("\n"),
  );
}

export function formatAchievementShare(title: string, description: string): string {
  return appendShareBranding(i18n.t("achievements.shareMessage", { title, description }));
}

/** Formats a learn-section guide page for the native share sheet. */
export function formatGuideShare({
  title,
  summary,
  path,
  bodyExcerpt,
  readAtLabel,
}: {
  title: string;
  summary?: string;
  path: string;
  bodyExcerpt?: string;
  readAtLabel: string;
}): string {
  const url = absoluteUrl(path);
  const lines = [title, ""];
  if (summary) lines.push(summary, "");
  if (bodyExcerpt) lines.push(bodyExcerpt, "");
  lines.push(readAtLabel, url);
  return appendShareBranding(lines.join("\n"));
}

/** Formats today's complete prayer schedule for the native share sheet. */
export function formatScheduleShare({
  dateLabel,
  locationLabel,
  items,
  nextScheduleId,
  nextIn,
}: {
  dateLabel: string;
  locationLabel?: string;
  items: ShareScheduleEntry[];
  nextScheduleId: string | null;
  nextIn?: string;
}): string {
  const lines = [i18n.t("schedule.shareMessageIntro", { date: dateLabel }), ""];
  if (locationLabel) lines.push(locationLabel, "");

  const groups = groupScheduleItemsInOrder(items, (id) =>
    scheduleGroupFor(id as Parameters<typeof scheduleGroupFor>[0]),
  );

  for (const group of groups) {
    lines.push(i18n.t(SCHEDULE_GROUP_LABEL_KEY[group.group]));
    for (const item of group.items) {
      const suffix =
        item.status === "active"
          ? ` · ${i18n.t("home.scheduleCurrent")}`
          : nextScheduleId !== null && item.id === nextScheduleId && nextIn
            ? ` · ${nextIn}`
            : "";
      lines.push(`${item.name}  ${item.time}${suffix}`);
    }
    lines.push("");
  }

  return appendShareBranding(lines.join("\n").trimEnd());
}

function renderShareBody(content: ShareContentBody) {
  switch (content.kind) {
    case "reading":
      return <ShareReadingContent item={content.item} />;
    case "ayah":
      return (
        <ShareAyahContent
          arabic={content.arabic}
          translation={content.translation}
          reference={content.reference}
          transliteration={content.transliteration}
        />
      );
    case "hadith":
      return (
        <ShareHadithContent
          arabic={content.arabic}
          english={content.english}
          reference={content.reference}
        />
      );
    case "achievement":
      return (
        <ShareAchievementContent
          title={content.title}
          description={content.description}
          trackLabel={content.trackLabel}
          level={content.level}
        />
      );
    case "guide":
      return (
        <ShareGuideContent
          title={content.title}
          summary={content.summary}
          excerpt={content.excerpt}
          url={content.url}
        />
      );
    case "schedule":
      return (
        <ShareScheduleContent
          dateLabel={content.dateLabel}
          locationLabel={content.locationLabel}
          items={content.items}
          nextScheduleId={content.nextScheduleId}
          nextIn={content.nextIn}
        />
      );
  }
}

/** Hook for branded image + text sharing with lazy off-screen snapshot capture. */
export function useShareContentCard() {
  const { t } = useTranslation();
  const snapshotWidth = useShareSnapshotWidth();
  const captureRef = useRef<View>(null);
  const {
    markQrReady,
    waitForQrCodes,
    reset: resetQrReadyGate,
  } = useShareProofQrReadyGate(SHARE_PROOF_QR_COUNT);
  const [payload, setPayload] = useState<ShareContentPayload | null>(null);
  const [generation, setGeneration] = useState(0);
  const [exportStamp, setExportStamp] = useState(() => formatShareExportStamp());
  // Track which specific button is sharing so sibling buttons stay idle. The ref
  // guards against concurrent taps; the state drives the per-button spinner.
  const activeShareKeyRef = useRef<string | null>(null);
  const [activeShareKey, setActiveShareKey] = useState<string | null>(null);
  const pendingWebShareRef = useRef<PendingWebShare | null>(null);
  const [gesturePendingKey, setGesturePendingKey] = useState<string | null>(null);

  const share = useCallback(
    async (next: ShareContentPayload) => {
      const shareKey = next.shareKey ?? "default";

      // Web: image is already prepared — re-tap shares instantly inside a fresh gesture.
      if (Platform.OS === "web" && pendingWebShareRef.current?.shareKey === shareKey) {
        const pending = pendingWebShareRef.current;
        pendingWebShareRef.current = null;
        setGesturePendingKey(null);
        activeShareKeyRef.current = shareKey;
        setActiveShareKey(shareKey);

        try {
          const retry = await sharePreparedWebFile(pending.payloads);
          if (retry.status === "needsUserGesture") {
            pendingWebShareRef.current = pending;
            setGesturePendingKey(shareKey);
          }
        } catch (error) {
          if (__DEV__) console.warn("Share failed", error);
        } finally {
          activeShareKeyRef.current = null;
          setActiveShareKey(null);
        }
        return;
      }

      if (activeShareKeyRef.current != null) return;

      activeShareKeyRef.current = shareKey;
      setActiveShareKey(shareKey);
      setGesturePendingKey(null);
      setExportStamp(formatShareExportStamp());
      setPayload(next);
      setGeneration((g) => g + 1);

      try {
        const result = await shareViewSnapshot(captureRef, {
          filename: contentShareFilename(next.filenameSlug ?? "content"),
          dialogTitle: t("share.dialogTitle", { defaultValue: "Share" }),
          message: next.message,
          beforeCapture: async () => {
            resetQrReadyGate();
            const attached = await waitForViewRef(captureRef);
            if (!attached) throw new Error("SHARE_SNAPSHOT_NO_VIEW");
            await waitForQrCodes();
          },
          afterCapture: () => {
            setPayload(null);
          },
        });

        if (Platform.OS === "web" && result.web?.status === "needsUserGesture") {
          pendingWebShareRef.current = {
            shareKey,
            payloads: result.web.payloads,
          };
          setGesturePendingKey(shareKey);
        }
      } catch (error) {
        setPayload(null);
        if (__DEV__) console.warn("Share failed", error);
      } finally {
        activeShareKeyRef.current = null;
        setActiveShareKey(null);
      }
    },
    [resetQrReadyGate, t, waitForQrCodes],
  );

  const isSharing = useCallback(
    (shareKey: string) => activeShareKey === shareKey,
    [activeShareKey],
  );

  const isGesturePending = useCallback(
    (shareKey: string) => gesturePendingKey === shareKey,
    [gesturePendingKey],
  );

  const SnapshotHost =
    payload != null ? (
      <View
        style={[
          styles.snapshotHost,
          Platform.OS === "web" ? SHARE_SNAPSHOT_WEB_HOST_STYLE : SHARE_SNAPSHOT_NATIVE_HOST_STYLE,
          { pointerEvents: "none" },
        ]}
      >
        <ShareContentSnapshot
          key={generation}
          ref={captureRef}
          frameWidth={snapshotWidth}
          sectionTitle={payload.sectionTitle}
          contentLabel={payload.contentLabel}
          exportedAtLabel={exportStamp}
          onQrReady={markQrReady}
        >
          {renderShareBody(payload.content)}
        </ShareContentSnapshot>
      </View>
    ) : null;

  return { share, isSharing, isGesturePending, activeShareKey, SnapshotHost };
}

const styles = StyleSheet.create({
  snapshotHost: {
    position: "absolute",
    top: 0,
  },
});
