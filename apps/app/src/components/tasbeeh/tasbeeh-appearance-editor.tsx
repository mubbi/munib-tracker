import type {
  TasbeehAppearance,
  TasbeehDesignId,
  TasbeehHapticsLevel,
  TasbeehMisbahaAppearance,
} from "@munib-tracker/shared/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

import { TasbeehFace } from "@/components/tasbeeh/faces/tasbeeh-face";
import { TasbeehDesignNote } from "@/components/tasbeeh/tasbeeh-design-note";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stepper } from "@/components/ui/stepper";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { gradientBackground } from "@/lib/gradient";
import { isHapticsEnabled } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";
import {
  availableDesigns,
  FINGER_LAYOUTS,
  PEBBLE_ITEMS,
  type ResolvedTasbeehAppearance,
  resolveSoundPack,
} from "@/lib/tasbeeh/designs";
import {
  applyPreset,
  BEAD_SHAPES,
  beadGradient,
  COLOR_NAMES,
  MATERIAL_IDS,
  materialFor,
  PRESETS,
  SPACER_STYLES,
  TASSEL_COLORS,
  TASSEL_STYLES,
  THREAD_COLORS,
} from "@/lib/tasbeeh/materials";
import { previewTasbeehSound } from "@/lib/tasbeeh/sound";
import { TASBEEH_SOUND_PACKS } from "@/lib/tasbeeh/sound-packs";
import {
  updateTasbeehAppearance,
  useTasbeehAppearance,
} from "@/lib/tasbeeh/use-tasbeeh-appearance";

const PREVIEW_SIZE = 84;
const STAGE_PREVIEW = 156;
const DEMO_TARGET = 33;

/**
 * The shared "Counter style" editor (NF-3.19), used by the counter's style
 * sheet and Settings › Tasbeeh counter. Every change applies at once (no Save
 * button) through the synced preferences entity.
 */
