import { useLocalSearchParams, useRouter } from "expo-router";
import { goBackOrReplace } from "@/lib/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { CustomTasbeehFormModal } from "@/components/tasbeeh/custom-tasbeeh-form-modal";
import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import {
  useCustomTasbeeh,
  useCustomTasbeehActions,
  useEnsureCustomTasbeehLoaded,
} from "@/stores/custom-tasbeeh-store";

export default function CustomTasbeehScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  useEnsureCustomTasbeehLoaded();
  const item = useCustomTasbeeh(params.id);
  const { update, remove, setCount } = useCustomTasbeehActions();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const goBack = () => (goBackOrReplace(router, "/tasbeeh/free"));

  if (!item) {
    return (
      <ScreenLayout title={t("tasbeeh.eyebrow")} onBack={goBack}>
        <Seo
          title={t("tasbeeh.customSection")}
          description="Your custom tasbeeh counter."
          index={false}
        />
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("tasbeeh.notFoundTitle")}
          description={t("tasbeeh.notFoundDesc")}
          actionLabel={t("tasbeeh.customBackToCounters")}
          onAction={() => router.replace("/tasbeeh/free")}
        />
      </ScreenLayout>
    );
  }

  const target = item.target;
  const count = item.count;

  const persist = (next: number) => {
    void setCount(item.id, next);
  };

  return (
    <ScreenLayout eyebrow={t("tasbeeh.eyebrow")} title={item.title} onBack={goBack} scrollable>
      <Seo
        title={t("tasbeeh.customSection")}
        description="Your custom tasbeeh counter."
        index={false}
      />
      {item.description ? (
        <Card variant="muted" padding="four" style={styles.reading}>
          <ThemedText type="small" themeColor="mutedForeground">
            {item.description}
          </ThemedText>
        </Card>
      ) : null}

      <Card variant="plain" padding="five" style={styles.card}>
        <TasbeehCounter
          count={count}
          target={target}
          onIncrement={() => persist(target > 0 ? Math.min(count + 1, target) : count + 1)}
          onDecrement={() => persist(count - 1)}
          onReset={() => persist(0)}
        />
      </Card>

      <View style={styles.manage}>
        <Button
          label={t("common.edit")}
          variant="secondary"
          icon={{ ios: "pencil", android: "edit", web: "edit" }}
          onPress={() => setEditOpen(true)}
          style={styles.manageButton}
        />
        <Button
          label={t("common.delete")}
          variant="ghost"
          icon={{ ios: "trash", android: "delete", web: "delete" }}
          onPress={() => setDeleteOpen(true)}
          style={styles.manageButton}
        />
      </View>

      <CustomTasbeehFormModal
        visible={editOpen}
        mode="edit"
        initial={{
          title: item.title,
          description: item.description,
          target: item.target,
        }}
        onSubmit={(values) => void update(item.id, values)}
        onClose={() => setEditOpen(false)}
      />

      <ConfirmDialog
        visible={deleteOpen}
        title={t("tasbeeh.customDeleteTitle")}
        message={t("tasbeeh.customDeleteMessage", { title: item.title })}
        confirmLabel={t("common.delete")}
        destructive
        onConfirm={() => {
          void remove(item.id);
          router.replace("/tasbeeh/free");
        }}
        onClose={() => setDeleteOpen(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  reading: {
    marginBottom: Spacing.two,
  },
  card: {
    alignItems: "stretch",
  },
  manage: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  manageButton: {
    flexGrow: 1,
  },
});
