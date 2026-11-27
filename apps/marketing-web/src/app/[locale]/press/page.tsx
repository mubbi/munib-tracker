import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { DeviceLineup } from "@/components/content/device-lineup";
import { ContentPage, ContentSection } from "@/components/content-page";
import { TrackedLink } from "@/components/tracked-link";
import { Link } from "@/i18n/navigation";
import { PROJECT_LICENSE_NAME } from "@/lib/open-source";
import { pageMetadata } from "@/lib/seo";
import { GITHUB_REPO_URL, productAppUrl, SITE_PATHS, SITE_URL, storeUrls } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("press");
  return pageMetadata({
    locale: await getLocale(),
    path: "/press",
    title: t("meta.title"),
    description: t("meta.description", { appName: APP_NAME }),
  });
}

/** Copy for each swatch is keyed by `id` in `press.colors.names`. */
const BRAND_COLORS = [
  { id: "heroFrom", hex: "#12463A" },
  { id: "heroTo", hex: "#0B2A22" },
  { id: "emerald", hex: "#059669" },
  { id: "forest", hex: "#2E7D32" },
  { id: "gold", hex: "#E4CE9E" },
  { id: "cream", hex: "#F5F0E6" },
  { id: "text", hex: "#152921" },
] as const;

/** Store brand names are never translated. */
const APP_STORE = "App Store";
const GOOGLE_PLAY = "Google Play";

const TYPOGRAPHY = ["app", "website", "arabic"] as const;

const linkClass = "font-medium text-brand hover:underline";

/** `t.rich` renderer for an internal link. Pass `dir="ltr"` when the link text is a raw URL. */
function internal(href: string, dir?: "ltr") {
  return (chunks: ReactNode) => (
    <Link href={href} dir={dir} className={linkClass}>
      {chunks}
    </Link>
  );
}

/** `t.rich` renderer for an external link (new tab). Pass `dir="ltr"` when the link text is a raw URL. */
function external(href: string, dir?: "ltr") {
  return (chunks: ReactNode) => (
    <a href={href} dir={dir} className={linkClass} rel="noopener noreferrer" target="_blank">
      {chunks}
    </a>
  );
}

export default function PressPage() {
  const t = useTranslations("press");
  const tMeta = useTranslations("metadata");
  const tOpenSource = useTranslations("openSource");
  const locale = useLocale();
  const stores = storeUrls(locale, { placement: "press" });
  return (
    <ContentPage
      path="/press"
      wide
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro", { appName: APP_NAME })}
    >
      <ContentSection heading={t("boilerplate.heading")}>
        <p className="text-muted">
          {t.rich("boilerplate.body", {
            appName: APP_NAME,
            tagline: tMeta("tagline"),
            license: PROJECT_LICENSE_NAME,
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <p className="mt-4 text-sm text-muted">{tOpenSource("summary", { appName: APP_NAME })}</p>
      </ContentSection>

      <ContentSection heading={t("colors.heading")}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {BRAND_COLORS.map((color) => (
            <li
              key={color.hex}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3"
            >
              <span
                aria-hidden
                className="size-10 shrink-0 rounded-lg border border-border/40"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <p className="text-sm font-medium">{t(`colors.names.${color.id}`)}</p>
                <p className="font-mono text-xs text-muted">{color.hex}</p>
              </div>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection heading={t("typography.heading")}>
        <ul className="list-inside list-disc text-sm text-muted">
          {TYPOGRAPHY.map((id) => (
            <li key={id}>{t(`typography.items.${id}`)}</li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection heading={t("logo.heading")}>
        <div className="flex flex-wrap items-end gap-6">
          <figure className="flex flex-col items-center gap-2">
            <Image
              src="/munib-logo.png"
              alt={t("logo.iconAlt", { appName: APP_NAME })}
              width={128}
              height={128}
              className="size-32 rounded-[28px] shadow-md"
            />
            <figcaption className="text-xs text-muted">{t("logo.iconCaption")}</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <Image
              src="/icon-512.png"
              alt={t("logo.icon512Alt", { appName: APP_NAME })}
              width={128}
              height={128}
              className="size-32 rounded-[28px] border border-border/60 shadow-sm"
            />
            <figcaption className="text-xs text-muted">
              <TrackedLink
                href="/icon-512.png"
                className={linkClass}
                track="file_download"
                fileName="icon-512.png"
                placement="press"
              >
                {t("logo.download512")}
              </TrackedLink>
            </figcaption>
          </figure>
        </div>
        <p className="mt-4 text-sm text-muted">{t("logo.usage")}</p>
      </ContentSection>

      <ContentSection heading={t("screenshots.heading")}>
        <p className="text-muted">{t("screenshots.gallery", { appName: APP_NAME })}</p>
        <DeviceLineup
          className="mt-6"
          footer={(shot, device) => (
            <TrackedLink
              href={shot.src}
              className={linkClass}
              track="file_download"
              fileName={shot.src.split("/").slice(2).join("-")}
              placement="press"
              aria-label={t("screenshots.downloadLabel", { device })}
            >
              {t("screenshots.download")}
            </TrackedLink>
          )}
        />
        <p className="mt-6 text-muted">
          {t.rich("screenshots.body", {
            features: internal(SITE_PATHS.features),
            contact: internal(SITE_PATHS.contact),
          })}
        </p>
      </ContentSection>

      <ContentSection heading={t("links.heading")}>
        <ul className="list-inside list-disc text-sm text-muted">
          <li>
            {t.rich("links.website", {
              url: SITE_URL,
              link: (chunks) => (
                <a href={SITE_URL} dir="ltr">
                  {chunks}
                </a>
              ),
            })}
          </li>
          <li>
            {t.rich("links.openSource", {
              url: `${SITE_URL}${SITE_PATHS.openSource}`,
              link: internal(SITE_PATHS.openSource, "ltr"),
            })}
          </li>
          <li>
            {t.rich("links.github", {
              url: GITHUB_REPO_URL,
              link: external(GITHUB_REPO_URL, "ltr"),
            })}
          </li>
          <li>
            {t.rich("links.app", {
              appStore: APP_STORE,
              googlePlay: GOOGLE_PLAY,
              appStoreLink: external(stores.ios),
              googlePlayLink: external(stores.android),
              webAppLink: external(productAppUrl(locale)),
            })}
          </li>
        </ul>
      </ContentSection>

      <ContentSection heading={t("pressContact.heading")}>
        <p className="text-muted">
          {t.rich("pressContact.body", { contact: internal(SITE_PATHS.contact) })}
        </p>
      </ContentSection>
    </ContentPage>
  );
}
