import type {
  ContentReportKind,
  ContentReportReference,
} from "@munib-tracker/shared/types/content-report";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { buildContentReportRef } from "@/lib/content-report-ref";

type GuideTopic = {
  id: string;
  title: string;
  summary?: string;
};

/** Builds a report reference for learn-guide topic screens. */
export function useGuideContentReportRef(
  kind: ContentReportKind,
  topic: GuideTopic | null | undefined,
  routePrefix: string,
  disclaimerTextKey?: string,
): ContentReportReference | undefined {
  const { i18n } = useTranslation();
  const locale = i18n.language?.split("-")[0] ?? "en";

  return useMemo(() => {
    if (!topic) return undefined;
    return buildContentReportRef(kind, topic.id, `${routePrefix}/${topic.id}`, locale, {
      snapshot: {
        title: topic.title,
        translation: topic.summary,
        reference: disclaimerTextKey,
      },
    });
  }, [disclaimerTextKey, kind, locale, routePrefix, topic]);
}
