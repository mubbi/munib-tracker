"use client";

import { Button } from "@/components/ui/button";
import { trackWebDemoLaunch } from "@/lib/analytics";

type TrackedWebAppButtonProps = {
  href: string;
  label: string;
};

/** Download-page CTA for opening the product web app. */
export function TrackedWebAppButton({ href, label }: TrackedWebAppButtonProps) {
  return (
    <Button href={href} size="sm" onClick={() => trackWebDemoLaunch("download")}>
      {label}
    </Button>
  );
}
