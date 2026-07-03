import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { CustomTargetModal } from "@/components/tasbeeh/custom-target-modal";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";

export default function FreeTasbeehScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <ScreenLayout
      eyebrow={t("tasbeeh.eyebrow")}
      title={t("tasbeeh.freeTitle")}
      subtitle={t("tasbeeh.freeSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      scrollable
    >
      <Card variant="plain" padding="five" style={styles.card}>
        <TasbeehCounter
          count={count}
          target={target}
          onIncrement={() => setCount((c) => (target > 0 ? Math.min(c + 1, target) : c + 1))}
          onDecrement={() => setCount((c) => Math.max(0, c - 1))}
          onReset={() => setCount(0)}
          onSelectMode={setTarget}
          onCustom={() => setCustomOpen(true)}
        />
      </Card>

      <View style={styles.hint}>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hintText}>
          {t("tasbeeh.freeHint")}
        </ThemedText>
      </View>

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
  card: {
    alignItems: "stretch",
  },
  hint: {
    alignItems: "center",
  },
  hintText: {
    textAlign: "center",
    maxWidth: 300,
  },
});
