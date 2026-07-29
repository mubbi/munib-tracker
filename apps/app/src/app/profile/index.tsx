import type { AuthUserResponseDtoProvider } from "@munib-tracker/api-client";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { DeleteAccountModal } from "@/components/auth/delete-account-modal";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { usePinLock } from "@/features/pin-lock";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { DeleteAccountRequestBody } from "@/lib/auth/account-closure-reasons";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { formatRelativeWhen } from "@/lib/relative-time";
import { wipeLocalDeviceData } from "@/lib/wipe-local-data";
import { useAuth } from "@/providers/auth-provider";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useToast } from "@/providers/toast-provider";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";
import { readSyncMetadata, type SyncMetadata } from "@/sync/sync-engine";

const PROVIDER_LOGOS: Record<AuthUserResponseDtoProvider, number> = {
  google: require("@/assets/brands/google.svg"),
  apple: require("@/assets/brands/apple.svg"),
  facebook: require("@/assets/brands/facebook.svg"),
};

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

function providerLabelKey(provider: AuthUserResponseDtoProvider): string {
  if (provider === "google") return "profile.providerGoogle";
  if (provider === "apple") return "profile.providerApple";
  return "profile.providerFacebook";
}

export default function ProfileScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const {
    user,
    session,
    isAuthenticated,
    signOut,
    syncNow,
    deleteAccount: deleteServerAccount,
    resetAppData: resetServerAppData,
  } = useAuth();
  const toast = useToast();
  const { factoryResetPinLock } = usePinLock();
  const { clearAll: clearInAppInbox } = useInAppNotifications();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();

  // Null/offline session and guest JWTs both lack a linked account — show guest UI
  // (sign-in) until accountType is "user".
  const isGuest = !isAuthenticated;
  const provider = user?.provider ?? session?.provider;
  const displayName = isGuest
    ? (prefs.displayName ?? t("profile.guestName"))
    : (prefs.displayName ?? user?.displayName ?? user?.email ?? t("common.signedIn"));
  const statusLabel = isGuest
    ? t("profile.guestName")
    : provider
      ? t("profile.signedInWith", { provider: t(providerLabelKey(provider)) })
      : t("common.signedIn");
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [confirmResetData, setConfirmResetData] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [syncMeta, setSyncMeta] = useState<SyncMetadata | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
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
    if (isTV()) {
      toast.info(t("common.tvUnavailableBody"));
      return;
    }
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

  const finishLocalDataWipe = async () => {
    await wipeLocalDeviceData();
    await factoryResetPinLock();
    await clearInAppInbox();
    router.replace("/");
  };

  const resetAppData = async () => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      if (isAuthenticated) {
        const outcome = await resetServerAppData();
        if (outcome === "error") {
          toast.error(t("profile.resetDataFailed"));
          return;
        }
      }
      await finishLocalDataWipe();
      toast.success(t("profile.resetDataSuccess"));
    } finally {
      setIsResetting(false);
    }
  };

  const deleteSignedInAccount = async (body: DeleteAccountRequestBody) => {
    const outcome = await deleteServerAccount(body);
    if (outcome === "error") {
      throw new Error("delete failed");
    }
    await finishLocalDataWipe();
  };

  const syncUpToDate =
    syncMeta?.lastOutcomeAt != null &&
    (syncMeta.lastPulled ?? 0) === 0 &&
    (syncMeta.lastPushed ?? 0) === 0;

  const providerLogo = useMemo(() => {
    if (!provider || !(provider in PROVIDER_LOGOS)) return null;
    // Soft chip backgrounds need the dark Apple mark in both schemes.
    if (provider === "apple") return require("@/assets/brands/apple-black.svg");
    return PROVIDER_LOGOS[provider];
  }, [provider]);

  return (
    <ScreenLayout
      eyebrow={t("profile.eyebrow")}
      title={t("profile.title")}
      subtitle={t("profile.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/profile" />
      <Stagger>
        <Card padding="three" style={styles.hero}>
          <View style={styles.identityRow}>
            <PressableScale
              haptic="light"
              onPress={pickAvatar}
              disabled={isTV()}
              accessibilityLabel={t("profile.changeAvatar")}
            >
              <View style={styles.avatarWrap}>
                {prefs.avatarUri ? (
                  <Image
                    source={{ uri: prefs.avatarUri }}
                    style={[styles.avatar, { borderColor: tokens.hairline }]}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      styles.avatarPlaceholder,
                      {
                        backgroundColor: tokens.accentSoft,
                        borderColor: withAlpha(colors.accent, 0.28),
                      },
                    ]}
                  >
                    <ThemedText type="header" style={{ color: colors.accent }}>
                      {displayName.slice(0, 1).toUpperCase()}
                    </ThemedText>
                  </View>
                )}
                <View
                  style={[
                    styles.cameraBadge,
                    {
                      backgroundColor: colors.accent,
                      borderColor: colors.card,
                    },
                  ]}
                >
                  <SymbolView
                    name={{ ios: "camera.fill", android: "photo_camera", web: "photo_camera" }}
                    size={11}
                    tintColor={colors.accentForeground}
                  />
                </View>
              </View>
            </PressableScale>

            <View style={styles.identityBody}>
              {editing ? (
                <View style={styles.nameEdit}>
                  <TextInput
                    value={nameDraft}
                    onChangeText={setNameDraft}
                    autoFocus
                    accessibilityLabel={t("profile.editName")}
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
                  accessibilityLabel={t("profile.editName")}
                  accessibilityRole="button"
                  style={styles.nameRow}
                >
                  <ThemedText type="subtitle" numberOfLines={2} style={styles.nameText}>
                    {displayName}
                  </ThemedText>
                  <View style={[styles.editChip, { backgroundColor: colors.muted }]}>
                    <SymbolView
                      name={{ ios: "pencil", android: "edit", web: "edit" }}
                      size={13}
                      tintColor={colors.mutedForeground}
                    />
                  </View>
                </PressableScale>
              )}

              {user?.email ? (
                <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                  {user.email}
                </ThemedText>
              ) : null}

              <View
                style={[
                  styles.providerChip,
                  {
                    backgroundColor: isGuest ? colors.muted : tokens.status.success.soft,
                  },
                ]}
              >
                {providerLogo && !isGuest ? (
                  <Image source={providerLogo} style={styles.providerLogo} contentFit="contain" />
                ) : (
                  <SymbolView
                    name={{
                      ios: isGuest ? "person.fill" : "checkmark.seal.fill",
                      android: isGuest ? "person" : "verified",
                      web: isGuest ? "person" : "verified",
                    }}
                    size={12}
                    tintColor={isGuest ? colors.mutedForeground : tokens.status.success.color}
                  />
                )}
                <ThemedText
                  type="caption"
                  style={{
                    color: isGuest ? colors.mutedForeground : tokens.status.success.text,
                  }}
                >
                  {statusLabel}
                </ThemedText>
              </View>
            </View>
          </View>
          {isTV() ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.avatarHintTv}>
              {t("profile.tvAvatarHint")}
            </ThemedText>
          ) : null}
        </Card>

        {isGuest ? (
          <Card padding="three">
            <SectionHeader
              title={t("profile.signInToSync")}
              icon={{
                ios: "person.crop.circle.badge.plus",
                android: "person_add",
                web: "person_add",
              }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.signInHint}>
              {t("profile.signInHint")}
            </ThemedText>
            <View style={styles.signIn}>
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

            <View style={[styles.syncPanel, { backgroundColor: colors.muted }]}>
              <View style={styles.syncMetaRow}>
                <IconWell
                  icon={{
                    ios: syncUpToDate ? "checkmark.icloud.fill" : "icloud.fill",
                    android: syncUpToDate ? "cloud_done" : "cloud",
                    web: syncUpToDate ? "cloud_done" : "cloud",
                  }}
                  size={18}
                  well={40}
                  tint={syncUpToDate ? tokens.status.success.color : colors.accent}
                  background={
                    syncUpToDate ? tokens.status.success.soft : withAlpha(colors.accent, 0.14)
                  }
                />
                <View style={styles.syncMetaText}>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("sync.lastSynced")}
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {syncMeta?.lastSyncedAt
                      ? formatRelativeWhen(syncMeta.lastSyncedAt, locale, t, prefs.defaultCalendar)
                      : t("sync.never")}
                  </ThemedText>
                </View>
              </View>

              {syncMeta?.lastOutcomeAt ? (
                <View style={[styles.syncDetail, { borderTopColor: tokens.hairline }]}>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {syncUpToDate
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
            </View>

            <Button
              label={isSyncing ? t("sync.syncing") : t("sync.now")}
              icon={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
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

        {isAuthenticated ? (
          <Card padding="three">
            <SectionHeader
              title={t("profile.sessionTitle")}
              icon={{
                ios: "rectangle.portrait.and.arrow.right",
                android: "logout",
                web: "logout",
              }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.sessionHint}>
              {t("profile.sessionHint")}
            </ThemedText>
            <Button
              label={t("common.signOut")}
              variant="secondary"
              icon={{
                ios: "rectangle.portrait.and.arrow.right",
                android: "logout",
                web: "logout",
              }}
              fullWidth
              onPress={() => setConfirmSignOut(true)}
              style={styles.sessionButton}
            />
          </Card>
        ) : null}

        <Card padding="three" variant="muted">
          <SectionHeader title={t("profile.dangerTitle")} />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.dangerHint}>
            {t("profile.dangerHint")}
          </ThemedText>
          <View style={styles.dangerActions}>
            <PressableScale
              haptic="medium"
              accessibilityRole="button"
              accessibilityLabel={t("profile.resetData")}
              onPress={() => {
                if (!isResetting) setConfirmResetData(true);
              }}
              style={[
                styles.dangerButton,
                {
                  backgroundColor: tokens.status.danger.soft,
                  borderColor: tokens.status.danger.border,
                },
              ]}
            >
              <SymbolView
                name={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
                size={16}
                tintColor={tokens.status.danger.color}
              />
              <ThemedText type="smallBold" style={{ color: tokens.status.danger.text }}>
                {t("profile.resetData")}
              </ThemedText>
            </PressableScale>

            {isAuthenticated ? (
              <PressableScale
                haptic="medium"
                accessibilityRole="button"
                accessibilityLabel={t("profile.deleteAccount")}
                onPress={() => setConfirmDeleteAccount(true)}
                style={[
                  styles.dangerButton,
                  {
                    backgroundColor: tokens.status.danger.soft,
                    borderColor: tokens.status.danger.border,
                  },
                ]}
              >
                <SymbolView
                  name={{ ios: "trash", android: "delete", web: "delete" }}
                  size={16}
                  tintColor={tokens.status.danger.color}
                />
                <ThemedText type="smallBold" style={{ color: tokens.status.danger.text }}>
                  {t("profile.deleteAccount")}
                </ThemedText>
              </PressableScale>
            ) : null}
          </View>
        </Card>
      </Stagger>

      <ConfirmDialog
        visible={confirmSignOut}
        title={t("profile.signOutTitle")}
        message={t("profile.signOutMsg")}
        confirmLabel={t("common.signOut")}
        onConfirm={() => void signOut()}
        onClose={() => setConfirmSignOut(false)}
      />

      <ConfirmDialog
        visible={confirmResetData}
        title={t("profile.resetDataTitle")}
        message={t(isAuthenticated ? "profile.resetDataMsgAccount" : "profile.resetDataMsg")}
        confirmLabel={t("profile.resetDataConfirm")}
        destructive
        onConfirm={() => void resetAppData()}
        onClose={() => setConfirmResetData(false)}
      />

      <DeleteAccountModal
        visible={confirmDeleteAccount}
        onClose={() => setConfirmDeleteAccount(false)}
        onDeleted={() => toast.success(t("profile.deleteAccountSuccess"))}
        deleteAccount={deleteSignedInAccount}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: Spacing.three,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  identityBody: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one + 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  avatarWrap: {
    width: 80,
    height: 80,
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHintTv: {
    marginTop: Spacing.three,
  },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  nameText: {
    flex: 1,
    flexShrink: 1,
  },
  editChip: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  nameEdit: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  nameInput: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
    fontWeight: "700",
  },
  providerChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    marginTop: Spacing.half,
  },
  providerLogo: {
    width: 14,
    height: 14,
  },
  signInHint: {
    marginTop: Spacing.two,
  },
  signIn: {
    marginTop: Spacing.three,
    gap: Spacing.three,
  },
  syncPanel: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.three,
  },
  syncMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  syncMetaText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  syncDetail: {
    gap: Spacing.one,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
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
  sessionHint: {
    marginTop: Spacing.two,
  },
  sessionButton: {
    marginTop: Spacing.three,
  },
  dangerHint: {
    marginTop: Spacing.two,
  },
  dangerActions: {
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  dangerButton: {
    minHeight: 48,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
