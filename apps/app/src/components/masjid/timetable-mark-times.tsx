import type { OcrResult } from "@munib-tracker/shared/timetable-parser";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  type LayoutChangeEvent,
  PanResponder,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { readMarkedTime, releaseRegionReader } from "@/lib/timetable-ocr";
import {
  containedFrame,
  type FractionRect,
  MARK_SLOTS,
  type MarkedTimes,
  type MarkSlot,
  type Point,
  rectFromDrag,
  type Size,
} from "@/lib/timetable-ocr/regions";
import { normaliseTypedTime } from "@/lib/timetable-ocr/review";

/** Tallest the photo is drawn (a long monthly sheet still leaves the fields in view). */
const MAX_PHOTO_HEIGHT = 520;
/** Height of the zoomed area preview next to each field. */
const PREVIEW_HEIGHT = 36;
const PREVIEW_MAX_WIDTH = 132;

interface SlotState {
  text: string;
  rect?: FractionRect;
}

/**
 * NF-3.12 guided import: the user draws a box around each Salah's time on the
 * photo and only that area is read (LED boards, glare, layouts the automatic
 * read gets wrong). Every value stays editable next to a zoomed preview of its
 * area, so a misread digit is fixed by looking, not guessing. Fields work
 * without drawing too (screen readers, keyboard).
 */
