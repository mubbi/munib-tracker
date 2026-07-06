import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { CustomTargetModal } from "@/components/tasbeeh/custom-target-modal";
import { CustomTasbeehFormModal } from "@/components/tasbeeh/custom-tasbeeh-form-modal";
import { CustomTasbeehRow } from "@/components/tasbeeh/custom-tasbeeh-row";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { TASBEEH_ICON } from "@/lib/quick-actions";
import { getRouteFaq } from "@/lib/seo/faq-content";
import { faqSchema, webPageSchema } from "@/lib/seo/structured-data";
import {
  useCustomTasbeehActions,
  useCustomTasbeehList,
  useEnsureCustomTasbeehLoaded,
} from "@/stores/custom-tasbeeh-store";

export default function FreeTasbeehScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureCustomTasbeehLoaded();
  const customItems = useCustomTasbeehList();
  const { create } = useCustomTasbeehActions();

  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [customOpen, setCustomOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const openCustom = (id: string) => {
    router.push({ pathname: "/tasbeeh/custom/[id]", params: { id } });
  };

  const handleCreate = async (values: Parameters<typeof create>[0]) => {
    const item = await create(values);
    openCustom(item.id);
  };

  return (
    <ScreenLayout
      eyebrow={t("tasbeeh.eyebrow")}
      title={t("tasbeeh.freeTitle")}
      subtitle={t("tasbeeh.freeSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      scrollable
    >
      <Seo
        path="/tasbeeh/free"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("actions.tasbeeh"), path: "/tasbeeh/free" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/tasbeeh/free",
            name: "Digital Tasbeeh Counter",
            description: "A free digital tasbeeh (misbaha) counter for any dhikr, hands-free.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("actions.tasbeeh"), path: "/tasbeeh/free" },
            ],
          }),
          faqSchema(getRouteFaq("/tasbeeh/free") ?? []),
        ]}
      />
      <Stagger>
        <SectionHeader title={t("tasbeeh.quickCounter")} icon={TASBEEH_ICON} />

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

        <SectionHeader
          title={t("tasbeeh.customSection")}
          icon={{ ios: "square.stack.3d.up.fill", android: "layers", web: "layers" }}
          actionLabel={t("tasbeeh.customCreateAction")}
          onActionPress={() => setCreateOpen(true)}
        />

        {customItems.length === 0 ? (
          <EmptyState
            icon={{ ios: "plus.circle.fill", android: "add_circle", web: "add_circle" }}
            title={t("tasbeeh.customEmptyTitle")}
            description={t("tasbeeh.customEmptyDesc")}
            actionLabel={t("tasbeeh.customCreateAction")}
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <Card padding="three">
            <View style={styles.list}>
              {customItems.map((item) => (
                <CustomTasbeehRow key={item.id} item={item} onPress={() => openCustom(item.id)} />
              ))}
            </View>
          </Card>
        )}
      </Stagger>

      <CustomTargetModal
        visible={customOpen}
        initial={target || undefined}
        onSubmit={(next) => setTarget(next)}
        onClose={() => setCustomOpen(false)}
      />

      <CustomTasbeehFormModal
        visible={createOpen}
        mode="create"
        onSubmit={(values) => void handleCreate(values)}
        onClose={() => setCreateOpen(false)}
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
    marginBottom: Spacing.two,
  },
  hintText: {
    textAlign: "center",
    maxWidth: 300,
  },
  list: {
    gap: Spacing.two,
  },
});
