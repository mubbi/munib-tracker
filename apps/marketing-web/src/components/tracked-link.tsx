"use client";

import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import {
  type CtaName,
  type CtaPlacement,
  type DownloadPlacement,
  trackCtaClick,
  trackFileDownload,
  trackOutboundClick,
  trackSelectContent,
  trackWebDemoLaunch,
} from "@/lib/analytics";

type BaseProps = {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

type CtaProps = BaseProps & {
  track: "cta";
  cta: CtaName;
  placement: CtaPlacement;
};

type SelectContentProps = BaseProps & {
  track: "select_content";
  contentType: string;
  itemId: string;
  placement?: string;
};

type OutboundProps = BaseProps & {
  track: "outbound";
  linkText: string;
  placement?: string;
  target?: ComponentProps<"a">["target"];
  rel?: string;
};

type FileDownloadProps = BaseProps & {
  track: "file_download";
  fileName: string;
  placement: string;
};

/** Opens the product web app in a new tab (`download_click` with platform "web"). */
type WebDemoProps = BaseProps & {
  track: "web_demo";
  placement: DownloadPlacement;
};

type TrackedLinkProps =
  | CtaProps
  | SelectContentProps
  | OutboundProps
  | FileDownloadProps
  | WebDemoProps;

function fire(props: TrackedLinkProps): void {
  switch (props.track) {
    case "cta":
      trackCtaClick(props.cta, props.placement);
      return;
    case "select_content":
      trackSelectContent({
        content_type: props.contentType,
        item_id: props.itemId,
        link_url: props.href,
        placement: props.placement,
      });
      return;
    case "outbound":
      trackOutboundClick(props.href, props.linkText, props.placement);
      return;
    case "file_download":
      trackFileDownload({
        file_name: props.fileName,
        link_url: props.href,
        placement: props.placement,
      });
      return;
    case "web_demo":
      trackWebDemoLaunch(props.placement);
      return;
  }
}

const NEW_TAB = { target: "_blank", rel: "noopener noreferrer" } as const;

/** `target`/`rel` for links that leave the site in a new tab. */
function newTabAttrs(props: TrackedLinkProps): { target?: string; rel?: string } {
  if (props.track === "outbound") {
    return { target: props.target ?? NEW_TAB.target, rel: props.rel ?? NEW_TAB.rel };
  }
  return props.track === "web_demo" ? NEW_TAB : {};
}

/** Client link that fires a GA4 marketing event on click. */
export function TrackedLink(props: TrackedLinkProps) {
  const { href, children, className, "aria-label": ariaLabel } = props;
  const isExternal =
    href.startsWith("http") || props.track === "outbound" || props.track === "web_demo";
  const isDownload = props.track === "file_download";

  if (isExternal || isDownload) {
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        {...newTabAttrs(props)}
        onClick={() => fire(props)}
        download={isDownload || undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel} onClick={() => fire(props)}>
      {children}
    </Link>
  );
}
