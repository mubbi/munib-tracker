import { type Href, useRouter } from "expo-router";
import { memo, Suspense, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Sheet } from "@/components/ui/sheet";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import type { AnySettingDef, ChoiceOption } from "@/lib/settings/types";
import { useSetting } from "@/lib/settings/use-setting";
import { useToast } from "@/providers/toast-provider";

import { ActionRow, DangerRow } from "./action-row";
import { ChoiceList } from "./choice-list";
import { SegmentedRow } from "./segmented-row";
import { SettingsRow, ToggleRow } from "./settings-rows";
import { StepperRow } from "./stepper-row";
import { ThisDeviceBadge } from "./this-device-badge";
import { TimeRow } from "./time-row";

/**
 * Renders any registered setting by `control.kind` (§4.5.5): toggle, segmented,
 * choice list or sheet, stepper, time, link, action or custom editor. Reads and
 * writes only through `useSetting`, so every row re-renders on its own value.
 */
export const SettingRow = memo(function SettingRow({ def }: { def: AnySettingDef }) {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { value, setValue, enabled } = useSetting<unknown>(def.id);
  const title = t(def.titleKey);
  const subtitle = def.subtitleKey ? t(def.subtitleKey) : undefined;
  const badge = def.scope === "device" ? <ThisDeviceBadge /> : undefined;
  const summary = def.summary ? def.summary(value, t) : undefined;
  const onChange = useCallback((next: unknown) => void setValue(next), [setValue]);

  const control = def.control;
  switch (control.kind) {
    case "toggle":
      return (
        <ToggleRow
          icon={def.icon}
          title={title}
          subtitle={subtitle}
          accessory={badge}
          value={value === true}
          disabled={!enabled}
          onValueChange={onChange}
        />
      );
    case "choice": {
      const items = control.options.map((o: ChoiceOption<unknown>) => ({
        value: o.value,
        label: o.label ?? (o.labelKey ? t(o.labelKey) : String(o.value)),
        description: o.descriptionKey ? t(o.descriptionKey) : undefined,
      }));
      if (control.presentation === "segmented") {
        return (
          <SegmentedRow
            title={title}
            subtitle={subtitle}
            accessory={badge}
            options={items}
            value={value}
            onChange={onChange}
            disabled={!enabled}
          />
        );
      }
      if (control.presentation === "list") {
        return (
          <View style={styles.listBlock}>
            <ThemedText type="small">{title}</ThemedText>
            {subtitle ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {subtitle}
              </ThemedText>
            ) : null}
            <ChoiceList items={items} value={value} onChange={onChange} disabled={!enabled} />
          </View>
        );
      }
      return (
        <ChoiceSheetRow
          def={def}
          title={title}
          subtitle={subtitle}
          summary={summary}
          badge={badge}
          items={items}
          value={value}
          onChange={onChange}
          disabled={!enabled}
        />
      );
    }
    case "stepper":
      return (
        <StepperRow
          title={title}
          subtitle={subtitle}
          accessory={badge}
          value={typeof value === "number" ? value : 0}
          min={control.min}
          max={control.max}
          step={control.step}
          format={(v) => control.format(v, t)}
          onChange={onChange}
          disabled={!enabled}
        />
      );
    case "time":
      return (
        <TimeRow
          icon={def.icon}
          title={title}
          subtitle={subtitle}
          accessory={badge}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          disabled={!enabled}
        />
      );
    case "link":
      return (
        <SettingsRow
          icon={def.icon}
          title={title}
          subtitle={subtitle}
          accessory={badge}
          value={summary}
          disabled={!enabled}
          onPress={() => router.push(control.href as Href)}
        />
      );
    case "action": {
      const done = () => toast.success(t(control.doneKey ?? "settingsPanel.done"));
      const run = () => void control.run().then(done, () => toast.error(t("settingsPanel.failed")));
      if (control.destructive || control.confirmKey) {
        return (
          <DangerRow
            icon={def.icon}
            title={title}
            subtitle={subtitle}
            confirmMessage={control.confirmKey ? t(control.confirmKey) : undefined}
            destructive={control.destructive === true}
            actionLabel={control.actionLabelKey ? t(control.actionLabelKey) : undefined}
            accessory={badge}
            // Async: the confirm stays busy until the action lands; a failure
            // shows inline in the dialog (retryable) instead of a toast.
            onConfirm={async () => {
              await control.run();
              done();
            }}
            errorMessage={t("settingsPanel.failed")}
            disabled={!enabled}
          />
        );
      }
      return (
        <ActionRow
          icon={def.icon}
          title={title}
          subtitle={subtitle}
          onPress={run}
          disabled={!enabled}
        />
      );
    }
    case "custom": {
      const Editor = control.Component;
      return (
        <Suspense fallback={<EditorFallback />}>
          <Editor settingId={def.id} />
        </Suspense>
      );
    }
  }
});

/** P8-04: a lazy editor loads behind a skeleton row, not a bare spinner. */
function EditorFallback() {
  return <SkeletonPlaceholder preset="rows" count={1} style={styles.fallback} />;
}

function ChoiceSheetRow({
  def,
  title,
  subtitle,
  summary,
  badge,
  items,
  value,
  onChange,
  disabled,
}: {
  def: AnySettingDef;
  title: string;
  subtitle?: string;
  summary?: string;
  badge?: React.ReactNode;
  items: { value: unknown; label: string; description?: string }[];
  value: unknown;
  onChange: (value: unknown) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SettingsRow
        icon={def.icon}
        title={title}
        subtitle={subtitle}
        accessory={badge}
        value={summary}
        disabled={disabled}
        onPress={() => setOpen(true)}
      />
      <Sheet visible={open} onClose={() => setOpen(false)} variant="bottom" title={title}>
        <TvScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetList}
          showsVerticalScrollIndicator={false}
        >
          <ChoiceList
            items={items}
            value={value}
            onChange={(next) => {
              setOpen(false);
              onChange(next);
            }}
          />
        </TvScrollView>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  listBlock: { gap: Spacing.two },
  fallback: { paddingVertical: Spacing.two },
  sheetScroll: { alignSelf: "stretch" },
  sheetList: { gap: Spacing.two, paddingBottom: Spacing.two },
});
