import type { TasbeehDesignId, TasbeehHapticsLevel } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { ToggleRow } from "@/components/settings/settings-rows";
import { StepperRow } from "@/components/settings/stepper-row";
import { TasbeehFace } from "@/components/tasbeeh/faces/tasbeeh-face";
import { TasbeehDesignNote } from "@/components/tasbeeh/tasbeeh-design-note";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { gradientBackground } from "@/lib/gradient";
import { isHapticsEnabled } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";
import { getPlatformCtx } from "@/lib/settings/platform";
import { isSettingAvailable } from "@/lib/settings/registry";
import type { SettingId } from "@/lib/settings/types";
import { useSetting } from "@/lib/settings/use-setting";
import {
  availableDesigns,
  type ResolvedTasbeehAppearance,
  resolveSoundPack,
} from "@/lib/tasbeeh/designs";
import { countEventForAppearance, feedbackFor, playHapticPattern } from "@/lib/tasbeeh/feedback";
import { beadGradient, materialFor, PRESETS } from "@/lib/tasbeeh/materials";
import { previewTasbeehSound } from "@/lib/tasbeeh/sound";
import { useTasbeehAppearance } from "@/lib/tasbeeh/use-tasbeeh-appearance";

/** Thumbnail box; the face draws a little smaller so ring knobs and glows aren't clipped. */
const PREVIEW_SIZE = 84;
const PREVIEW_FACE = 70;
const CARD_WIDTH = 120;
/** Native windows at least this wide (tablets) wrap the design cards into a grid. */
const WRAP_MIN_WIDTH = 600;
const STAGE_PREVIEW = 156;
/**
 * Fixed stage box: faces differ in shape (bead strand, clicker, rosette), so
 * hovering designs on web must not resize the stage and shift the page.
 */
const STAGE_BOX = STAGE_PREVIEW + Spacing.four;
const DEMO_TARGET = 33;
const DEMO_START = 7;
const HEX = /^#[0-9a-f]{6}$/i;

/**
 * Setting ids behind each control. The registry (`lib/settings/defs/tasbeeh.ts`)
 * owns the option lists, labels, availability (TV / native) and the write path,
 * so this editor — the counter's style sheet *and* Settings › Tasbeeh counter —
 * and settings search always agree.
 */
const IDS = {
  design: "content.tasbeeh.design",
  preset: "content.tasbeeh.misbaha.preset",
  soundEnabled: "content.tasbeeh.sound.enabled",
  soundPack: "content.tasbeeh.sound.pack",
  volume: "content.tasbeeh.sound.volume",
  haptics: "content.tasbeeh.haptics",
} as const;

/** Fine-tuning behind "Customize beads" (progressive disclosure: presets come first). */
const BEAD_DETAIL_IDS: readonly SettingId[] = [
  "content.tasbeeh.misbaha.shape",
  "content.tasbeeh.misbaha.material",
  "content.tasbeeh.misbaha.spacer",
  "content.tasbeeh.misbaha.tassel",
  "content.tasbeeh.misbaha.tasselColor",
  "content.tasbeeh.misbaha.thread",
  "content.tasbeeh.misbaha.strand",
  "content.tasbeeh.misbaha.layout",
  "content.tasbeeh.misbaha.background",
];

/** The one display option of the other configurable designs. */
const DISPLAY_IDS: Partial<Record<TasbeehDesignId, SettingId>> = {
  clicker: "content.tasbeeh.clicker.backlight",
  pebbles: "content.tasbeeh.pebbles.item",
  fingers: "content.tasbeeh.fingers.layout",
};

/**
 * The shared "Counter style" editor (NF-3.19), used by the counter's style
 * sheet and Settings › Tasbeeh counter. Every change applies at once (no Save
 * button) through the synced preferences entity.
 */