export function TasbeehAppearanceEditor() {
  const { t } = useTranslation();
  const appearance = useTasbeehAppearance();
  const tv = isTV();
  const designs = availableDesigns({ tv });
  const [hovered, setHovered] = useState<TasbeehDesignId | null>(null);
  const [demoCount, setDemoCount] = useState(7);
  const update = (patch: Partial<TasbeehAppearance>) => void updateTasbeehAppearance(patch);
  const updateMisbaha = (patch: Partial<TasbeehMisbahaAppearance>) =>
    update({ misbaha: { ...appearance.misbaha, ...patch } });

  const previewAppearance: ResolvedTasbeehAppearance = {
    ...appearance,
    design: hovered ?? appearance.design,
  };
  const hapticsSupported = (Platform.OS === "ios" || Platform.OS === "android") && !tv;

  return (
    <View style={styles.root}>
      {/* Live stage preview: tap to try the selected (or hovered, on web) design. */}
      <PressableScale
        haptic={false}
        accessibilityRole="button"
        accessibilityLabel={t("tasbeehDesigns.previewHint")}
        onPress={() => setDemoCount((c) => (c >= DEMO_TARGET ? 0 : c + 1))}
        style={styles.stagePreview}
      >
        <TasbeehFace
          count={demoCount}
          target={DEMO_TARGET}
          complete={demoCount >= DEMO_TARGET}
          size={STAGE_PREVIEW}
          tv={tv}
          reduceMotion
          appearance={previewAppearance}
          onCount={() => {}}
          preview
        />
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("tasbeehDesigns.previewHint")}
        </ThemedText>
      </PressableScale>

      <Section title={t("tasbeehDesigns.sections.design")}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {designs.map((design) => (
            <DesignCard
              key={design.id}
              id={design.id}
              selected={appearance.design === design.id}
              appearance={{ ...appearance, design: design.id }}
              onSelect={() => update({ design: design.id })}
              onHover={setHovered}
            />
          ))}
        </ScrollView>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(`tasbeehDesigns.designs.${appearance.design}.desc`)}
        </ThemedText>
      </Section>

      {appearance.design === "misbaha" ? (
        <MisbahaOptions misbaha={appearance.misbaha} tv={tv} onChange={updateMisbaha} />
      ) : null}

      {appearance.design === "clicker" ? (
        <Section title={t("tasbeehDesigns.sections.display")}>
          <ChoiceChips
            label={t("tasbeehDesigns.clicker.backlight")}
            value={appearance.clicker.backlight}
            options={(["green", "amber", "mono"] as const).map((id) => ({
              id,
              label: t(`tasbeehDesigns.clicker.${id}`),
            }))}
            onChange={(backlight) => update({ clicker: { backlight } })}
          />
        </Section>
      ) : null}

      {appearance.design === "pebbles" ? (
        <Section title={t("tasbeehDesigns.sections.display")}>
          <ChoiceChips
            label={t("tasbeehDesigns.pebbles.item")}
            value={appearance.pebbles.item}
            options={PEBBLE_ITEMS.map((id) => ({ id, label: t(`tasbeehDesigns.pebbles.${id}`) }))}
            onChange={(item) => update({ pebbles: { item } })}
          />
        </Section>
      ) : null}

      {appearance.design === "fingers" ? (
        <Section title={t("tasbeehDesigns.sections.display")}>
          <ChoiceChips
            label={t("tasbeehDesigns.fingers.layout")}
            value={appearance.fingers.layout}
            options={FINGER_LAYOUTS.map((id) => ({
              id,
              label: t(`tasbeehDesigns.fingers.${id}`),
            }))}
            onChange={(layout) => update({ fingers: { layout } })}
          />
        </Section>
      ) : null}

      <TasbeehDesignNote design={appearance.design} />

      <SoundSection appearance={appearance} onChange={update} />

      {hapticsSupported ? (
        <Section title={t("tasbeehDesigns.sections.haptics")}>
          <SegmentedControl<TasbeehHapticsLevel>
            options={(["off", "subtle", "rich"] as const).map((id) => ({
              id,
              label: t(`tasbeehDesigns.haptics.${id}`),
            }))}
            value={appearance.haptics}
            onChange={(haptics) => update({ haptics })}
          />
          {!isHapticsEnabled() ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("tasbeehDesigns.haptics.globalOff")}
            </ThemedText>
          ) : null}
        </Section>
      ) : null}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold">{title}</ThemedText>
      {children}
    </View>
  );
}

function DesignCard({
  id,
  selected,
  appearance,
  onSelect,
  onHover,
}: {
  id: TasbeehDesignId;
  selected: boolean;
  appearance: ResolvedTasbeehAppearance;
  onSelect: () => void;
  onHover: (id: TasbeehDesignId | null) => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const tv = isTV();
  const name = t(`tasbeehDesigns.designs.${id}.name`);
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityHint={t(`tasbeehDesigns.designs.${id}.desc`)}
      accessibilityState={{ selected }}
      onPress={onSelect}
      onHoverIn={() => onHover(id)}
      onHoverOut={() => onHover(null)}
      {...(tv && selected ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.card,
        tv && styles.cardTv,
        {
          backgroundColor: selected ? tokens.accentSoft : colors.muted,
          borderColor: selected ? colors.accent : "transparent",
        },
      ]}
    >
      <View style={styles.cardPreview} pointerEvents="none">
        <TasbeehFace
          count={7}
          target={DEMO_TARGET}
          complete={false}
          size={PREVIEW_SIZE}
          tv={tv}
          reduceMotion
          appearance={appearance}
          onCount={() => {}}
          preview
        />
      </View>
      <ThemedText type="smallBold" numberOfLines={1}>
        {name}
      </ThemedText>
    </PressableScale>
  );
}

type Choice<T extends string | number> = { id: T; label: string; swatch?: string };

