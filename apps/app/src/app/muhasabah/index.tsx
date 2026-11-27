import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MuhasabahFlow } from "@/components/muhasabah/muhasabah-flow";
import { ScreenLayout } from "@/components/screen-layout";
import { EvidenceLinks, type EvidenceRef } from "@/components/self-review/evidence-links";
import { PhoneOnlyNotice } from "@/components/self-review/phone-only-notice";
import { Seo } from "@/components/seo/seo";
import { Button } from "@/components/ui/button";
import { VaultLockGate } from "@/components/vault";
import { Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * Evidence by reference (docs/proofs/muhasabah.md). Umar's saying is an athar
 * that al-Tirmidhi records without a chain after hadith 2459 — labelled as his
 * statement, not a hadith; the hadith link opens that entry in the corpus.
 */
export const MUHASABAH_EVIDENCE: readonly EvidenceRef[] = [
  { kind: "quran", surah: 59, ayah: 18, labelKey: "muhasabah.evidence.quran" },
  { kind: "hadith", collection: "tirmidhi", number: "2459", labelKey: "muhasabah.evidence.umar" },
  {
    kind: "hadith",
    collection: "bukhari",
    number: "6306",
    labelKey: "muhasabah.evidence.istighfar",
  },
];

export default function MuhasabahScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tv = isTV();

  return (
    <ScreenLayout
      eyebrow={t("muhasabah.eyebrow")}
      title={t("muhasabah.title")}
      subtitle={t("muhasabah.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/muhasabah" />
      {tv ? (
        <PhoneOnlyNotice />
      ) : (
        <VaultLockGate>
          <View style={styles.stack}>
            <MuhasabahFlow />
            <View style={styles.links}>
              <Button
                label={t("muhasabah.historyLink")}
                variant="ghost"
                size="sm"
                onPress={() => router.push("/muhasabah/history")}
              />
              <Button
                label={t("muhasabah.settingsLink")}
                variant="ghost"
                size="sm"
                onPress={() => router.push("/muhasabah/settings")}
              />
            </View>
            <EvidenceLinks
              titleKey="muhasabah.evidence.title"
              introKey="muhasabah.evidence.intro"
              refs={MUHASABAH_EVIDENCE}
            />
          </View>
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  links: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/muhasabah");
