import { useLocale } from "next-intl";
import type { ReactNode } from "react";
import { TrackedLink } from "@/components/tracked-link";
import type { Locale } from "@/i18n/config";
import { contentAppUrl } from "@/lib/site";

/**
 * A product web-app link from content data (Qur'an / hadith citations,
 * inline `[label](https://my.munibtracker.app/…)` links): opened in the
 * page's language, campaign-tagged, and tracked as a web-app launch.
 */
export function ProductAppLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const locale = useLocale() as Locale;
  return (
    <TrackedLink
      track="web_demo"
      placement="content_link"
      href={contentAppUrl(href, locale)}
      className={className}
    >
      {children}
    </TrackedLink>
  );
}
