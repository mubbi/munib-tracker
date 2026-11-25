import { APP_NAME } from "@munib-tracker/shared/constants";
import { useTranslations } from "next-intl";
import { TrackedButton } from "@/components/tracked-button";
import { Aurora, IslamicPatternBackdrop } from "@/components/ui/backgrounds";
import { SITE_PATHS } from "@/lib/site";

/** 404 body shared by `[locale]/not-found.tsx` and `app/global-not-found.tsx`. */
export function NotFoundContent() {
  const t = useTranslations("notFound");
  return (
    <section className="relative isolate flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-6 py-28 text-center">
      <Aurora />
      <IslamicPatternBackdrop />
      <p className="text-gradient font-display text-7xl font-extrabold tracking-tight md:text-8xl">
        {t("code")}
      </p>
      <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{t("heading")}</h1>
      <p className="max-w-md text-muted">{t("body")}</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <TrackedButton href={SITE_PATHS.home} cta="return_home" placement="not_found">
          {t("returnHome")}
        </TrackedButton>
        <TrackedButton
          href={SITE_PATHS.features}
          variant="outline"
          cta="explore_features"
          placement="not_found"
        >
          {t("explore", { appName: APP_NAME })}
        </TrackedButton>
      </div>
    </section>
  );
}
