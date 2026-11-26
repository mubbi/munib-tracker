import type { BuiltInElementId, ElementId, TextElementId } from "./types";

export const BUILT_IN_ELEMENT_IDS: BuiltInElementId[] = [
  "caption",
  "device",
  "deviceSecondary",
  "lens",
  "features",
];

export const TEXT_ELEMENT_PREFIX = "text:";

export function isBuiltInElementId(id: ElementId | string): id is BuiltInElementId {
  return (BUILT_IN_ELEMENT_IDS as string[]).includes(id);
}

export function isTextElementId(id: ElementId | string | null | undefined): id is TextElementId {
  return typeof id === "string" && id.startsWith(TEXT_ELEMENT_PREFIX);
}

export function toTextElementId(id: string): TextElementId {
  return `${TEXT_ELEMENT_PREFIX}${id}` as TextElementId;
}

export function textElementKey(id: TextElementId | ElementId): string {
  return isTextElementId(id) ? id.slice(TEXT_ELEMENT_PREFIX.length) : id;
}

/** Stacking order before the user reorders layers: secondary device < device < caption < features < lens < text. */
export function defaultElementZ(id: ElementId): number {
  if (isTextElementId(id)) return 6;
  if (id === "deviceSecondary") return 2;
  if (id === "device") return 3;
  if (id === "lens") return 5;
  if (id === "features") return 4;
  return 4; // caption
}
