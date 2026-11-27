import { FIQH_DIFFERENCE_IDS, getFiqhDifference } from "@munib-tracker/shared/fiqh";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { SCHOOLS_DIFFER_ICON } from "@/components/fiqh/guide-madhhab-notes";
import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  type DifferenceRefView,
  differenceEvidence,
  differenceFromSlug,
  differenceGuideLinks,
  differenceSlug,
} from "@/lib/fiqh/difference-detail";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export function generateStaticParams(): Array<{ id: string }> {
  return FIQH_DIFFERENCE_IDS.map((id) => ({ id: differenceSlug(id) }));
}

function RefRow({ refView }: { refView: DifferenceRefView }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { link } = refView;
  const text = (
    <View style={styles.refRow}>
      <ThemedText type="small" style={link ? { color: colors.accentText } : undefined}>
        {refView.label}
      </ThemedText>
      {refView.disputed ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("fiqhRetrofit.detail.gradeDisputed")}
        </ThemedText>
      ) : null}
    </View>
  );
  if (!link) return text;
  return (
    <PressableScale
      accessibilityRole="link"
      accessibilityLabel={refView.label}
      onPress={() => router.push(link as Href)}
      scaleTo={0.98}
    >
      {text}
    </PressableScale>
  );
}

function RefList({ refs }: { refs: DifferenceRefView[] }) {
  return (
    <View style={styles.refs}>
      {refs.map((ref) => (
        <RefRow key={ref.key} refView={ref} />
      ))}
    </View>
  );
}

/**
 * NF-3.0a difference detail — the target of search hits for the fiqh catalog
 * ("witr wajib", "qasr distance"): the user's school (or all views) via
 * `MadhhabNote`, every school's evidence, and links into the guides.
 */
export default function FiqhDifferenceScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { maxContentWidth } = useLearnWideLayout();
  const { id: slug } = useLocalSearchParams<{ id: string }>();
  const id = differenceFromSlug(slug);
  const diff = id ? getFiqhDifference(id) : null;
  const evidence = useMemo(() => (diff ? differenceEvidence(diff, t) : null), [diff, t]);
  const guideLinks = useMemo(() => (id ? differenceGuideLinks(id) : []), [id]);
  const title = diff ? t(diff.titleKey) : t("fiqhRetrofit.detail.eyebrow");
  const path = id ? `/fiqh/${differenceSlug(id)}` : "/fiqh";

  return (
    <ScreenLayout
      eyebrow={t("fiqhRetrofit.detail.eyebrow")}
      title={title}
      subtitle={t("fiqhRetrofit.detail.subtitle")}
      onBack={() => goBackOrReplace(router, "/library" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo
        path={path}
        title={title}
        description={t("fiqhRetrofit.detail.subtitle")}
        index={!!diff}
      />
      {!diff || !evidence || !id ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("fiqhRetrofit.detail.notFound")}
          actionLabel={t("fiqhRetrofit.detail.backToLibrary")}
          onAction={() => router.replace("/library")}
        />
      ) : (
        <Stagger>
          <MadhhabNote id={id} defaultExpanded />

          <Card>
            <SectionHeader title={t("fiqhRetrofit.detail.evidence")} icon={SCHOOLS_DIFFER_ICON} />
            <View style={styles.evidence}>
              {evidence.shared.length ? <RefList refs={evidence.shared} /> : null}
              {evidence.bySchool.map(({ school, refs }) => (
                <View key={school} style={styles.school}>
                  <ThemedText type="label">{t(`fiqh.school.${school}`)}</ThemedText>
                  <RefList refs={refs} />
                </View>
              ))}
            </View>
          </Card>

          {guideLinks.length ? (
            <Card>
              <SectionHeader
                title={t("fiqhRetrofit.detail.readInGuide")}
                icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              />
              <View style={styles.links}>
                {guideLinks.map((link) => (
                  <Button
                    key={link.href}
                    label={link.title}
                    variant="secondary"
                    fullWidth
                    onPress={() => router.push(link.href as Href)}
                  />
                ))}
              </View>
            </Card>
          ) : null}

          <TvReadableBlock>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("fiqh.disclaimer")}
            </ThemedText>
          </TvReadableBlock>
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  evidence: { gap: Spacing.three, marginTop: Spacing.three },
  school: { gap: Spacing.one },
  refs: { gap: Spacing.one },
  refRow: { gap: Spacing.half, paddingVertical: Spacing.half },
  links: { gap: Spacing.two, marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/fiqh/[id]");
