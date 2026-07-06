import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { Aurora, GridBackdrop } from "@/components/ui/backgrounds";
import { Button } from "@/components/ui/button";
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="relative isolate flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-6 py-28 text-center">
      <Aurora />
      <GridBackdrop className="opacity-50" />
      <p className="text-gradient font-display text-7xl font-extrabold tracking-tight md:text-8xl">
        404
      </p>
      <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
        This page has wandered off
      </h1>
      <p className="max-w-md text-muted">
        The page you are looking for does not exist or has moved. Let&apos;s get you back on the
        path.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Button href={SITE_PATHS.home}>Return home</Button>
        <Button href={SITE_PATHS.features} variant="outline">
          Explore {APP_NAME}
        </Button>
      </div>
    </section>
  );
}