export function TasbeehAppearanceEditor({
  focusSelected = false,
}: {
  /**
   * TV: give the selected design card the initial focus. Only the style sheet
   * asks for it — inline in Settings it would pull focus into the page.
   */
  focusSelected?: boolean;
} = {}) {
  const { t } = useTranslation();
  const appearance = useTasbeehAppearance();
  const [hovered, setHovered] = useState<TasbeehDesignId | null>(null);
  const previewAppearance: ResolvedTasbeehAppearance = {
    ...appearance,
    design: hovered ?? appearance.design,
  };
  const displayId = DISPLAY_IDS[appearance.design];

  return (
    <View style={styles.root}>
      <DemoStage appearance={previewAppearance} />

      <Section title={t("tasbeehDesigns.sections.design")}>
        <DesignCarousel
          appearance={appearance}
          onHover={setHovered}
          focusSelected={focusSelected}
        />
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(`tasbeehDesigns.designs.${appearance.design}.desc`)}
        </ThemedText>
      </Section>

      {appearance.design === "misbaha" ? <BeadOptions /> : null}

      {displayId ? (
        <Section title={t("tasbeehDesigns.sections.display")}>
          <SettingChips id={displayId} />
        </Section>
      ) : null}

      <TasbeehDesignNote design={appearance.design} />

      <SoundSection appearance={appearance} />
      <HapticsSection />
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" accessibilityRole="header">
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

/**
 * Live stage preview: tap to try the selected (or hovered, on web) design. It
 * animates like the counter (unless reduced motion is on) and plays the design's
 * haptics at the chosen level, so Subtle and Rich can be felt before counting.
 */
function DemoStage({ appearance }: { appearance: ResolvedTasbeehAppearance }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(DEMO_START);
  const tv = isTV();

  const tryIt = () => {
    const next = count >= DEMO_TARGET ? 0 : count + 1;
    setCount(next);
    if (next === 0) return;
    const event =
      next >= DEMO_TARGET ? "complete" : countEventForAppearance(appearance, next, DEMO_TARGET);
    playHapticPattern(feedbackFor(appearance.design, event, appearance.haptics).haptics);
  };

  return (
    <PressableScale
      haptic={false}
      accessibilityRole="button"
      accessibilityLabel={t("tasbeehDesigns.previewHint")}
      accessibilityValue={{ min: 0, max: DEMO_TARGET, now: count }}
      onPress={tryIt}
      style={styles.stagePreview}
    >
      <View style={styles.stageBox}>
        <TasbeehFace
          count={count}
          target={DEMO_TARGET}
          complete={count >= DEMO_TARGET}
          size={STAGE_PREVIEW}
          tv={tv}
          reduceMotion={reduceMotion}
          appearance={appearance}
          onCount={() => {}}
          preview
        />
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("tasbeehDesigns.previewHint")}
      </ThemedText>
    </PressableScale>
  );
}

function DesignCarousel({
  appearance,
  onHover,
  focusSelected,
}: {
  appearance: ResolvedTasbeehAppearance;
  onHover: (id: TasbeehDesignId | null) => void;
  focusSelected: boolean;
}) {
  const { setValue } = useSetting<TasbeehDesignId>(IDS.design);
  const { width } = useWindowDimensions();
  const tv = isTV();
  const [gridWidth, setGridWidth] = useState(0);
  const designs = availableDesigns({ tv });
  const cards = designs.map((design) => (
    <DesignCard
      key={design.id}
      id={design.id}
      selected={appearance.design === design.id}
      preferredFocus={focusSelected && appearance.design === design.id}
      appearance={{ ...appearance, design: design.id }}
      onSelect={() => void setValue(design.id)}
      onHover={onHover}
    />
  ));
  // Web wraps: a mouse can't swipe a scrollbar-less strip, so designs past the
  // edge were unreachable. Phones swipe (the cut-off card hints at more); TV
  // scrolls with D-pad focus.
  const wrap = !tv && (Platform.OS === "web" || width >= WRAP_MIN_WIDTH);
  if (wrap) {
    return (
      <View style={styles.grid} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
        {designs.map((design, i) => (
          // Cards share each row evenly (no ragged gap at the end of the row).
          <View key={design.id} style={gridWidth ? { width: gridCardWidth(gridWidth) } : undefined}>
            {cards[i]}
          </View>
        ))}
      </View>
    );
  }
  return (
    <TvScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carousel}
    >
      {cards}
    </TvScrollView>
  );
}

