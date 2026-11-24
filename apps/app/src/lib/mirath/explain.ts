import type {
  HeirType,
  MirathHeirShare,
  MirathReason,
  MirathResult,
  MirathSpecialCase,
} from "@munib-tracker/shared/mirath";
import type { TFunction } from "i18next";

/** i18n label for an heir type (shared with the wasiyyah builder: `heirs.*`). */
export const heirLabelKey = (heir: HeirType): string => `heirs.${heir}`;

/** "Daughter × 2" style label. */
export function heirCountLabel(t: TFunction, heir: HeirType, count: number): string {
  const label = t(heirLabelKey(heir));
  return count > 1 ? t("mirath.result.countLabel", { label, n: count }) : label;
}

function joinHeirs(t: TFunction, heirs: readonly HeirType[] | undefined): string {
  return (heirs ?? []).map((h) => t(heirLabelKey(h))).join(t("mirath.why.listSeparator"));
}

/** One "Why?" sentence for an engine reason (`mirath.why.<code>`). */
export function explainReason(t: TFunction, reason: MirathReason): string {
  return t(`mirath.why.${reason.code}`, {
    fraction: reason.fraction ?? "",
    by: joinHeirs(t, reason.by),
  });
}

export function explainHeir(t: TFunction, heir: MirathHeirShare): string[] {
  return heir.reasons.map((r) => explainReason(t, r));
}

/** Special-case callouts shown above the table. */
export const SPECIAL_CASE_KEYS: Record<MirathSpecialCase, string> = {
  umariyyatayn: "mirath.special.umariyyatayn",
  mushtarakah: "mirath.special.mushtarakah",
  akdariyyah: "mirath.special.akdariyyah",
  malikiyyah: "mirath.special.malikiyyah",
  shibh_malikiyyah: "mirath.special.shibhMalikiyyah",
  grandfather_siblings: "mirath.special.grandfatherSiblings",
};

/** Plain-text summary lines (share sheet / accessibility). */
export function resultSummary(t: TFunction, result: MirathResult): string[] {
  return result.heirs
    .filter((h) => h.inherits)
    .map((h) =>
      t("mirath.result.summaryLine", {
        heir: heirCountLabel(t, h.heir, h.count),
        fraction: `${h.share.n}/${h.share.d}`,
        percent: h.percent,
      }),
    );
}

export interface MirathLine {
  key: string;
  values: Record<string, string>;
}

/**
 * Base lines above the table: the original base (asl), raised by 'awl or
 * recounted by radd, then the corrected base (tashih) when it differs.
 */
export function baseSummary(result: MirathResult): { base: MirathLine; tashih?: MirathLine } {
  const asl = String(result.asl);
  let base: MirathLine = { key: "mirath.result.base", values: { base: asl } };
  let final = result.asl;
  if (result.awl && result.awlBase != null) {
    base = { key: "mirath.result.awl", values: { from: asl, to: String(result.awlBase) } };
    final = result.awlBase;
  } else if (result.radd && result.raddBase != null && result.raddBase !== result.asl) {
    base = { key: "mirath.result.raddBase", values: { from: asl, to: String(result.raddBase) } };
    final = result.raddBase;
  }
  return result.tashihBase !== final
    ? {
        base,
        tashih: { key: "mirath.result.tashih", values: { base: String(result.tashihBase) } },
      }
    : { base };
}
