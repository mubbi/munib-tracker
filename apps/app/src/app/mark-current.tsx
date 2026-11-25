import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScreenLayout } from "@/components/screen-layout";
import { ContentState } from "@/components/ui/content-state";
import { nativeEnqueueCommand } from "@/lib/external-commands/native-bridge";
import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * App Actions / launcher shortcut / icon quick-action deep link:
 * `munib-tracker://mark-current`
 *
 * Enqueues a single mark-current command then leaves for the tracker, where
 * the command processor confirms the mark with an Undo toast (P5-07).
 * Guarded so React Strict Mode remounts or a re-routed quick action cannot
 * enqueue multiple marks in one visit. The brief hand-off keeps the screen
 * chrome (title + back) instead of rendering nothing (P8-01).
 */
export default function MarkCurrentDeepLinkScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const enqueuedRef = useRef(false);

  useEffect(() => {
    if (enqueuedRef.current) return;
    enqueuedRef.current = true;

    void (async () => {
      await nativeEnqueueCommand({ type: "mark-current-obligatory", source: "deeplink" });
      router.replace("/(tabs)/tracker");
    })();
  }, [router]);

  return (
    <ScreenLayout title={t("externalCommands.intents.markCurrent")}>
      <ContentState status="loading" skeleton="card" loadingLabel={t("externalCommands.marking")} />
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/mark-current");
