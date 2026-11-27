import { BadgeCheck, Ban, UserRound, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { StoreBadges } from "@/components/store-badges";
import type { DownloadPlacement } from "@/lib/analytics";

/** Proof points; copy is `templates.downloadCta.<id>`. */
const PROOF = [
  { id: "noAds", icon: Ban },
  { id: "noAccount", icon: UserRound },
  { id: "offline", icon: WifiOff },
  { id: "noSubscriptions", icon: BadgeCheck },
] as const;

/** Page-specific closing download CTA (App Store, Google Play, web app). */
export function DownloadCta({
  title,
  text,
  placement,
  feature,
  webAppPath,
}: {
  title: string;
  text: string;
  placement: DownloadPlacement;
  /** Feature slug the page promotes (analytics attribution). */
  feature?: string;
  /** Web-app route for the web badge; `null` hides it (app-only feature). */
  webAppPath?: string | null;
}) {
  const t = useTranslations("templates.downloadCta");
  return (
    <section aria-labelledby="download-cta-title" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,#0f3a30_0%,#0b2734_55%,#13213a_100%)] px-6 py-12 text-center shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] md:px-14 md:py-16">
          <div
            aria-hidden
            className="islamic-tiles-soft pointer-events-none absolute inset-0 opacity-[0.08] [mask-image:radial-gradient(70%_80%_at_50%_0%,#000,transparent_75%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-[#e0a85c]/15 blur-3xl"
          />
          <div className="relative">
            <h2
              id="download-cta-title"
              className="mx-auto max-w-2xl text-balance font-display text-3xl font-bold tracking-tight text-white md:text-[2.5rem] md:leading-[1.12]"
            >
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-white/75">
              {text}
            </p>
            <StoreBadges
              className="mt-9 justify-center"
              placement={placement}
              feature={feature}
              webAppPath={webAppPath}
            />
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/70">
              {PROOF.map(({ id, icon: Icon }) => (
                <li key={id} className="inline-flex items-center gap-2">
                  <Icon aria-hidden className="size-4 text-brand" />
                  {t(id)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
