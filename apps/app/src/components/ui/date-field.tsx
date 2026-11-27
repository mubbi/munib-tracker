import { getLocalDateString, parseLocalDateString } from "@munib-tracker/shared/utils";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import {
  type FieldChromeProps,
  FieldShell,
  fieldRowStyles,
  useFieldA11y,
  useFieldSurface,
} from "@/components/ui/field-chrome";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { BorderWidth, IconSize, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { localeToBcp47 } from "@/lib/locale-bcp47";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";

export type DateFieldPreset = { id: string; label: string; day: string };

export type DateFieldProps = FieldChromeProps & {
  /** `YYYY-MM-DD`, or "" / undefined when empty. */
  value: string | undefined;
  /** Reports `YYYY-MM-DD`, or "" when cleared. */
  onChange: (day: string) => void;
  /** Inclusive bounds, `YYYY-MM-DD`. */
  minDay?: string;
  maxDay?: string;
  /** Quick-pick chips ("In 1 month"); labels come from the caller. */
  presets?: ReadonlyArray<DateFieldPreset>;
  placeholder?: string;
  /** Show a clear action when a value is set (default true unless `required`). */
  clearable?: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");
const toDay = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

/**
 * First day of the week per app language (0 = Sunday … 6 = Saturday), used when the
 * tag has no region and `Intl` week data is missing or would pick the wrong script
 * variant (ICU maps bare `ku` to Kurmanji/Turkey, but the app's `ku` is Sorani/Iraq).
 * Saturday: Arabic, Persian, Pashto, Sorani Kurdish. Sunday: en (US), bn, hi, id, ur, sw.
 * Monday: the rest (European and Central-Asian locales, Turkish, Malay, Hausa, Somali…).
 */
const WEEK_START_BY_LANGUAGE: Record<string, number> = {
  ar: 6,
  fa: 6,
  ps: 6,
  ku: 6,
  en: 0,
  bn: 0,
  hi: 0,
  id: 0,
  ur: 0,
  sw: 0,
  az: 1,
  bs: 1,
  fr: 1,
  ha: 1,
  kk: 1,
  ky: 1,
  ms: 1,
  ru: 1,
  so: 1,
  sq: 1,
  tg: 1,
  tk: 1,
  tr: 1,
  uz: 1,
};

/** Day the calendar week starts on for a BCP 47 tag: 0 = Sunday … 6 = Saturday. */
export function weekStartFor(bcp47: string): number {
  const [language = "", ...rest] = bcp47.split("-");
  const hasRegion = rest.some((part) => /^[A-Za-z]{2}$|^\d{3}$/.test(part));
  const known = WEEK_START_BY_LANGUAGE[language.toLowerCase()];
  // An explicit region ("en-GB") wins over the language table; a bare language uses the table.
  if (known != null && !hasRegion) return known;
  try {
    const locale = new Intl.Locale(bcp47) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const firstDay = (locale.getWeekInfo?.() ?? locale.weekInfo)?.firstDay;
    // Intl: 1 = Monday … 7 = Sunday.
    if (typeof firstDay === "number" && firstDay >= 1 && firstDay <= 7) return firstDay % 7;
  } catch {
    // Older engines without Intl.Locale week data fall through to the table.
  }
  return known ?? 1;
}

const NON_LATIN_DIGITS: Array<[number, number]> = [
  [0x0660, 0x0669], // Arabic-Indic
  [0x06f0, 0x06f9], // Persian
  [0x09e6, 0x09ef], // Bengali
  [0x0966, 0x096f], // Devanagari
];

function toLatinDigits(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    const range = NON_LATIN_DIGITS.find(([lo, hi]) => code >= lo && code <= hi);
    out += range ? String(code - range[0]) : ch;
  }
  return out;
}

type DateOrder = Array<"day" | "month" | "year">;

/** Day / month / year order the locale writes numeric dates in (`dd/mm/yyyy` → day, month, year). */
export function localeDateOrder(bcp47: string): DateOrder {
  try {
    const order = new Intl.DateTimeFormat(bcp47, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date(2026, 11, 31))
      .map((part) => part.type)
      .filter((type): type is "day" | "month" | "year" => ["day", "month", "year"].includes(type));
    if (order.length === 3) return order;
  } catch {
    // fall through
  }
  return ["month", "day", "year"];
}

export type TypedDateResult =
  | { ok: true; day: string }
  | { ok: false; reason: "empty" | "invalid" };

/**
 * Parses what a keyboard user typed: the locale's own numeric order (`31/12/2026`,
 * `12/31/2026`, `2026.12.31`), or ISO `2026-12-31` in any locale. Digits in any
 * script and any non-digit separator are accepted; the year must have four digits.
 */
export function parseTypedDate(text: string, order: DateOrder): TypedDateResult {
  const trimmed = toLatinDigits(text).trim();
  if (trimmed === "") return { ok: false, reason: "empty" };
  const parts = trimmed.split(/\D+/).filter(Boolean);
  if (parts.length !== 3) return { ok: false, reason: "invalid" };
  const iso = /^\d{4}$/.test(parts[0] ?? "") && order[0] !== "year";
  const fields = iso ? (["year", "month", "day"] as const) : order;
  const values: Record<string, number> = {};
  fields.forEach((field, i) => {
    values[field] = Number(parts[i]);
  });
  const { year, month, day } = values as { year: number; month: number; day: number };
  if (String(parts[fields.indexOf("year")]).length !== 4) return { ok: false, reason: "invalid" };
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, day: toDay(year, month - 1, day) };
}

