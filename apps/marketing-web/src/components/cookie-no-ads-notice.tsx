import { Info } from "lucide-react";

type CookieNoAdsNoticeProps = {
  appName: string;
};

export function CookieNoAdsNotice({ appName }: CookieNoAdsNoticeProps) {
  return (
    <div
      role="note"
      className="flex gap-3 rounded-xl border border-brand/30 bg-gradient-to-br from-brand/15 to-brand/5 px-3.5 py-3 sm:gap-3.5 sm:px-4 sm:py-3.5"
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/15 ring-1 ring-brand/35">
        <Info className="size-4 text-brand" strokeWidth={2.25} aria-hidden />
      </span>
      <p className="min-w-0 text-sm leading-relaxed text-white/70">
        <span className="font-semibold text-brand">
          No advertising or marketing tracking — ever.
        </span>{" "}
        We never use cookies to build an ad profile, retarget you, or sell your data. Optional
        analytics, if you enable them, only help us improve {appName}.
      </p>
    </div>
  );
}
