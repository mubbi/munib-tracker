import { useTranslation } from "react-i18next";

import { DateField } from "@/components/ui/date-field";
import { type DayPresetId, normalizeDayInput } from "@/lib/records/day";

/**
 * A calendar-day field for the private records (`YYYY-MM-DD` stored): the shared
 * `DateField` — a calendar sheet with the locale's week start, typed entry on web
 * and quick presets (e.g. "In 1 month"). `onChangeText` keeps reporting the same
 * ISO string ("" when cleared), so stored values are unchanged.
 */
export function DayInput({
  label,
  value,
  onChangeText,
  hint,
  presets,
  optional,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  /** Shown under the field. */
  hint?: string;
  presets?: ReadonlyArray<{ id: DayPresetId; day: string }>;
  optional?: boolean;
  error?: string;
}) {
  const { t } = useTranslation();
  // Legacy free-typed values (2026/1/5) are normalised so the field can show them; text that is
  // not a real day shows empty (the form's own error says what is wrong).
  const day = value.trim() ? (normalizeDayInput(value) ?? "") : "";
  return (
    <DateField
      label={label}
      value={day}
      onChange={onChangeText}
      helperText={hint}
      error={error}
      optional={optional}
      presets={presets?.map((p) => ({
        id: p.id,
        label: t(`common.dateInput.preset.${p.id}`),
        day: p.day,
      }))}
    />
  );
}
