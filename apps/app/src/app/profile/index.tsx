import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, StyleSheet, TextInput, View } from "react-native";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { usePinLock } from "@/features/pin-lock";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { formatRelativeWhen } from "@/lib/relative-time";
import { wipeLocalDeviceData } from "@/lib/wipe-local-data";
import { useAuth } from "@/providers/auth-provider";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useToast } from "@/providers/toast-provider";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";
import { readSyncMetadata, type SyncMetadata } from "@/sync/sync-engine";

/** Title-cases a raw sync entity id ("dua_favorites" -> "Dua Favorites") as a last-resort fallback. */
function titleCaseEntity(entity: string): string {
  return entity
    .split("_")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

/** Turns a raw sync entity id ("dua_favorites") into a translated, readable label. */
function friendlyEntity(entity: string, t: (key: string) => string): string {
  const key = `sync.entities.${entity}`;
  const translated = t(key);
  return translated === key ? titleCaseEntity(entity) : translated;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { user, isAuthenticated, signOut, syncNow, deleteAccount: deleteServerAccount } = useAuth();
  const toast = useToast();
  const { factoryResetPinLock } = usePinLock();
  const { clearAll: clearInAppInbox } = useInAppNotifications();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();

  const displayName = prefs.displayName ?? user?.displayName ?? t("profile.guestName");
  // Treat anyone who isn't a fully linked account (a real guest session OR an
  // offline/null session) as a guest so they can still link a provider.
  const isGuest = !isAuthenticated;
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [syncMeta, setSyncMeta] = useState<SyncMetadata | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const locale = i18n.language?.split("-")[0];

  const refreshSyncMeta = useCallback(async () => {
    setSyncMeta(await readSyncMetadata());
  }, []);

  useEffect(() => {
    if (isAuthenticated) void refreshSyncMeta();
  }, [isAuthenticated, refreshSyncMeta]);

  const onSyncNow = async () => {
    setIsSyncing(true);
    const outcome = await syncNow();
    if (outcome === "ok") {
      toast.success(t("sync.done"));
      await refreshSyncMeta();
    } else if (outcome === "error") {
      toast.error(t("sync.failed"));
    }
    setIsSyncing(false);
  };

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      void update({ avatarUri: result.assets[0].uri });
    }
  };

  const saveName = () => {
    void update({ displayName: nameDraft.trim() || undefined });
    setEditing(false);
  };

  const deleteAccount = async () => {
    // Signed-in users: delete the server account + all synced data FIRST. If the
    // server can't be reached, abort without wiping locally — otherwise the still
    // existing account would repopulate this device on the next login/sync, and
    // the user would wrongly believe their data was gone. (Guests return "ok".)
    const outcome = await deleteServerAccount();
    if (outcome === "error") {
      toast.error(t("profile.deleteFailed"));
      return;
    }
    await wipeLocalDeviceData();
    // Provider-owned memory (PIN gate + inbox badge) is outside reloadAllStores.
    await factoryResetPinLock();
    await clearInAppInbox();
    router.replace("/");
  };

  return (
    <ScreenLayout
      eyebrow={t("profile.eyebrow")}
      title={t("profile.title")}
      subtitle={t("profile.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/profile" />
      <Stagger>
        <Card style={styles.hero}>
          <PressableScale
            haptic="light"
            onPress={pickAvatar}
            accessibilityLabel={t("profile.changeAvatar")}
          >
            <View style={styles.avatarWrap}>
              {prefs.avatarUri ? (
                <Image source={{ uri: prefs.avatarUri }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    styles.avatarPlaceholder,
                    { backgroundColor: tokens.accentSoft },
                  ]}
                >
                  <ThemedText type="header" style={{ color: colors.accent }}>
                    {displayName.slice(0, 1).toUpperCase()}
                  </ThemedText>
                </View>
              )}
              <View style={[styles.cameraBadge, { backgroundColor: colors.accent }]}>
                <SymbolView
                  name={{ ios: "camera.fill", android: "photo_camera", web: "photo_camera" }}
                  size={12}
                  tintColor={colors.accentForeground}
                />
              </View>
            </View>
          </PressableScale>

          {editing ? (
            <View style={styles.nameEdit}>
              <TextInput
                value={nameDraft}
                onChangeText={setNameDraft}
                autoFocus
                style={[
                  styles.nameInput,
                  {
                    color: colors.foreground,
                    borderColor: colors.border,
                    backgroundColor: colors.muted,
                  },
                ]}
              />
              <Button label={t("common.save")} size="sm" onPress={saveName} />
            </View>
          ) : (
            <PressableScale
              haptic="light"
              onPress={() => {
                setNameDraft(displayName);
                setEditing(true);
              }}
              style={styles.nameRow}
            >
              <ThemedText type="subtitle">{displayName}</ThemedText>
              <SymbolView
                name={{ ios: "pencil", android: "edit", web: "edit" }}
                size={15}
                tintColor={colors.mutedForeground}
              />
            </PressableScale>
          )}

          {user?.email ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {user.email}
            </ThemedText>
          ) : null}

          <Pill
            label={isGuest ? t("profile.guestName") : (user?.provider ?? t("common.signedIn"))}
            color={isGuest ? colors.mutedForeground : tokens.status.success.color}
            background={isGuest ? colors.muted : tokens.status.success.soft}
          />
        </Card>

        {isGuest ? (
          <Card padding="three">
            <View style={styles.signIn}>
              <ThemedText type="small">{t("profile.signInToSync")}</ThemedText>
              <SocialLoginButtons />
            </View>
          </Card>
        ) : null}

        {isAuthenticated ? (
          <Card padding="three">
            <SectionHeader
              title={t("sync.title")}
              icon={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
            />
            <View style={styles.syncStatus}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("sync.lastSynced")}
              </ThemedText>
              <ThemedText type="small">
                {syncMeta?.lastSyncedAt
                  ? formatRelativeWhen(syncMeta.lastSyncedAt, locale, t, prefs.defaultCalendar)
                  : t("sync.never")}
              </ThemedText>
            </View>

            {syncMeta?.lastOutcomeAt ? (
              <View style={[styles.mergeBox, { backgroundColor: colors.muted }]}>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {(syncMeta.lastPulled ?? 0) === 0 && (syncMeta.lastPushed ?? 0) === 0
                    ? t("sync.mergeNoChanges")
                    : t("sync.mergeSummary", {
                        received: syncMeta.lastPulled ?? 0,
                        sent: syncMeta.lastPushed ?? 0,
                      })}
                </ThemedText>
                {(syncMeta.lastConflicts ?? 0) > 0 ? (
                  <View style={styles.conflictRow}>
                    <SymbolView
                      name={{
                        ios: "arrow.triangle.merge",
                        android: "merge_type",
                        web: "merge_type",
                      }}
                      size={13}
                      tintColor={tokens.status.warning.color}
                    />
                    <ThemedText
                      type="caption"
                      style={{ color: tokens.status.warning.text, flex: 1 }}
                    >
                      {t("sync.conflictsResolved", { count: syncMeta.lastConflicts ?? 0 })}
                    </ThemedText>
                  </View>
                ) : null}
                {syncMeta.lastConflictEntities && syncMeta.lastConflictEntities.length > 0 ? (
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("sync.conflictAffected", {
                      list: syncMeta.lastConflictEntities
                        .map((entity) => friendlyEntity(entity, t))
                        .join(", "),
                    })}
                  </ThemedText>
                ) : null}
              </View>
            ) : null}

            <Button
              label={isSyncing ? t("sync.syncing") : t("sync.now")}
              icon={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
              variant="secondary"
              fullWidth
              disabled={isSyncing}
              onPress={() => void onSyncNow()}
              style={styles.syncButton}
            />
            {isSyncing ? (
              <View style={styles.syncSpinner}>
                <ActivityIndicator size="small" color={colors.accent} />
              </View>
            ) : null}
          </Card>
        ) : null}

        <Card padding="three">
          <View style={styles.actions}>
            {isAuthenticated ? (
              <Button
                label={t("common.signOut")}
                variant="secondary"
                icon={{
                  ios: "rectangle.portrait.and.arrow.right",
                  android: "logout",
                  web: "logout",
                }}
                fullWidth
                onPress={() => void signOut()}
              />
            ) : null}
            <Button
              label={t("profile.deleteAccount")}
              variant="ghost"
              icon={{ ios: "trash", android: "delete", web: "delete" }}
              fullWidth
              onPress={() => setConfirmDelete(true)}
              style={{ borderColor: tokens.status.danger.border }}
            />
          </View>
        </Card>
      </Stagger>

      <ConfirmDialog
        visible={confirmDelete}
        title={t("profile.deleteTitle")}
        message={isAuthenticated ? t("profile.deleteMsgAccount") : t("profile.deleteMsg")}
        confirmLabel={t("profile.deleteConfirm")}
        destructive
        onConfirm={() => void deleteAccount()}
        onClose={() => setConfirmDelete(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarWrap: {
    width: 96,
    height: 96,
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  nameEdit: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  nameInput: {
    minWidth: 160,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 17,
    fontWeight: "700",
  },
  actions: {
    gap: Spacing.two,
  },
  signIn: {
    gap: Spacing.three,
  },
  syncStatus: {
    marginTop: Spacing.three,
    gap: 2,
  },
  mergeBox: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.one,
  },
  conflictRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  syncButton: {
    marginTop: Spacing.three,
  },
  syncSpinner: {
    marginTop: Spacing.two,
    alignItems: "center",
  },
});
