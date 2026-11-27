import type {
  ContentReportIssueType,
  ContentReportReference,
} from "@munib-tracker/shared/types/content-report";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ContentReportAttachments } from "@/components/content-report/content-report-attachments";
import { ISSUE_TYPE_ICONS, ISSUE_TYPE_ORDER } from "@/components/content-report/issue-type-meta";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ReportAttachmentInput } from "@/lib/content-report-api";
import { isTV } from "@/lib/platform/is-tv";

const MAX_DESCRIPTION = 4000;
const MAX_CORRECTION = 4000;
const MAX_REFERENCE = 1000;
const MIN_DESCRIPTION = 10;

type ContentReportSheetProps = {
  visible: boolean;
  contentRef: ContentReportReference | null;
  submitting: boolean;
  onSubmit: (values: {
    issueType: ContentReportIssueType;
    description: string;
    suggestedCorrection: string;
    userReference: string;
    attachments: ReportAttachmentInput[];
  }) => void;
  onClose: () => void;
};

export function ContentReportSheet({
  visible,
  contentRef,
  submitting,
  onSubmit,
  onClose,
}: ContentReportSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [issueType, setIssueType] = useState<ContentReportIssueType>("incorrect_translation");
  const [description, setDescription] = useState("");
  const [suggestedCorrection, setSuggestedCorrection] = useState("");
  const [userReference, setUserReference] = useState("");
  const [attachments, setAttachments] = useState<ReportAttachmentInput[]>([]);
  const tv = isTV();

  useEffect(() => {
    if (!visible) return;
    setIssueType("incorrect_translation");
    setDescription("");
    setSuggestedCorrection("");
    setUserReference("");
    setAttachments([]);
  }, [visible]);

  const descriptionLength = description.trim().length;
  const meetsMinDescription = descriptionLength >= MIN_DESCRIPTION;
  const canSubmit = meetsMinDescription && !submitting;

  const snapshotLabel = useMemo(() => {
    if (!contentRef) return "";
    return contentRef.snapshot?.title ?? contentRef.snapshot?.reference ?? contentRef.contentId;
  }, [contentRef]);

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({
      issueType,
      description: description.trim(),
      suggestedCorrection: suggestedCorrection.trim(),
      userReference: userReference.trim(),
      attachments,
    });
  };

  return (
    <Sheet
      accessibilityLabel={t("contentReport.sheetTitle")}
      visible={visible}
      onClose={onClose}
      variant="bottom"
    >
      <ThemedText type="subtitle">{t("contentReport.sheetTitle")}</ThemedText>
      {contentRef ? (
        <View style={[styles.chip, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
            {snapshotLabel}
          </ThemedText>
        </View>
      ) : null}

      <TvScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.form}
      >
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("contentReport.issueTypeLabel")}
        </ThemedText>
        {/* TV: wrap the chips so D-pad Left/Right/Down stay predictable (no
            horizontal scroller to fight with). */}
        <TvScrollView
          horizontal={!tv}
          scrollEnabled={!tv}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.chips, tv && styles.chipsTv]}
        >
          {ISSUE_TYPE_ORDER.map((type) => {
            const selected = issueType === type;
            return (
              <PressableScale
                key={type}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setIssueType(type)}
                {...(tv && selected ? { hasTVPreferredFocus: true } : {})}
                style={[
                  styles.issueChip,
                  tv && styles.issueChipTv,
                  {
                    backgroundColor: selected ? tokens.accentSoft : colors.muted,
                    // TV: selected = soft fill + hairline; the accent ring is focus.
                    borderColor: selected
                      ? tv
                        ? tokens.accentBorder
                        : colors.accent
                      : colors.border,
                  },
                ]}
              >
                <AppIcon
                  icon={ISSUE_TYPE_ICONS[type]}
                  size={14}
                  tintColor={selected ? colors.accent : colors.mutedForeground}
                />
                <ThemedText
                  type="caption"
                  style={{ color: selected ? colors.accentText : colors.foreground }}
                >
                  {t(`contentReport.issueTypes.${type}`)}
                </ThemedText>
              </PressableScale>
            );
          })}
        </TvScrollView>

        <TextField
          label={t("contentReport.descriptionLabel")}
          required
          value={description}
          onChangeText={setDescription}
          maxLength={MAX_DESCRIPTION}
          placeholder={t("contentReport.descriptionPlaceholder")}
          helperText={
            meetsMinDescription
              ? undefined
              : t("contentReport.descriptionMinHint", { min: MIN_DESCRIPTION })
          }
          multiline
        />

        <TextField
          label={t("contentReport.correctionLabel")}
          value={suggestedCorrection}
          onChangeText={setSuggestedCorrection}
          maxLength={MAX_CORRECTION}
          placeholder={t("contentReport.correctionPlaceholder")}
          multiline
        />

        <TextField
          label={t("contentReport.sourceLabel")}
          value={userReference}
          onChangeText={setUserReference}
          maxLength={MAX_REFERENCE}
          placeholder={t("contentReport.sourcePlaceholder")}
        />

        <ContentReportAttachments attachments={attachments} onChange={setAttachments} />
      </TvScrollView>

      <View style={styles.actions}>
        <Button
          variant="primary"
          fullWidth
          label={t("contentReport.submit")}
          disabled={!canSubmit || submitting}
          onPress={submit}
        />
        <Button
          variant="ghost"
          fullWidth
          label={t("common.cancel")}
          onPress={onClose}
          disabled={submitting}
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  form: { gap: Spacing.three, paddingBottom: Spacing.two },
  chips: { gap: Spacing.two, paddingVertical: Spacing.one },
  issueChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  chipsTv: { flexWrap: "wrap" },
  issueChipTv: { minHeight: TvLayout.chipMinHeight },
  actions: {
    marginTop: Spacing.three,
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
});
