import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Fonts, Spacing } from "@/constants/theme";
import {
  ARABIC_FONT_OPTIONS,
  arabicReadingLayout,
  resolveArabicLineHeight,
} from "@/lib/reading-typography";
import {
  clearReadingOverride,
  READING_SURFACE_TITLE_KEYS,
  READING_SURFACES,
} from "@/lib/settings/defs/fonts";
import { useSetting } from "@/lib/settings/use-setting";
import { usePreferences } from "@/stores/preferences-store";

import { ActionRow } from "../action-row";
import { ChoiceList } from "../choice-list";

/** Arabic typeface list with a live sample per face. */
export function ArabicTypefacePicker({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const { value, setValue, def } = useSetting<string>(settingId);

  // Register the picker faces only when this editor opens (keeps TTFs out of `__common`).
  useEffect(() => {
    void (async () => {
      const [{ ARABIC_FONT_FILES }, Font] = await Promise.all([
        import("@/lib/arabic-font-files"),
        import("expo-font"),
      ]);
      await Font.loadAsync({ ...ARABIC_FONT_FILES });
    })().catch(() => {
      // Falls back to the system face until the files load.
    });
  }, []);

  return (
    <View style={styles.block}>
      <ThemedText type="small">{t(def.titleKey)}</ThemedText>
      <ChoiceList
        items={ARABIC_FONT_OPTIONS.map((o) => ({ value: o.id, label: t(o.labelKey) }))}
        value={value}
        onChange={(id) => void setValue(id)}
      />
      {def.subtitleKey ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(def.subtitleKey)}
        </ThemedText>
      ) : null}
      <View style={styles.samples} accessibilityElementsHidden importantForAccessibility="no">
        {ARABIC_FONT_OPTIONS.filter((o) => o.id === value).map((o) => (
          <ThemedText
            key={o.id}
            style={[
              arabicReadingLayout(22),
              {
                fontFamily: o.fontFamily ?? Fonts.serif,
                lineHeight: resolveArabicLineHeight(22, o.id),
              },
            ]}
          >
            بِسْمِ اللَّهِ
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

/** Live preview of the chosen Arabic / translation sizes. */
export function FontPreview() {
  const { t } = useTranslation();
  const prefs = usePreferences();
  const arabicSize = prefs.fontPrefs.arabic.size ?? 28;
  const translationSize = prefs.fontPrefs.translation.size ?? 16;
  return (
    <Card padding="four" variant="muted" style={styles.preview}>
      <ThemedText type="label" themeColor="mutedForeground">
        {t("fonts.preview")}
      </ThemedText>
      <ThemedText type="arabic" style={arabicReadingLayout(arabicSize)}>
        سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
      </ThemedText>
      <ThemedText style={{ fontSize: translationSize, lineHeight: translationSize * 1.5 }}>
        {t("fonts.sampleTranslation")}
      </ThemedText>
    </Card>
  );
}

function deltaLabel(n: number | undefined): string {
  const v = n ?? 0;
  return v > 0 ? `+${v}` : `${v}`;
}

/**
 * "Per-screen text sizes": every reading surface's A−/A+ adjustment with its own
 * reset. "Reset all text sizes" is the registry action below this editor.
 */
export function ReadingSizeOverrides() {
  const { t } = useTranslation();
  const prefs = usePreferences();
  const overrides = prefs.fontPrefs.readingOverrides ?? {};
  return (
    <View style={styles.block}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("settingsPanel.perScreenSizesSub")}
      </ThemedText>
      {READING_SURFACES.map((surface) => {
        const o = overrides[surface];
        const custom = !!o && ((o.arabicDelta ?? 0) !== 0 || (o.textDelta ?? 0) !== 0);
        const value = custom
          ? t("settingsPanel.sizeDeltas", {
              arabic: deltaLabel(o?.arabicDelta),
              text: deltaLabel(o?.textDelta),
            })
          : t("reading.sizeDefault");
        return (
          <ActionRow
            key={surface}
            title={t(READING_SURFACE_TITLE_KEYS[surface])}
            subtitle={custom ? t("settingsPanel.tapToReset") : undefined}
            value={value}
            disabled={!custom}
            onPress={() => void clearReadingOverride(surface)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  samples: { alignItems: "center" },
  preview: { gap: Spacing.two },
});
