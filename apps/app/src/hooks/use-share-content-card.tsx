import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ShareAchievementContent } from "@/components/share/share-achievement-content";
import { ShareAyahContent } from "@/components/share/share-ayah-content";
import { ShareContentSnapshot } from "@/components/share/share-content-snapshot";
import { ShareHadithContent } from "@/components/share/share-hadith-content";
import { ShareReadingContent } from "@/components/share/share-reading-content";
import { useShareSnapshotWidth } from "@/hooks/use-share-snapshot-width";
import type { ShareableReading } from "@/lib/share";
import { contentShareFilename } from "@/lib/share/shareFilename";
import { formatShareExportStamp, SHARE_PROOF_QR_COUNT } from "@/lib/share/shareProofLayout";
import {
  SHARE_SNAPSHOT_NATIVE_HOST_STYLE,
  SHARE_SNAPSHOT_OFFSCREEN_LEFT,
  shareViewSnapshot,
  waitForViewRef,
} from "@/lib/share/shareViewSnapshot";
import { useShareProofQrReadyGate } from "@/lib/share/useShareProofQrReadyGate";

const MARKETING_URL = process.env.EXPO_PUBLIC_SITE_URL ?? "https://munibtracker.app";

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
  | { kind: "achievement"; title: string; description: string; trackLabel: string; level: number };

export type ShareContentPayload = {
  message: string;
  sectionTitle: string;
  contentLabel?: string;
  filenameSlug?: string;
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
  return [message, "", `— ${APP_NAME}`, APP_TAGLINE, MARKETING_URL].join("\n");
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
  return appendShareBranding(
    [`Alhamdulillah — I unlocked "${title}" in ${APP_NAME}:`, description].join("\n"),
  );
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
  const [sharing, setSharing] = useState(false);

  const share = useCallback(
    async (next: ShareContentPayload) => {
      if (sharing) return;
      setSharing(true);
      setExportStamp(formatShareExportStamp());
      setPayload(next);
      setGeneration((g) => g + 1);

      try {
        await shareViewSnapshot(captureRef, {
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
      } catch (error) {
        setPayload(null);
        if (__DEV__) console.warn("Share failed", error);
      } finally {
        setSharing(false);
      }
    },
    [resetQrReadyGate, sharing, t, waitForQrCodes],
  );

  const SnapshotHost =
    payload != null ? (
      <View
        style={[
          styles.snapshotHost,
          Platform.OS === "web"
            ? { position: "fixed" as const, left: SHARE_SNAPSHOT_OFFSCREEN_LEFT, zIndex: -1 }
            : SHARE_SNAPSHOT_NATIVE_HOST_STYLE,
        ]}
        pointerEvents="none"
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

  return { share, sharing, SnapshotHost };
}

const styles = StyleSheet.create({
  snapshotHost: {
    position: "absolute",
    top: 0,
  },
});
