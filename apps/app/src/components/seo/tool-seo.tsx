import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Seo } from "@/components/seo/seo";
import { SEO_APP } from "@/config/seo";
import { getRouteSeo } from "@/config/seo-routes";
import { type BreadcrumbEntry, webApplicationSchema } from "@/lib/seo/structured-data";

/**
 * `<Seo>` for an interactive tool page (Qibla, converters, calculators, finders):
 * Home → tool breadcrumbs plus WebApplication JSON-LD when the route's registry
 * entry declares an `applicationCategory`. Title / description / index come
 * from the registry (`seo-routes.data.json`) like every other `<Seo>`.
 *
 * `name` is the visible (localized) tool name used for the breadcrumb.
 * `jsonLd` adds page-specific blocks (e.g. a CollectionPage of the tool's guides).
 */
export function ToolSeo({
  path,
  name,
  jsonLd,
}: {
  path: string;
  name: string;
  jsonLd?: Record<string, unknown>[];
}) {
  const { t } = useTranslation();
  const breadcrumbs = useMemo<BreadcrumbEntry[]>(
    () => [
      { name: t("tabs.home"), path: "/" },
      { name, path },
    ],
    [t, name, path],
  );
  const blocks = useMemo(() => {
    const entry = getRouteSeo(path);
    const out: Record<string, unknown>[] = [];
    if (entry?.applicationCategory && entry.index !== false) {
      out.push(
        webApplicationSchema({
          path,
          name: entry.title ?? name,
          description: entry.description ?? SEO_APP.description,
          applicationCategory: entry.applicationCategory,
        }),
      );
    }
    if (jsonLd) out.push(...jsonLd);
    return out;
  }, [path, name, jsonLd]);

  return <Seo path={path} breadcrumbs={breadcrumbs} jsonLd={blocks} />;
}