/** Width of each card when `CARD_WIDTH`-ish cards fill a row of `rowWidth` exactly. */
export function gridCardWidth(rowWidth: number): number {
  const columns = Math.max(1, Math.floor((rowWidth + Spacing.two) / (CARD_WIDTH + Spacing.two)));
  return Math.floor((rowWidth - Spacing.two * (columns - 1)) / columns);
}

function DesignCard({
  id,
  selected,
  preferredFocus,
  appearance,
  onSelect,
  onHover,
}: {
  id: TasbeehDesignId;
  selected: boolean;
  preferredFocus: boolean;
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
      {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.card,
        tv && styles.cardTv,
        {
          backgroundColor: selected ? tokens.accentSoft : colors.muted,
          borderColor: selected ? colors.accent : "transparent",
        },
      ]}
    >
      {/* Thumbnails stay still (reduced motion); the demo stage above animates. */}
      <View style={styles.cardPreview} pointerEvents="none">
        <TasbeehFace
          count={DEMO_START}
          target={DEMO_TARGET}
          complete={false}
          size={PREVIEW_FACE}
          tv={tv}
          reduceMotion
          appearance={appearance}
          onCount={() => {}}
          preview
        />
      </View>
      <ThemedText
        type="smallBold"
        numberOfLines={2}
        style={[styles.cardName, selected && { color: colors.accentText }]}
      >
        {name}
      </ThemedText>
    </PressableScale>
  );
}

/** Misbaha: presets first; every fine-tuning option sits behind one disclosure. */
function BeadOptions() {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const [open, setOpen] = useState(false);
  const materialSwatch = (material: string) => beadGradient(materialFor(material, colors.accent));
  const presetSwatch = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    return preset ? materialSwatch(preset.material) : undefined;
  };
  const colorSwatch = (value: string) => (HEX.test(value) ? solidSwatch(value) : undefined);
  const swatchFor: Partial<Record<SettingId, (value: string) => string | undefined>> = {
    "content.tasbeeh.misbaha.material": materialSwatch,
    "content.tasbeeh.misbaha.tasselColor": colorSwatch,
    "content.tasbeeh.misbaha.thread": colorSwatch,
  };

  return (
    <Section title={t("tasbeehDesigns.sections.beads")}>
      <SettingChips id={IDS.preset} swatch={presetSwatch} />
      <Disclosure
        label={t("tasbeehDesigns.customizeBeads")}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      />
      {open ? (
        <View style={styles.details}>
          {BEAD_DETAIL_IDS.map((id) => (
            <SettingChips key={id} id={id} swatch={swatchFor[id]} />
          ))}
        </View>
      ) : null}
    </Section>
  );
}

function Disclosure({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  const { colors } = useThemeTokens();
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ expanded: open }}
      onPress={onToggle}
      style={[styles.disclosure, isTV() && styles.chipTv]}
    >
      <ThemedText type="smallBold" style={{ color: colors.accentText }}>
        {label}
      </ThemedText>
      <SymbolView
        name={{ ios: "chevron.down", android: "keyboard_arrow_down", web: "keyboard_arrow_down" }}
        size={14}
        tintColor={colors.accentText}
        style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
      />
    </PressableScale>
  );
}

/**
 * A choice setting as wrapping chips: options, labels, availability and the
 * enabled state come from the setting's registry def; writes go through
 * `useSetting` (the same path Settings and search use).
 */
