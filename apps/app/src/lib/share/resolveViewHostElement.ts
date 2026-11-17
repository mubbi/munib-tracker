import type { ViewInstance } from "react-native";

/** Resolves the DOM host element for an RN Web view ref (html2canvas / view-shot web). */
export function resolveViewHostElement(target: ViewInstance): HTMLElement | null {
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) {
    return target;
  }

  const withNode = target as ViewInstance & { getScrollableNode?: () => unknown };
  const node = withNode.getScrollableNode?.() ?? target;
  if (typeof HTMLElement !== "undefined" && node instanceof HTMLElement) {
    return node;
  }

  return null;
}
