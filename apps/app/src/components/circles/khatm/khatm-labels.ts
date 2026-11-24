import type { KhatmPartStatus, KhatmUnit } from "@munib-tracker/shared/circles";
import type { TFunction } from "i18next";

import type { CircleMember, KhatmPart } from "@/lib/circles/api";
import { memberById } from "@/lib/circles/khatm";
import { getSurahByNumber } from "@/lib/quran-meta";

/** "Juz 3" / "Hizb 12" / "Al-Kahf (18)". */
export function khatmPartTitle(unit: KhatmUnit, partNo: number, t: TFunction): string {
  if (unit === "surah") {
    const surah = getSurahByNumber(partNo);
    return surah
      ? t("khatmGroups.unitPart.surahNamed", { name: surah.nameTransliteration, no: partNo })
      : t("khatmGroups.unitPart.surah", { no: partNo });
  }
  return t(`khatmGroups.unitPart.${unit}`, { no: partNo });
}

export function khatmStatusLabel(status: KhatmPartStatus, t: TFunction): string {
  return t(`khatmGroups.status.${status}`);
}

/** Display name chosen for this circle — never the account name. */
export function assigneeName(
  members: readonly CircleMember[] | undefined,
  part: Pick<KhatmPart, "assigneeMemberId">,
  t: TFunction,
): string | null {
  if (!part.assigneeMemberId) return null;
  const member = memberById(members, part.assigneeMemberId);
  if (!member) return t("khatmGroups.formerMember");
  if (member.isMe) return t("khatmGroups.you");
  return member.displayName ?? t("khatmGroups.unnamedMember");
}

/** Full accessibility label for a grid cell. */
export function partAccessibilityLabel(
  unit: KhatmUnit,
  part: KhatmPart,
  members: readonly CircleMember[] | undefined,
  t: TFunction,
): string {
  const who = assigneeName(members, part, t);
  const bits = [khatmPartTitle(unit, part.partNo, t), khatmStatusLabel(part.status, t)];
  if (who) bits.push(who);
  if (part.stale) bits.push(t("khatmGroups.staleShort"));
  return bits.join(", ");
}
