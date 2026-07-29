import type {
  ContentReportKind,
  ContentReportReference,
  ContentReportSnapshot,
} from "@munib-tracker/shared/types/content-report";

export function buildContentReportRef(
  kind: ContentReportKind,
  contentId: string,
  route: string,
  locale: string,
  options?: { parentId?: string; snapshot?: ContentReportSnapshot },
): ContentReportReference {
  return {
    kind,
    contentId,
    parentId: options?.parentId,
    route,
    locale,
    snapshot: options?.snapshot,
  };
}
