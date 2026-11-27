import { ArrowUpRight, Smartphone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { StoreBadges } from "@/components/store-badges";
import { TrackedLink } from "@/components/tracked-link";
import { buttonClass } from "@/components/ui/button";
import type { FeatureSlug } from "@/content/types";
import { featureWebAppPath } from "@/content/web-app";
import type { Locale } from "@/i18n/routing";
import { webAppUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Feature-page hero actions: "Try it free in your browser" opens this
 * feature's screen in the web app (no download, no account), with the store
 * badges underneath. A feature that needs the phone app says so and shows the
 * badges only. Clicks are tagged with the feature for attribution.
 */
export function TryFeature({ slug }: { slug: FeatureSlug }) {
  const t = useTranslations("templates.tryIt");
  const locale = useLocale() as Locale;
  const path = featureWebAppPath(slug);

  if (path === null) {
    return (
      <div className="flex flex-col gap-3">
        <p className="inline-flex items-center gap-2 text-sm text-white/70">
          <Smartphone aria-hidden className="size-4 shrink-0 text-brand" />
          {t("appOnly")}
        </p>
        <StoreBadges placement="feature_hero" feature={slug} webAppPath={null} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <TrackedLink
          track="web_demo"
          placement="feature_hero"
          feature={slug}
          href={webAppUrl(locale, path, { placement: "feature_hero", content: slug })}
          className={buttonClass("primary", "lg", "w-fit")}
        >
          {t("button")}
          <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </TrackedLink>
        <p className="text-sm text-white/60">{t("hint")}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-white/75">{t("orApp")}</p>
        <StoreBadges placement="feature_hero" feature={slug} webAppPath={null} />
      </div>
    </div>
  );
}

/** "Try it in your browser" link for a feature (guides' tie-in box); nothing when app-only. */
export function TryFeatureLink({ slug, className }: { slug: FeatureSlug; className?: string }) {
  const t = useTranslations("templates.tryIt");
  const locale = useLocale() as Locale;
  const path = featureWebAppPath(slug);
  if (path === null) return null;
  return (
    <TrackedLink
      track="web_demo"
      placement="article_tie_in"
      feature={slug}
      href={webAppUrl(locale, path, { placement: "article_tie_in", content: slug })}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand hover:underline",
        className,
      )}
    >
      {t("link")}
      <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" />
    </TrackedLink>
  );
}
