import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { AdhanStylePicker } from "@/components/adhan/adhan-style-picker";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { ADHAN_STYLES, adhanTrack } from "@/lib/adhan-audio";
import { useSetting } from "@/lib/settings/use-setting";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";

import { ActionRow } from "../action-row";

/** Adhan style list; picking one previews it so the choice is audible at once. */
export function AdhanStyleControl({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const audio = useAudioPlayerContext();
  const { value, setValue, def } = useSetting<string>(settingId);
  if (ADHAN_STYLES.length < 2) return null;
  return (
    <View style={styles.block}>
      <ThemedText type="small">{t(def.titleKey)}</ThemedText>
      <AdhanStylePicker
        value={value}
        onChange={(id) => {
          void setValue(id);
          audio.play([adhanTrack(id)], 0, { sourceHref: "/settings/notifications" });
        }}
      />
    </View>
  );
}

/** "Preview adhan" — an action row (no chevron). */
export function AdhanPreviewRow({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const audio = useAudioPlayerContext();
  const { def } = useSetting<null>(settingId);
  const style = useSetting<string>("notifications.salah.adhanStyle");
  return (
    <ActionRow
      icon={{ ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }}
      title={t(def.titleKey)}
      subtitle={def.subtitleKey ? t(def.subtitleKey) : undefined}
      onPress={() =>
        audio.play([adhanTrack(style.value)], 0, { sourceHref: "/settings/notifications" })
      }
    />
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
});