function SettingChips<V extends string | number>({
  id,
  swatch,
}: {
  id: SettingId;
  swatch?: (value: string) => string | undefined;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { value, setValue, def, enabled } = useSetting<V>(id);
  if (!enabled || def.control.kind !== "choice" || !isSettingAvailable(def, getPlatformCtx())) {
    return null;
  }
  const label = t(def.titleKey);
  const tv = isTV();
  return (
    <View style={styles.choiceGroup}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
      <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {def.control.options.map((option) => {
          const optionValue = option.value as V;
          const selected = optionValue === value;
          const optionLabel = option.labelKey
            ? t(option.labelKey)
            : (option.label ?? String(optionValue));
          const fill = swatch?.(String(optionValue));
          return (
            <PressableScale
              key={String(optionValue)}
              haptic="selection"
              accessibilityRole="radio"
              accessibilityLabel={optionLabel}
              accessibilityState={{ selected, checked: selected }}
              // 36dp chips reach a 44dp touch target without spreading the grid.
              hitSlop={{ top: 4, bottom: 4 }}
              onPress={() => {
                if (!selected) void setValue(optionValue);
              }}
              style={[
                styles.chip,
                tv && styles.chipTv,
                {
                  backgroundColor: selected ? tokens.accentSoft : colors.muted,
                  borderColor: selected ? colors.accent : tokens.hairline,
                },
              ]}
            >
              {fill ? (
                <View
                  style={[
                    styles.swatch,
                    { borderColor: withAlpha(colors.foreground, 0.25) },
                    gradientBackground(fill),
                  ]}
                />
              ) : null}
              <ThemedText
                type="smallBold"
                style={{ color: selected ? colors.accentText : colors.foreground }}
              >
                {optionLabel}
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

function SoundSection({ appearance }: { appearance: ResolvedTasbeehAppearance }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const sound = useSetting<boolean>(IDS.soundEnabled);
  const volume = useSetting<number>(IDS.volume);
  const control = volume.def.control;
  const testPack = resolveSoundPack(
    appearance,
    materialFor(appearance.misbaha.material, colors.accent).sound,
  );
  return (
    <Section title={t("tasbeehDesigns.sections.sound")}>
      <ToggleRow
        title={t(sound.def.titleKey)}
        subtitle={sound.def.subtitleKey ? t(sound.def.subtitleKey) : undefined}
        value={sound.value === true}
        onValueChange={(enabled) => void sound.setValue(enabled)}
      />
      {sound.value === true ? (
        <>
          <SettingChips id={IDS.soundPack} />
          {control.kind === "stepper" ? (
            <StepperRow
              title={t("tasbeehDesigns.sound.volumeLabel")}
              value={volume.value}
              min={control.min}
              max={control.max}
              step={control.step}
              format={(v) => control.format(v, t)}
              onChange={(v) => void volume.setValue(v)}
            />
          ) : null}
          <Button
            label={t("tasbeehDesigns.sound.test")}
            variant="secondary"
            size="sm"
            icon={{ ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }}
            onPress={() => void previewTasbeehSound(testPack, appearance.sound.volume)}
            style={styles.testButton}
          />
        </>
      ) : null}
    </Section>
  );
}

/** Off / Subtle / Rich — phones and tablets only (TV and web have no haptics). */
function HapticsSection() {
  const { t } = useTranslation();
  const { value, setValue, def } = useSetting<TasbeehHapticsLevel>(IDS.haptics);
  if (def.control.kind !== "choice" || !isSettingAvailable(def, getPlatformCtx())) return null;
  return (
    <Section title={t(def.titleKey)}>
      <SegmentedControl<TasbeehHapticsLevel>
        options={def.control.options.map((option) => ({
          id: option.value as TasbeehHapticsLevel,
          label: option.labelKey ? t(option.labelKey) : String(option.value),
        }))}
        value={value}
        onChange={(level) => void setValue(level)}
      />
      {!isHapticsEnabled() ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("tasbeehDesigns.haptics.globalOff")}
        </ThemedText>
      ) : null}
    </Section>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.four,
  },
  stageBox: {
    width: STAGE_BOX,
    height: STAGE_BOX,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  stagePreview: {
    alignItems: "center",
    gap: Spacing.two,
  },
  section: {
    gap: Spacing.two,
  },
  details: {
    gap: Spacing.three,
  },
  carousel: {
    gap: Spacing.two,
    paddingVertical: Spacing.half,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  card: {
    minWidth: CARD_WIDTH,
    flexGrow: 1,
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
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
  cardName: {
    textAlign: "center",
  },
  disclosure: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.one,
    minHeight: 44,
    paddingEnd: Spacing.two,
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
    borderCurve: "continuous",
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
  testButton: {
    alignSelf: "flex-start",
  },
});
