import * as Application from "expo-application";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { type Href, useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Control, Spacing } from "@/constants/theme";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { restorableSharePath } from "@/lib/app-links";
import {
  checkDeferredInvite,
  type DeferredInvite,
  type DeferredInviteDeps,
} from "@/lib/deferred-invite";
import { deferredOnboardingStore } from "@/lib/onboarding/deferred-onboarding";
import { isTV } from "@/lib/platform/is-tv";
import { useToast } from "@/providers/toast-provider";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";

function nativeDeps(): DeferredInviteDeps {
  return {
    os: Platform.OS === "android" ? "android" : Platform.OS === "ios" ? "ios" : "other",
    alreadyChecked: () => readJSON<boolean>(DB_KEYS.deferredInviteChecked, false),
    markChecked: () => writeJSON(DB_KEYS.deferredInviteChecked, true),
    installedAt: () => Application.getInstallationTimeAsync(),
    now: () => Date.now(),
    initialUrlPath: async () => {
      const url = await Linking.getInitialURL();
      return url ? (Linking.parse(url).path ?? null) || null : null;
    },
    installReferrer: () => Application.getInstallReferrerAsync(),
    clipboardHasContent: async () =>
      (await Clipboard.hasUrlAsync().catch(() => false)) || (await Clipboard.hasStringAsync()),
  };
}

/**
 * First launch after installing from a shared / QR link (see `lib/deferred-invite.ts`):
 * opens the invite the user came for. Android reads the Play Install Referrer;
 * iOS offers the system Paste button for the link the web page copied.
 * Mounted once in the root overlays; native phones only.
 */
export function DeferredInviteHost() {
  if (Platform.OS === "web" || isTV()) return null;
  return <DeferredInviteRestorer />;
}

function DeferredInviteRestorer() {
  const router = useRouter();
  const navReady = Boolean(useRootNavigationState()?.key);
  const prefsReady = usePreferencesReady();
  const onboarded = usePreferences().hasCompletedOnboarding === true;
  const [askPaste, setAskPaste] = useState(false);
  const ran = useRef(false);

  const open = (path: string) => {
    // A restored invite defers onboarding exactly like an App Link would.
    deferredOnboardingStore.setState({ deferred: true });
    router.replace(path as Href);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: one check per launch once ready.
  useEffect(() => {
    if (ran.current || !navReady || !prefsReady || onboarded) return;
    ran.current = true;
    void checkDeferredInvite(nativeDeps()).then((invite: DeferredInvite | null) => {
      if (invite?.kind === "open") open(invite.path);
      else if (invite?.kind === "askPaste") setAskPaste(true);
    });
  }, [navReady, prefsReady, onboarded]);

  return (
    <PasteInviteSheet
      visible={askPaste}
      onClose={() => setAskPaste(false)}
      onPath={(path) => {
        setAskPaste(false);
        // Let the sheet's Modal dismiss before the route changes underneath it.
        setTimeout(() => open(path), 0);
      }}
    />
  );
}

/** iOS: "Came from an invite?" with the system Paste control (no paste prompt). */
function PasteInviteSheet({
  visible,
  onClose,
  onPath,
}: {
  visible: boolean;
  onClose: () => void;
  onPath: (path: string) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const toast = useToast();

  const handleText = (text: string | null | undefined) => {
    const path = restorableSharePath(text);
    if (path) {
      onPath(path);
      return;
    }
    onClose();
    toast.info(t("deferredInvite.notALink"));
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={t("deferredInvite.title")}>
      <View style={styles.body}>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("deferredInvite.body")}
        </ThemedText>
        {Clipboard.isPasteButtonAvailable ? (
          <Clipboard.ClipboardPasteButton
            testID="deferred-invite-paste"
            acceptedContentTypes={["plain-text"]}
            backgroundColor={colors.accent}
            foregroundColor={colors.accentForeground}
            cornerStyle="large"
            displayMode="iconAndLabel"
            style={styles.paste}
            onPress={(data) => handleText(data.type === "text" ? data.text : null)}
          />
        ) : (
          // iOS < 16: reading asks for permission, but only after this explicit tap.
          <Button
            label={t("deferredInvite.paste")}
            icon={{ ios: "doc.on.clipboard", android: "content_paste", web: "content_paste" }}
            onPress={() => void Clipboard.getStringAsync().then(handleText)}
            fullWidth
          />
        )}
        <Button variant="ghost" label={t("deferredInvite.notNow")} onPress={onClose} fullWidth />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.three },
  // UIPasteControl needs an explicit size; corners come from `cornerStyle`.
  paste: { height: Control.lg, width: "100%" },
});
