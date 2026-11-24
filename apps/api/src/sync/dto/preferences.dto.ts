import { sanitizeFiqhPreferenceFields } from "@munib-tracker/shared/validators/fiqh-preferences";
import {
  HIJRI_OFFSET_DAYS,
  sanitizeHijriAdjustment,
} from "@munib-tracker/shared/validators/hijri-adjustment";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsISO8601, IsObject, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * Validation for fields inside the opaque `preferences` sync record. The sync
 * API stores record `data` generically; preference fields with invariants the
 * client relies on are checked here before they are persisted.
 */

/** Mirrors `HijriAdjustment` in `@munib-tracker/shared/types` (D14). */
export class HijriAdjustmentDto {
  @ApiProperty({ enum: HIJRI_OFFSET_DAYS, description: "Whole-calendar shift in days, −2…+2" })
  @IsIn(HIJRI_OFFSET_DAYS as unknown as number[])
  offsetDays!: -2 | -1 | 0 | 1 | 2;

  @ApiPropertyOptional({
    type: "object",
    additionalProperties: { type: "string", format: "date" },
    description: 'Per-month announced starts: "1448-09" → Gregorian ISO date of day 1',
  })
  @IsOptional()
  @IsObject()
  monthStarts?: Record<string, string>;

  @ApiPropertyOptional({ description: "Method fingerprint when corrections were made" })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  basis?: string;

  @ApiPropertyOptional({ description: "Display-only place name for `basis`" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  basisPlace?: string;

  @ApiProperty()
  @IsISO8601()
  updatedAt!: string;
}

/**
 * Returns `data` with invalid validated fields removed (never rejects the whole
 * record, so one bad field from an old client can't block preference sync).
 * Currently:
 * - `hijriAdjustment`: malformed blobs are dropped, invalid per-month
 *   corrections are filtered out by the shared validator;
 * - `madhhab` / `madhhabOverrides` / `fiqhCustom` (NF-3.0a): an unknown school
 *   is dropped, overrides and custom values keep only their valid entries.
 */
export function sanitizePreferencesSyncData(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const fiqhClean = sanitizeFiqhPreferenceFields(data);
  if (!("hijriAdjustment" in fiqhClean)) return fiqhClean;
  const { hijriAdjustment, ...rest } = fiqhClean;
  const clean = sanitizeHijriAdjustment(hijriAdjustment);
  return clean ? { ...rest, hijriAdjustment: clean } : rest;
}
