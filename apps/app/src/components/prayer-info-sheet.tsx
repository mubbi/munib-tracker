import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconWell } from "@/components/ui/icon-well";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  hadithCollectionId,
  hadithExcerpt,
  PRAYER_INFO,
  type PrayerInfoId,
  type PrayerInfoReference,
  resolveHadithItem,
} from "@/lib/prayer-info";
import { scheduleEntryIcon } from "@/lib/schedule-ui";

type PrayerInfoSheetProps = {
  visible: boolean;
  prayerId: PrayerInfoId | null;
  onClose: () => void;
};

function ReferenceCard({
  reference,
  onNavigate,
}: {
  reference: PrayerInfoReference;
  onNavigate: (href: Href) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  if (reference.type === "quran") {
    const label = t("quran.ayahRef", { surah: reference.surah, ayah: reference.ayah });
    return (
      <View style={[styles.refCard, { backgroundColor: colors.muted }]}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("prayerInfo.quranRef")}
        </ThemedText>
        <ThemedText type="smallBold">{label}</ThemedText>
        <Button
          label={t("prayerInfo.viewAyah")}
          variant="secondary"
          size="sm"
          trailingIcon={{ ios: "arrow.up.right", android: "open_in_new", web: "open_in_new" }}
          onPress={() =>
            onNavigate({
              pathname: "/quran/[surah]",
              params: { surah: String(reference.surah), ayah: String(reference.ayah) },
            })
          }
        />
      </View>
    );
  }

  const hadith = resolveHadithItem(reference.id);
  if (!hadith) return null;

  return (
    <View style={[styles.refCard, { backgroundColor: colors.muted }]}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {hadith.reference}
      </ThemedText>
      <ThemedText type="small" themeColor="foreground">
        {hadithExcerpt(hadith)}
      </ThemedText>
      <Button
        label={t("prayerInfo.viewHadith")}
        variant="secondary"
        size="sm"
        trailingIcon={{ ios: "arrow.up.right", android: "open_in_new", web: "open_in_new" }}
        onPress={() =>
          onNavigate({
            pathname: "/hadith/[collection]",
            params: {
              collection: hadithCollectionId(reference.id),
              q: hadith.reference,
            },
          })
        }
        style={{ borderColor: tokens.hairline }}
      />
    </View>
  );
}

export function PrayerInfoSheet({ visible, prayerId, onClose }: PrayerInfoSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const router = useRouter();

  if (!prayerId) return null;

  const entry = PRAYER_INFO[prayerId];
  const icon = scheduleEntryIcon(prayerId);

  const navigate = (href: Href) => {
    onClose();
    router.push(href);
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        bounces={false}
      >
        <View style={styles.header}>
          <IconWell
            icon={icon}
            size={18}
            well={40}
            tint={colors.accent}
            background={tokens.accentSoft}
          />
          <ThemedText type="subtitle">{t(`prayers.${prayerId}`)}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="accent">
            {t("prayerInfo.about")}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t(`prayerInfo.${prayerId}.summary`)}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="accent">
            {t("prayerInfo.why")}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t(`prayerInfo.${prayerId}.why`)}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="accent">
            {t("prayerInfo.benefits")}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t(`prayerInfo.${prayerId}.benefits`)}
          </ThemedText>
        </View>

        {entry?.refs.length ? (
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="accent">
              {t("prayerInfo.references")}
            </ThemedText>
            <View style={styles.refs}>
              {entry.refs.map((ref) => (
                <ReferenceCard
                  key={ref.type === "hadith" ? ref.id : `quran-${ref.surah}-${ref.ayah}`}
                  reference={ref}
                  onNavigate={navigate}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    marginBottom: Spacing.one,
  },
  section: {
    gap: Spacing.one + 2,
  },
  refs: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  refCard: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
});
