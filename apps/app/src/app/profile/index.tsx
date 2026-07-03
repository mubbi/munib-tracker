import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TextInput, View } from "react-native";

import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { resetDatabase } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useAuth } from "@/providers/auth-provider";
import {
  preferencesStore,
  usePreferences,
  usePreferencesActions,
} from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { user, isAuthenticated, signOut } = useAuth();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();

  const displayName = prefs.displayName ?? user?.displayName ?? t("profile.guestName");
  // Treat anyone who isn't a fully linked account (a real guest session OR an
  // offline/null session) as a guest so they can still link a provider.
  const isGuest = !isAuthenticated;
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    await resetDatabase();
    await preferencesStore.getState().load();
    await trackerStore.getState().load();
    await signOut();
    router.replace("/");
  };

  return (
    <ScreenLayout
      eyebrow={t("profile.eyebrow")}
      title={t("profile.title")}
      subtitle={t("profile.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Stagger>
        <Card style={styles.hero}>
          <PressableScale
            haptic="light"
            onPress={pickAvatar}
            accessibilityLabel={t("profile.changeAvatar")}
          >
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
        message={t("profile.deleteMsg")}
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
});
