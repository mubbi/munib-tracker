import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { EvidenceCard, type EvidenceItem } from "@/components/records/evidence-card";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { SCREEN_DIFFERENCES } from "@/lib/fiqh/screen-differences";

const MIRATH_DIFFERENCES = SCREEN_DIFFERENCES["/mirath"];

/** Cases the engine does not model (docs/proofs/mirath.md) — shown so users know to ask. */
const OUT_OF_SCOPE = [
  "unborn",
  "missing",
  "simultaneous",
  "khuntha",
  "wala",
  "deeper",
  "kindred",
] as const;

/** Evidence card (docs/proofs/mirath.md §1) — Qur'an refs deep-link; hadith lines are citations. */
export const MIRATH_EVIDENCE: readonly EvidenceItem[] = [
  { key: "mirath.evidence.children", quran: { surah: 4, ayah: 11 } },
  { key: "mirath.evidence.spouses", quran: { surah: 4, ayah: 12 } },
  { key: "mirath.evidence.siblings", quran: { surah: 4, ayah: 176 } },
  { key: "mirath.evidence.residue" },
  { key: "mirath.evidence.religion" },
  { key: "mirath.evidence.killer" },
];

/** Reference cards under the calculator: madhhab differences, out-of-scope cases, evidence. */
export function MirathReference() {
  const { t } = useTranslation();
  return (
    <>
      {/* Advanced fiqh detail: collapsed so the calculator stays the focus. */}
      <Card padding="three">
        <CollapsibleSection
          title={t("mirath.differences.title")}
          icon={{ ios: "book.closed", android: "menu_book", web: "menu_book" }}
        >
          <View style={styles.list}>
            {MIRATH_DIFFERENCES.map((id) => (
              <MadhhabNote key={id} id={id} />
            ))}
          </View>
        </CollapsibleSection>
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("mirath.outOfScope.title")}
          icon={{
            ios: "person.fill.questionmark",
            android: "contact_support",
            web: "contact_support",
          }}
        />
        <View style={styles.list}>
          {OUT_OF_SCOPE.map((k) => (
            <ThemedText key={k} type="small">
              {`• ${t(`mirath.outOfScope.${k}`)}`}
            </ThemedText>
          ))}
          <ThemedText type="smallBold">{t("mirath.outOfScope.consult")}</ThemedText>
        </View>
      </Card>

      <EvidenceCard titleKey="mirath.evidence.title" items={MIRATH_EVIDENCE} />
    </>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.three, marginTop: Spacing.three },
});
