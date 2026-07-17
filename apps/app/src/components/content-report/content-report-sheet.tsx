import type {
  ContentReportIssueType,
  ContentReportReference,
} from "@munib-tracker/shared/types/content-report";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

import { ContentReportAttachments } from "@/components/content-report/content-report-attachments";
import { ISSUE_TYPE_ICONS, ISSUE_TYPE_ORDER } from "@/components/content-report/issue-type-meta";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ReportAttachmentInput } from "@/lib/content-report-api";

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
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <ThemedText type="subtitle">{t("contentReport.sheetTitle")}</ThemedText>
      {contentRef ? (
        <View style={[styles.chip, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
            {snapshotLabel}
          </ThemedText>
        </View>
      ) : null}

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.form}
      >
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("contentReport.issueTypeLabel")}
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {ISSUE_TYPE_ORDER.map((type) => {
            const selected = issueType === type;
            return (
              <PressableScale
                key={type}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setIssueType(type)}
                style={[
                  styles.issueChip,
                  {
                    backgroundColor: selected ? tokens.accentSoft : colors.muted,
                    borderColor: selected ? colors.accent : colors.border,
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
        </ScrollView>

        <Field label={t("contentReport.descriptionLabel")} required>
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text.slice(0, MAX_DESCRIPTION))}
            placeholder={t("contentReport.descriptionPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.multiline, fieldStyle(colors)]}
          />
          <View style={styles.fieldMeta}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {description.length}/{MAX_DESCRIPTION}
            </ThemedText>
            {!meetsMinDescription ? (
              <ThemedText type="caption" style={{ color: colors.accent }}>
                {t("contentReport.descriptionMinHint", { min: MIN_DESCRIPTION })}
              </ThemedText>
            ) : null}
          </View>
        </Field>

        <Field label={t("contentReport.correctionLabel")}>
          <TextInput
            value={suggestedCorrection}
            onChangeText={(text) => setSuggestedCorrection(text.slice(0, MAX_CORRECTION))}
            placeholder={t("contentReport.correctionPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.multiline, fieldStyle(colors)]}
          />
        </Field>

        <Field label={t("contentReport.sourceLabel")}>
          <TextInput
            value={userReference}
            onChangeText={(text) => setUserReference(text.slice(0, MAX_REFERENCE))}
            placeholder={t("contentReport.sourcePlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, fieldStyle(colors)]}
          />
        </Field>

        <ContentReportAttachments attachments={attachments} onChange={setAttachments} />
      </ScrollView>

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

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  const { colors } = useThemeTokens();
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabel}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {label}
        </ThemedText>
        {required ? (
          <ThemedText type="caption" style={{ color: colors.accent }}>
            *
          </ThemedText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function fieldStyle(colors: { foreground: string; muted: string; border: string }) {
  return {
    color: colors.foreground,
    backgroundColor: colors.muted,
    borderColor: colors.border,
  };
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
    borderWidth: StyleSheet.hairlineWidth,
  },
  field: { gap: Spacing.one },
  fieldLabel: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  fieldMeta: { gap: Spacing.half },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  multiline: { minHeight: 96 },
  actions: {
    marginTop: Spacing.three,
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
});
