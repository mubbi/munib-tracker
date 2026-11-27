import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { CustomTargetModal } from "@/components/tasbeeh/custom-target-modal";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { TasbeehReadingBlock } from "@/components/tasbeeh/tasbeeh-reading-block";
import { TasbeehLoadingScreen } from "@/components/tasbeeh/tasbeeh-screen-scaffold";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Breakpoints, Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { isHandsFreeCounter } from "@/lib/tasbeeh-voice/steps";
import { voiceZikrFromCustom } from "@/lib/tasbeeh-voice/voice-zikr";
import {
  useCustomAdhkar,
  useCustomAdhkarReady,
  useEnsureCustomAdhkarLoaded,
} from "@/stores/custom-adhkar-store";

function paramId(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * "Count this" for an entry of My Adhkar (NF-2.11): a tasbeeh counter over the
 * user's own text. Hands-free listens by the entry's own taught pattern
 * (`custom:<id>`, D48 device-only) and shows its Arabic back; a long entry (more
 * than one breath) stays tap-counted. The target is the user's choice.
 */
export default function CustomAdhkarTasbeehScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  useEnsureCustomAdhkarLoaded();
  const ready = useCustomAdhkarReady();
  const item = useCustomAdhkar(paramId(params.id));
  const { width: windowWidth } = useWindowDimensions();
  const wide = !isTV() && windowWidth >= Breakpoints.wide;
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [customOpen, setCustomOpen] = useState(false);

  const goBack = () => goBackOrReplace(router, "/adhkar-builder");
  const seo = (
    <Seo
      title={t("tasbeeh.eyebrow")}
      description={t("seo.tasbeehCustomAdhkar.description")}
      index={false}
    />
  );

  if (!ready) return <TasbeehLoadingScreen onBack={goBack} />;

  if (!item) {
    return (
      <ScreenLayout title={t("tasbeeh.eyebrow")} onBack={goBack}>
        {seo}
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("tasbeeh.notFoundTitle")}
          description={t("tasbeeh.notFoundDesc")}
          actionLabel={t("customAdhkar.title")}
          onAction={() => router.replace("/adhkar-builder")}
        />
      </ScreenLayout>
    );
  }

  const arabic = item.arabic.trim();
  const readingBlock = arabic ? (
    <TasbeehReadingBlock
      item={{
        arabic,
        transliteration: item.transliteration,
        translation: item.translation ?? "",
        reference: item.reference,
      }}
    />
  ) : null;
  const counterCard = (
    <Card variant="plain" padding="five" style={styles.card}>
      <TasbeehCounter
        count={count}
        target={target}
        onIncrement={() => setCount((c) => (target > 0 ? Math.min(c + 1, target) : c + 1))}
        onDecrement={() => setCount((c) => Math.max(0, c - 1))}
        onReset={() => setCount(0)}
        onSelectMode={setTarget}
        onCustom={() => setCustomOpen(true)}
        keyboardShortcuts={!customOpen}
        voiceZikr={isHandsFreeCounter(item, target) ? voiceZikrFromCustom(item) : null}
      />
    </Card>
  );

  return (
    <ScreenLayout eyebrow={t("tasbeeh.eyebrow")} title={item.title} onBack={goBack} scrollable>
      {seo}
      {wide && readingBlock ? (
        <View style={styles.wideRow}>
          <View style={styles.wideReading}>{readingBlock}</View>
          <View style={styles.wideCounter}>{counterCard}</View>
        </View>
      ) : (
        <>
          {readingBlock}
          {counterCard}
        </>
      )}
      <CustomTargetModal
        visible={customOpen}
        initial={target || undefined}
        onSubmit={(next) => setTarget(next)}
        onClose={() => setCustomOpen(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  wideRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  wideReading: { flex: 1, minWidth: 0 },
  wideCounter: { width: 420, flexShrink: 0 },
  card: { alignItems: "stretch", flex: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/tasbeeh/adhkar/[id]");
