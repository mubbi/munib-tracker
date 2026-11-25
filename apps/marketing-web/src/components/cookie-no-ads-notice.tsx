import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

type CookieNoAdsNoticeProps = {
  appName: string;
};

export function CookieNoAdsNotice({ appName }: CookieNoAdsNoticeProps) {
  const t = useTranslations("consent");
  return (
    <div
      role="note"
      className="flex gap-3 rounded-xl border border-brand/30 bg-gradient-to-br from-brand/15 to-brand/5 px-3.5 py-3 sm:gap-3.5 sm:px-4 sm:py-3.5"
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/15 ring-1 ring-brand/35">
        <Info className="size-4 text-brand" strokeWidth={2.25} aria-hidden />
      </span>
      <p className="min-w-0 text-sm leading-relaxed text-white/70">
        {t.rich("noAds", {
          appName,
          strong: (chunks) => <span className="font-semibold text-brand">{chunks}</span>,
        })}
      </p>
    </div>
  );
}