export function TimetableMarkTimes({
  photoUri,
  ocr,
  initial,
  onDone,
  onCancel,
}: {
  photoUri: string;
  /** The full-photo read, if any — native resolves areas from its tokens. */
  ocr: OcrResult | null;
  /** Times the automatic read already found (pre-filled, editable). */
  initial: MarkedTimes;
  onDone: (marks: MarkedTimes) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [slots, setSlots] = useState<Partial<Record<MarkSlot, SlotState>>>(() =>
    Object.fromEntries(Object.entries(initial).map(([slot, text]) => [slot, { text: text ?? "" }])),
  );
  const [active, setActive] = useState<MarkSlot>(
    () => MARK_SLOTS.find((slot) => !initial[slot]) ?? "fajr",
  );
  const [reading, setReading] = useState<MarkSlot | null>(null);
  const [notFound, setNotFound] = useState<MarkSlot | null>(null);
  const [imageSize, setImageSize] = useState<Size | null>(null);
  const [view, setView] = useState<Size>({ width: 0, height: 0 });
  const [drag, setDragState] = useState<{ start: Point; end: Point } | null>(null);
  const dragRef = useRef<{ start: Point; end: Point } | null>(null);
  const setDrag = (next: { start: Point; end: Point } | null) => {
    dragRef.current = next;
    setDragState(next);
  };

  useEffect(() => {
    let alive = true;
    Image.getSize(
      photoUri,
      (width, height) => alive && setImageSize({ width, height }),
      () => alive && setImageSize(null),
    );
    return () => {
      alive = false;
    };
  }, [photoUri]);

  useEffect(() => () => void releaseRegionReader(), []);

  const photoHeight =
    imageSize && view.width > 0
      ? Math.min(MAX_PHOTO_HEIGHT, (view.width * imageSize.height) / imageSize.width)
      : 280;
  const frame = imageSize
    ? containedFrame({ width: view.width, height: photoHeight }, imageSize)
    : { x: 0, y: 0, width: view.width, height: photoHeight };

  const readArea = async (slot: MarkSlot, rect: FractionRect) => {
    setSlots((prev) => ({ ...prev, [slot]: { text: prev[slot]?.text ?? "", rect } }));
    setReading(slot);
    setNotFound(null);
    const time = await readMarkedTime(photoUri, ocr, rect);
    setReading((current) => (current === slot ? null : current));
    if (time) {
      setSlots((prev) => ({ ...prev, [slot]: { text: time, rect } }));
      const { slots: latest } = live.current;
      const next = MARK_SLOTS.find((s) => s !== slot && !latest[s]?.text);
      if (next) setActive(next);
    } else {
      setNotFound(slot);
    }
  };

  // The responder is created once and reads the latest values through this ref.
  const live = useRef({ frame, active, slots, readArea, setDrag });
  live.current = { frame, active, slots, readArea, setDrag };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => {
          const point = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };
          live.current.setDrag({ start: point, end: point });
        },
        onPanResponderMove: (_event, gesture) => {
          const prev = dragRef.current;
          if (!prev) return;
          live.current.setDrag({
            start: prev.start,
            end: { x: prev.start.x + gesture.dx, y: prev.start.y + gesture.dy },
          });
        },
        onPanResponderRelease: (_event, gesture) => {
          const prev = dragRef.current;
          const current = live.current;
          current.setDrag(null);
          if (!prev) return;
          const end = { x: prev.start.x + gesture.dx, y: prev.start.y + gesture.dy };
          const rect = rectFromDrag(prev.start, end, current.frame);
          if (rect) void current.readArea(current.active, rect);
        },
        onPanResponderTerminate: () => live.current.setDrag(null),
      }),
    [],
  );

  const setText = (slot: MarkSlot, text: string) => {
    setNotFound((current) => (current === slot ? null : current));
    setSlots((prev) => ({ ...prev, [slot]: { ...prev[slot], text } }));
  };

  const values: MarkedTimes = Object.fromEntries(
    MARK_SLOTS.map((slot) => [slot, slots[slot]?.text ?? ""]),
  );
  const invalid = MARK_SLOTS.filter(
    (slot) => normaliseTypedTime(values[slot] ?? "", slot) === null,
  );
  const filled = MARK_SLOTS.filter((slot) => normaliseTypedTime(values[slot] ?? "", slot));
  const slotLabel = (slot: MarkSlot) =>
    slot === "jumuah" ? t("masjids.jumuah") : t(`prayers.${slot}`);

  const dragBox = drag
    ? {
        left: Math.min(drag.start.x, drag.end.x),
        top: Math.min(drag.start.y, drag.end.y),
        width: Math.abs(drag.end.x - drag.start.x),
        height: Math.abs(drag.end.y - drag.start.y),
      }
    : null;

  return (
    <View style={styles.stack}>
      <Card>
        <SectionHeader
          title={t("timetableImport.mark.title")}
          subtitle={t("timetableImport.mark.subtitle")}
          icon={{ ios: "viewfinder", android: "highlight_alt", web: "highlight_alt" }}
        />
        <View style={[styles.row, styles.gapTop]} accessibilityRole="radiogroup">
          {MARK_SLOTS.map((slot) => (
            <Chip
              key={slot}
              role="radio"
              label={slotLabel(slot)}
              selected={active === slot}
              icon={slots[slot]?.text ? "checkmark" : undefined}
              onPress={() => setActive(slot)}
            />
          ))}
        </View>
        <ThemedText type="smallBold" style={styles.gapTop}>
          {t("timetableImport.mark.instruction", { prayer: slotLabel(active) })}
        </ThemedText>

        <View
          onLayout={(event: LayoutChangeEvent) =>
            setView({
              width: event.nativeEvent.layout.width,
              height: event.nativeEvent.layout.height,
            })
          }
          style={[
            styles.photoBox,
            { height: photoHeight, borderColor: colors.border, backgroundColor: colors.muted },
          ]}
        >
          <Image
            source={{ uri: photoUri }}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            accessibilityLabel={t("timetableImport.photoA11y")}
          />
          {MARK_SLOTS.map((slot) => {
            const rect = slots[slot]?.rect;
            if (!rect) return null;
            const selected = slot === active;
            return (
              <View
                key={slot}
                pointerEvents="none"
                style={[
                  styles.mark,
                  {
                    left: frame.x + rect.x * frame.width,
                    top: frame.y + rect.y * frame.height,
                    width: rect.w * frame.width,
                    height: rect.h * frame.height,
                    borderColor: selected ? colors.accent : colors.foreground,
                  },
                ]}
              >
                <View
                  style={[
                    styles.markTag,
                    { backgroundColor: selected ? colors.accent : colors.foreground },
                  ]}
                >
                  <ThemedText
                    type="caption"
                    style={{ color: selected ? colors.accentForeground : colors.background }}
                  >
                    {slotLabel(slot)}
                  </ThemedText>
                </View>
              </View>
            );
          })}
          {dragBox ? (
            <View
              pointerEvents="none"
              style={[styles.mark, dragBox, { borderColor: colors.accent, borderStyle: "dashed" }]}
            />
          ) : null}
          <View
            {...responder.panHandlers}
            style={[StyleSheet.absoluteFill, Platform.OS === "web" && webNoTouchScroll]}
            accessibilityHint={t("timetableImport.mark.dragHint")}
          />
        </View>
      </Card>

      <Card>
        <View style={styles.list}>
          {MARK_SLOTS.map((slot) => {
            const state = slots[slot];
            const selected = slot === active;
            const bad = invalid.includes(slot);
            return (
              <View
                key={slot}
                style={[
                  styles.slotRow,
                  {
                    borderColor: selected ? colors.accent : colors.border,
                    backgroundColor: selected ? tokens.status.success.soft : "transparent",
                  },
                ]}
              >
                <PressableScale
                  onPress={() => setActive(slot)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={t("timetableImport.mark.selectSlot", {
                    prayer: slotLabel(slot),
                  })}
                  style={styles.slotLabel}
                >
                  <ThemedText type="smallBold">{slotLabel(slot)}</ThemedText>
                  {reading === slot ? (
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("timetableImport.mark.reading")}
                    </ThemedText>
                  ) : notFound === slot ? (
                    <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
                      {t("timetableImport.mark.notFound")}
                    </ThemedText>
                  ) : !state?.rect && !state?.text ? (
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("timetableImport.mark.notMarked")}
                    </ThemedText>
                  ) : null}
                </PressableScale>
                {state?.rect && imageSize ? (
                  <AreaPreview uri={photoUri} image={imageSize} rect={state.rect} />
                ) : null}
                {reading === slot ? <ActivityIndicator color={colors.accent} /> : null}
                <TextInput
                  value={state?.text ?? ""}
                  onChangeText={(text) => setText(slot, text)}
                  onFocus={() => setActive(slot)}
                  placeholder="--:--"
                  placeholderTextColor={colors.mutedForeground}
                  inputMode="numeric"
                  maxLength={8}
                  accessibilityLabel={slotLabel(slot)}
                  style={[
                    styles.input,
                    tokens.inputSurface,
                    {
                      color: colors.foreground,
                      borderColor: bad ? tokens.status.danger.text : colors.border,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
          {t("timetableImport.mark.typeHint")}
        </ThemedText>
      </Card>

      {invalid.length > 0 ? (
        <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
          {t("timetableImport.fixInvalid", { count: invalid.length })}
        </ThemedText>
      ) : null}
      <View style={styles.row}>
        <Button
          label={t("timetableImport.mark.continue")}
          onPress={() => onDone(values)}
          disabled={filled.length === 0 || invalid.length > 0 || reading != null}
        />
        <Button variant="ghost" label={t("timetableImport.mark.back")} onPress={onCancel} />
      </View>
    </View>
  );
}

/** The marked area, zoomed: the photo drawn larger inside a clipped box. */
function AreaPreview({ uri, image, rect }: { uri: string; image: Size; rect: FractionRect }) {
  const { colors } = useThemeTokens();
  const areaW = rect.w * image.width;
  const areaH = rect.h * image.height;
  const scale = Math.min(PREVIEW_HEIGHT / areaH, PREVIEW_MAX_WIDTH / areaW);
  return (
    <View
      style={[
        styles.preview,
        {
          width: areaW * scale,
          height: areaH * scale,
          borderColor: colors.border,
          backgroundColor: colors.muted,
        },
      ]}
    >
      <Image
        source={{ uri }}
        resizeMode="stretch"
        style={{
          position: "absolute",
          width: image.width * scale,
          height: image.height * scale,
          left: -rect.x * image.width * scale,
          top: -rect.y * image.height * scale,
        }}
      />
    </View>
  );
}

/** Web: a drag on the photo draws a box instead of scrolling the page. */
const webNoTouchScroll = { touchAction: "none", cursor: "crosshair" } as object;

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  list: { gap: Spacing.two },
  gapTop: { marginTop: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  photoBox: {
    marginTop: Spacing.two,
    width: "100%",
    overflow: "hidden",
    borderRadius: Radius.md,
    borderWidth: BorderWidth.hairline,
  },
  mark: { position: "absolute", borderWidth: BorderWidth.thick, borderRadius: Radius.sm },
  markTag: {
    position: "absolute",
    top: -2,
    start: -2,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.sm,
  },
  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.hairline,
  },
  slotLabel: { flex: 1, gap: Spacing.half },
  preview: {
    overflow: "hidden",
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.hairline,
  },
  input: {
    width: 96,
    borderWidth: BorderWidth.thick,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    fontSize: 16,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
});
