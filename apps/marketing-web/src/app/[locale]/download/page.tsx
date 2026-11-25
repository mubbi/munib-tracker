import { APP_NAME } from "@munib-tracker/shared/constants";
import type { LucideIcon } from "lucide-react";
import { Apple, Globe, Smartphone, Tv, Watch } from "lucide-react";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { ContentPage, ContentSection } from "@/components/content-page";
import { StoreBadges } from "@/components/store-badges";
import { TrackedButton } from "@/components/tracked-button";
import { TrackedWebAppButton } from "@/components/tracked-web-app-button";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { pageMetadata } from "@/lib/seo";
import { productAppUrl, storeUrls } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("download");
  return pageMetadata({
    locale: await getLocale(),
    path: "/download",
    title: t("meta.title", { appName: APP_NAME }),
    description: t("meta.description", { appName: APP_NAME }),
  });
}

/** Store brand names are never translated; they reach the catalog as ICU params. */
const STORE_NAMES = { appStore: "App Store", googlePlay: "Google Play" } as const;

/** Structure only; copy is keyed by `id` in `download.platforms`. */
type Platform =
  | {
      id: "web" | "ios" | "android";
      icon: LucideIcon;
      cta: { kind: "web" } | { kind: "store"; store: "ios" | "android"; cta: "get_app" };
    }
  | { id: "watch" | "tv"; icon: LucideIcon; cta: null };

const PLATFORMS: Platform[] = [
  { id: "web", icon: Globe, cta: { kind: "web" } },
  {
    id: "ios",
    icon: Apple,
    cta: { kind: "store", store: "ios", cta: "get_app" },
  },
  {
    id: "android",
    icon: Smartphone,
    cta: { kind: "store", store: "android", cta: "get_app" },
  },
  { id: "watch", icon: Watch, cta: null },
  { id: "tv", icon: Tv, cta: null },
];

const REQUIREMENTS = ["web", "ios", "android", "watch", "tv", "internet"] as const;

export default function DownloadPage() {
  const t = useTranslations("download");
  const locale = useLocale();
  // Store listings and the web app open in the visitor's language.
  const stores = storeUrls(locale);
  const values = { appName: APP_NAME, ...STORE_NAMES };
  return (
    <ContentPage
      path="/download"
      wide
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro", { appName: APP_NAME })}
    >
      <Stagger className="grid gap-5 md:grid-cols-3">
        {PLATFORMS.map((platform) => {
          const Icon = platform.icon;
          return (
            <StaggerItem key={platform.id} className="min-h-full">
              <SpotlightCard className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                    {t("available")}
                  </span>
                </div>
                <p className="mt-4 font-display text-lg font-semibold text-foreground">
                  {t(`platforms.${platform.id}.name`)}
                </p>
                <p className="text-sm font-medium text-brand">
                  {t(`platforms.${platform.id}.status`, values)}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {t(`platforms.${platform.id}.description`, values)}
                </p>
                {platform.cta ? (
                  <div className="mt-6">
                    {platform.cta.kind === "web" ? (
                      <TrackedWebAppButton
                        href={productAppUrl(locale)}
                        label={t(`platforms.${platform.id}.cta`, values)}
                      />
                    ) : (
                      <TrackedButton
                        href={stores[platform.cta.store]}
                        cta={platform.cta.cta}
                        placement="download"
                        size="sm"
                      >
                        {t(`platforms.${platform.id}.cta`, values)}
                      </TrackedButton>
                    )}
                  </div>
                ) : null}
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </Stagger>

      <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-border/60 bg-surface/60 p-8 text-center">
        <p className="font-display text-lg font-semibold text-foreground">{t("grabIt")}</p>
        <StoreBadges className="justify-center" placement="download" />
      </div>

      <ContentSection heading={t("requirements.heading")}>
        <ul className="list-inside list-disc text-muted">
          {REQUIREMENTS.map((id) => (
            <li key={id}>{t(`requirements.items.${id}`)}</li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection heading={t("guest.heading")}>
        <p className="text-muted">{t("guest.body")}</p>
      </ContentSection>
    </ContentPage>
  );
}