function ChoiceChips<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Choice<T>[];
  onChange: (value: T) => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  return (
    <View style={styles.choiceGroup}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
      <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <PressableScale
              key={String(option.id)}
              haptic="selection"
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ selected, checked: selected }}
              onPress={() => onChange(option.id)}
              style={[
                styles.chip,
                tv && styles.chipTv,
                {
                  backgroundColor: selected ? tokens.accentSoft : colors.muted,
                  borderColor: selected ? colors.accent : tokens.hairline,
                },
              ]}
            >
              {option.swatch ? (
                <View
                  style={[
                    styles.swatch,
                    { borderColor: withAlpha(colors.foreground, 0.25) },
                    gradientBackground(option.swatch),
                  ]}
                />
              ) : null}
              <ThemedText
                type="smallBold"
                style={{ color: selected ? colors.accentText : colors.foreground }}
              >
                {option.label}
              </ThemedText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

function solidSwatch(color: string): string {
  return `linear-gradient(0deg, ${color} 0%, ${color} 100%)`;
}

function MisbahaOptions({
  misbaha,
  tv,
  onChange,
}: {
  misbaha: TasbeehMisbahaAppearance;
  tv: boolean;
  onChange: (patch: Partial<TasbeehMisbahaAppearance>) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const swatchFor = (material: string) => beadGradient(materialFor(material, colors.accent));
  return (
    <Section title={t("tasbeehDesigns.sections.beads")}>
      <ChoiceChips
        label={t("tasbeehDesigns.preset")}
        value={misbaha.preset}
        options={PRESETS.map((preset) => ({
          id: preset.id,
          label: t(`tasbeehDesigns.presets.${preset.id}`),
          swatch: swatchFor(preset.material),
        }))}
        onChange={(preset) => onChange(applyPreset(misbaha, preset))}
      />
      <ChoiceChips
        label={t("tasbeehDesigns.shape")}
        value={misbaha.shape}
        options={BEAD_SHAPES.map((id) => ({ id, label: t(`tasbeehDesigns.shapes.${id}`) }))}
        onChange={(shape) => onChange({ shape })}
      />
      <ChoiceChips
        label={t("tasbeehDesigns.material")}
        value={misbaha.material}
        options={MATERIAL_IDS.map((id) => ({
          id,
          label: t(`tasbeehDesigns.materials.${id}`),
          swatch: swatchFor(id),
        }))}
        onChange={(material) => onChange({ material })}
      />
      <ChoiceChips
        label={t("tasbeehDesigns.spacer.label")}
        value={misbaha.spacer}
        options={SPACER_STYLES.map((id) => ({ id, label: t(`tasbeehDesigns.spacer.${id}`) }))}
        onChange={(spacer) => onChange({ spacer })}
      />
      <ChoiceChips
        label={t("tasbeehDesigns.tassel.label")}
        value={misbaha.tassel.style}
        options={TASSEL_STYLES.map((id) => ({ id, label: t(`tasbeehDesigns.tassel.${id}`) }))}
        onChange={(style) => onChange({ tassel: { ...misbaha.tassel, style } })}
      />
      {misbaha.tassel.style === "silk" ? (
        <ChoiceChips
          label={t("tasbeehDesigns.tassel.color")}
          value={misbaha.tassel.color ?? ""}
          options={TASSEL_COLORS.map((color) => ({
            id: color,
            label: t(`tasbeehDesigns.colors.${COLOR_NAMES[color]}`),
            swatch: solidSwatch(color),
          }))}
          onChange={(color) => onChange({ tassel: { ...misbaha.tassel, color } })}
        />
      ) : null}
      <ChoiceChips
        label={t("tasbeehDesigns.thread.label")}
        value={misbaha.thread.hidden ? "hidden" : (misbaha.thread.color ?? "theme")}
        options={[
          { id: "theme", label: t("tasbeehDesigns.thread.theme") },
          ...THREAD_COLORS.map((color) => ({
            id: color as string,
            label: t(`tasbeehDesigns.colors.${COLOR_NAMES[color]}`),
            swatch: solidSwatch(color),
          })),
          { id: "hidden", label: t("tasbeehDesigns.thread.hidden") },
        ]}
        onChange={(choice) =>
          onChange({
            thread:
              choice === "hidden" ? { hidden: true } : choice === "theme" ? {} : { color: choice },
          })
        }
      />
      <ChoiceChips
        label={t("tasbeehDesigns.strand.label")}
        value={String(misbaha.strand)}
        options={(["auto", "33", "99"] as const).map((id) => ({
          id,
          label: t(`tasbeehDesigns.strand.${id === "auto" ? "auto" : `s${id}`}`),
        }))}
        onChange={(choice) =>
          onChange({ strand: choice === "auto" ? "auto" : choice === "33" ? 33 : 99 })
        }
      />
      {tv ? null : (
        <ChoiceChips
          label={t("tasbeehDesigns.layout.label")}
          value={misbaha.layout ?? "auto"}
          options={(["auto", "arc", "horizontal", "loop"] as const).map((id) => ({
            id,
            label: t(`tasbeehDesigns.layout.${id}`),
          }))}
          onChange={(layout) => onChange({ layout: layout === "auto" ? undefined : layout })}
        />
      )}
      <ChoiceChips
        label={t("tasbeehDesigns.background.label")}
        value={misbaha.background ?? "surface"}
        options={(["surface", "velvet"] as const).map((id) => ({
          id,
          label: t(`tasbeehDesigns.background.${id}`),
        }))}
        onChange={(background) => onChange({ background })}
      />
    </Section>
  );
}

function SoundSection({
  appearance,
  onChange,
}: {
  appearance: ResolvedTasbeehAppearance;
  onChange: (patch: Partial<TasbeehAppearance>) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const sound = appearance.sound;
  const volume = Math.round(sound.volume * 100);
  const setSound = (patch: Partial<TasbeehAppearance["sound"]>) =>
    onChange({ sound: { pack: sound.pack, volume: sound.volume, ...patch } });
  const testPack = resolveSoundPack(
    appearance,
    materialFor(appearance.misbaha.material, colors.accent).sound,
  );
  return (
    <Section title={t("tasbeehDesigns.sections.sound")}>
      <View style={styles.toggleRow}>
        <View style={styles.toggleText}>
          <ThemedText type="small">{t("tasbeehDesigns.sound.toggle")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("tasbeehDesigns.sound.toggleSub")}
          </ThemedText>
        </View>
        <ThemedSwitch
          accessibilityLabel={t("tasbeehDesigns.sound.toggle")}
          value={sound.enabled}
          onValueChange={(enabled) => setSound({ enabled })}
        />
      </View>
      {sound.enabled ? (
        <>
          <ChoiceChips
            label={t("tasbeehDesigns.sound.pack")}
            value={sound.pack}
            options={[
              { id: "auto", label: t("tasbeehDesigns.sound.auto") },
              ...TASBEEH_SOUND_PACKS.map((id) => ({
                id: id as string,
                label: t(`tasbeehDesigns.sound.packs.${id}`),
              })),
            ]}
            onChange={(pack) => setSound({ pack })}
          />
          <View style={styles.volumeRow}>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.toggleText}>
              {t("tasbeehDesigns.sound.volume", { percent: volume })}
            </ThemedText>
            <Stepper
              value={volume}
              min={0}
              label={t("tasbeehDesigns.sound.volumeLabel")}
              onIncrement={() => setSound({ volume: Math.min(100, volume + 10) / 100 })}
              onDecrement={() => setSound({ volume: Math.max(0, volume - 10) / 100 })}
            />
            <Button
              label={t("tasbeehDesigns.sound.test")}
              variant="secondary"
              size="sm"
              icon={{ ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }}
              onPress={() => void previewTasbeehSound(testPack, sound.volume)}
            />
          </View>
        </>
      ) : null}
    </Section>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.four,
  },
  stagePreview: {
    alignItems: "center",
    gap: Spacing.two,
  },
  section: {
    gap: Spacing.two,
  },
  carousel: {
    gap: Spacing.two,
    paddingVertical: Spacing.half,
  },
  card: {
    width: PREVIEW_SIZE + Spacing.three * 2,
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1.5,
  },
  cardTv: {
    minHeight: TvLayout.minFocusTarget * 2,
  },
  cardPreview: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  choiceGroup: {
    gap: Spacing.one,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1,
    minHeight: 36,
  },
  chipTv: {
    minHeight: TvLayout.chipMinHeight,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  toggleText: {
    flex: 1,
  },
  volumeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
});
