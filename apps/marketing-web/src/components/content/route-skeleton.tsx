import { PageAtmosphere } from "@/components/content-page";

/**
 * Suspense fallback for routes that read URL data (`params`).
 *
 * With `cacheComponents` + `partialPrefetching`, a route's App Shell is shared
 * by every link to it, so `params` must be read inside a `<Suspense>` boundary
 * (Next.js "instant-shell-url-data"; see node_modules/next/dist/docs/01-app/
 * 02-guides/adopting-partial-prefetching.md, "Move URL data behind Suspense").
 * Every slug is listed in `generateStaticParams`, so the prerendered HTML is
 * complete; this placeholder only shows during a client-side navigation while
 * the page's content streams in.
 */
export function RouteSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="relative overflow-hidden">
      <span className="sr-only">Loading…</span>
      <PageAtmosphere />
      <div
        aria-hidden
        className="relative mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-12 pt-6 motion-safe:animate-pulse md:px-8 md:pb-16 md:pt-10"
      >
        <div className="h-3 w-40 rounded-full bg-white/10" />
        <div className="mt-4 h-3 w-24 rounded-full bg-white/10" />
        <div className="h-10 w-full max-w-2xl rounded-xl bg-white/10" />
        <div className="h-4 w-full max-w-xl rounded-full bg-white/8" />
        <div className="h-4 w-2/3 max-w-lg rounded-full bg-white/8" />
      </div>
    </div>
  );
}
