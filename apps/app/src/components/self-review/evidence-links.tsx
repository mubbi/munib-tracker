import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContentInlineLink } from "@/components/content/content-inline-link";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";

/**
 * Evidence for a feature, by reference only (plan §2.1): each row is an i18n
 * label plus a link into the Qur'an reader or the hadith collection — no
 * scripture text is typed here. Hadith links use the app corpus number (see
 * the feature's proof log in `docs/proofs/`).
 */
export type EvidenceRef =
  | { kind: "quran"; surah: number; ayah: number; labelKey: string }
  | { kind: "hadith"; collection: string; number: string; labelKey: string };

export function evidenceHref(ref: EvidenceRef): Href {
  if (ref.kind === "quran") {
    return {
      pathname: "/quran/[surah]",
      params: { surah: String(ref.surah), ayah: String(ref.ayah) },
    } as Href;
  }
  return {
    pathname: "/hadith/[collection]",
    params: { collection: ref.collection, q: ref.number },
  } as Href;
}

export function EvidenceLinks({
  titleKey,
  introKey,
  refs,
}: {
  titleKey: string;
  introKey?: string;
  refs: readonly EvidenceRef[];
}) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Card padding="three">
      <SectionHeader
        title={t(titleKey)}
        icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
      />
      <View style={styles.body}>
        {introKey ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t(introKey)}
          </ThemedText>
        ) : null}
        {refs.map((ref) => (
          <ContentInlineLink
            key={ref.labelKey}
            layout="list"
            label={t(ref.labelKey)}
            onPress={() => router.push(evidenceHref(ref))}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
});