/** Desktop web with a mouse / trackpad: typing is the faster path than the calendar. */
function useDesktopWeb(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "web" || isTV()) return;
    try {
      setDesktop(window.matchMedia?.("(pointer: fine)")?.matches ?? false);
    } catch {
      setDesktop(false);
    }
  }, []);
  return desktop;
}

/**
 * Date field. Tapping opens a calendar sheet (month grid + optional preset chips) and
 * the field shows the day in the user's own locale format; the week starts on the
 * locale's first weekday. On desktop web the field is also a real text input that
 * accepts the locale's numeric format (keyboard-first) and validates min / max. The
 * stored value stays `YYYY-MM-DD`.
 */
export function DateField({
  label,
  helperText,
  error,
  required,
  optional,
  disabled,
  value,
  onChange,
  minDay,
  maxDay,
  presets,
  placeholder,
  clearable,
}: DateFieldProps) {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeTokens();
  const back = useChevronBackward();
  const forward = useChevronForward();
  const bcp47 = localeToBcp47(i18n.language || "en");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const today = getLocalDateString();
  const current = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
  const seed = parseLocalDateString(current || today);
  const [view, setView] = useState({ y: seed.getFullYear(), m: seed.getMonth() });
  const desktopWeb = useDesktopWeb();
  const order = useMemo(() => localeDateOrder(bcp47), [bcp47]);
  const weekStart = useMemo(() => weekStartFor(bcp47), [bcp47]);
  const numeric = (day: string) => {
    try {
      return parseLocalDateString(day).toLocaleDateString(bcp47, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return day;
    }
  };
  const [draft, setDraft] = useState(() => (current ? numeric(current) : ""));
  const [typedError, setTypedError] = useState<string | undefined>();
  const shownError = error ?? typedError;
  const { inputId, messageId, counterId } = useFieldA11y({
    label,
    helperText,
    error: shownError,
    required,
    disabled,
  });
  const surface = useFieldSurface({ focused, error: shownError });
  const web = Platform.OS === "web";
  const canClear = (clearable ?? !required) && current !== "";

  const fmt = (day: string, options: Intl.DateTimeFormatOptions) => {
    try {
      return parseLocalDateString(day).toLocaleDateString(bcp47, options);
    } catch {
      return day;
    }
  };
  const display = current ? fmt(current, { dateStyle: "medium" }) : "";

  // Columns start on the locale's first weekday. 2023-01-01 is a Sunday.
  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        new Date(2023, 0, 1 + ((weekStart + i) % 7)).toLocaleDateString(bcp47, {
          weekday: "narrow",
        }),
      ),
    [bcp47, weekStart],
  );
  const weekdayLong = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        new Date(2023, 0, 1 + ((weekStart + i) % 7)).toLocaleDateString(bcp47, {
          weekday: "long",
        }),
      ),
    [bcp47, weekStart],
  );

  const firstWeekday = (new Date(view.y, view.m, 1).getDay() - weekStart + 7) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const monthTitle = new Date(view.y, view.m, 1).toLocaleDateString(bcp47, {
    month: "long",
    year: "numeric",
  });
  const shift = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };
  const outOfRange = (day: string) =>
    (minDay != null && day < minDay) || (maxDay != null && day > maxDay);

  const pick = (day: string) => {
    onChange(day);
    setDraft(day ? numeric(day) : "");
    setTypedError(undefined);
    setOpen(false);
  };

  // Keep the typed text in step with changes made elsewhere (presets, resets, parent state).
  // biome-ignore lint/correctness/useExhaustiveDependencies: only re-sync on an external value change
  useEffect(() => {
    if (!focused) setDraft(current ? numeric(current) : "");
  }, [current, bcp47]);

  const example = numeric("2026-12-31");
  /** Validates the typed text; returns the day to store ("" when nothing valid). */
  const commitDraft = (text: string, final: boolean): string => {
    const parsed = parseTypedDate(text, order);
    if (!parsed.ok) {
      if (parsed.reason === "empty") {
        setTypedError(undefined);
        return "";
      }
      if (final) setTypedError(t("uiField.dateInvalid", { example }));
      return "";
    }
    if (minDay != null && parsed.day < minDay) {
      if (final)
        setTypedError(t("uiField.dateBefore", { date: fmt(minDay, { dateStyle: "medium" }) }));
      return "";
    }
    if (maxDay != null && parsed.day > maxDay) {
      if (final)
        setTypedError(t("uiField.dateAfter", { date: fmt(maxDay, { dateStyle: "medium" }) }));
      return "";
    }
    setTypedError(undefined);
    return parsed.day;
  };
  const onDraftChange = (text: string) => {
    setDraft(text);
    const day = commitDraft(text, false);
    if (day !== current) onChange(day);
  };
  const onDraftBlur = () => {
    setFocused(false);
    const day = commitDraft(draft, true);
    if (day) setDraft(numeric(day));
    if (day !== current) onChange(day);
  };
  const openSheet = () => {
    const base = parseLocalDateString(current || today);
    setView({ y: base.getFullYear(), m: base.getMonth() });
    setOpen(true);
  };

  return (
    <>
      <FieldShell
        label={label}
        helperText={helperText}
        error={shownError}
        required={required}
        optional={optional}
        messageId={messageId}
        counterId={counterId}
      >
        {desktopWeb ? (
          <View style={[fieldRowStyles.row, surface, disabled && fieldRowStyles.disabled]}>
            <TextInput
              value={draft}
              onChangeText={onDraftChange}
              onFocus={() => setFocused(true)}
              onBlur={onDraftBlur}
              editable={!disabled}
              placeholder={placeholder ?? example}
              placeholderTextColor={colors.mutedForeground}
              inputMode="numeric"
              autoComplete="off"
              accessibilityLabel={label}
              accessibilityHint={
                shownError ? undefined : (helperText ?? t("uiField.typeDateHint", { example }))
              }
              {...({
                id: inputId,
                "aria-invalid": shownError ? true : undefined,
                "aria-required": required ? true : undefined,
                "aria-describedby": shownError || helperText ? messageId : undefined,
              } as object)}
              style={[
                styles.value,
                styles.input,
                { color: colors.foreground, outlineStyle: "none" } as object,
              ]}
            />
            <IconButton
              name={{ ios: "calendar", android: "calendar_today", web: "calendar_today" }}
              accessibilityLabel={`${label}, ${t("uiField.chooseDate")}`}
              tintColor={colors.mutedForeground}
              disabled={disabled}
              onPress={openSheet}
            />
          </View>
        ) : (
          <PressableScale
            role="button"
            accessibilityLabel={`${label}, ${display || placeholder || t("uiField.chooseDate")}`}
            accessibilityHint={shownError ? undefined : helperText}
            accessibilityState={{ disabled: Boolean(disabled), expanded: open }}
            disabled={disabled}
            onPress={openSheet}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            scaleTo={0.99}
            style={[fieldRowStyles.row, surface, disabled && fieldRowStyles.disabled]}
            {...(web
              ? ({
                  id: inputId,
                  "aria-haspopup": "dialog",
                  "aria-invalid": shownError ? true : undefined,
                  "aria-describedby": shownError || helperText ? messageId : undefined,
                } as object)
              : null)}
          >
            <SymbolView
              name={{ ios: "calendar", android: "calendar_today", web: "calendar_today" }}
              size={IconSize.lg}
              tintColor={colors.mutedForeground}
            />
            <ThemedText
              style={styles.value}
              numberOfLines={1}
              themeColor={display ? undefined : "mutedForeground"}
            >
              {display || placeholder || t("uiField.chooseDate")}
            </ThemedText>
          </PressableScale>
        )}
      </FieldShell>

      <Sheet title={label} visible={open} onClose={() => setOpen(false)} variant="bottom" solid>
        <View style={styles.header}>
          <IconButton
            name={back}
            accessibilityLabel={t("calendar.prevMonth")}
            onPress={() => shift(-1)}
          />
          <ThemedText
            type="subtitle"
            heading={2}
            style={styles.monthTitle}
            accessibilityLiveRegion="polite"
          >
            {monthTitle}
          </ThemedText>
          <IconButton
            name={forward}
            accessibilityLabel={t("calendar.nextMonth")}
            onPress={() => shift(1)}
          />
        </View>

        <View
          style={styles.weekRow}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {weekdays.map((w, i) => (
            <ThemedText
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed 7 columns
              key={i}
              type="caption"
              themeColor="mutedForeground"
              style={styles.weekday}
            >
              {w}
            </ThemedText>
          ))}
        </View>

        {weeks.map((week, wi) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid rows
          <View key={wi} style={styles.weekRow}>
            {week.map((d, di) => {
              if (d == null) {
                // biome-ignore lint/suspicious/noArrayIndexKey: empty grid cell
                return <View key={di} style={styles.cell} />;
              }
              const day = toDay(view.y, view.m, d);
              const selected = day === current;
              const disabledDay = outOfRange(day);
              const isToday = day === today;
              return (
                <PressableScale
                  key={day}
                  role="button"
                  disabled={disabledDay}
                  accessibilityLabel={`${weekdayLong[di]}, ${fmt(day, { dateStyle: "long" })}`}
                  accessibilityState={{ selected, disabled: disabledDay }}
                  onPress={() => pick(day)}
                  haptic="selection"
                  style={[
                    styles.cell,
                    styles.dayCell,
                    {
                      backgroundColor: selected ? colors.accent : "transparent",
                      borderColor: isToday && !selected ? colors.accent : "transparent",
                    },
                  ]}
                >
                  <ThemedText
                    weight={selected || isToday ? "semibold" : "regular"}
                    style={selected ? { color: colors.accentForeground } : undefined}
                    themeColor={disabledDay ? "mutedForeground" : undefined}
                  >
                    {d.toLocaleString(bcp47)}
                  </ThemedText>
                </PressableScale>
              );
            })}
          </View>
        ))}

        {presets?.length ? (
          <View style={styles.presets}>
            {presets.map((p) => (
              <Chip
                key={p.id}
                label={p.label}
                selected={p.day === current}
                role="radio"
                disabled={outOfRange(p.day)}
                onPress={() => pick(p.day)}
              />
            ))}
          </View>
        ) : null}

        <View style={styles.actions}>
          {canClear ? (
            <Button variant="secondary" label={t("uiField.clearDate")} onPress={() => pick("")} />
          ) : null}
          <Button variant="ghost" label={t("common.cancel")} onPress={() => setOpen(false)} />
        </View>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  value: { flex: 1, minWidth: 0 },
  input: { paddingVertical: Spacing.two },
  header: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.two },
  monthTitle: { flex: 1, textAlign: "center" },
  weekRow: { flexDirection: "row" },
  weekday: { flex: 1, textAlign: "center", paddingVertical: Spacing.one },
  cell: { flex: 1, aspectRatio: 1, maxHeight: 48 },
  dayCell: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thick,
  },
  presets: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.three },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
