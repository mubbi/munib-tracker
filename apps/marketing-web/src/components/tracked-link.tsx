"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import {
  type CtaName,
  type CtaPlacement,
  trackCtaClick,
  trackFileDownload,
  trackOutboundClick,
  trackSelectContent,
} from "@/lib/analytics";

type BaseProps = {
  href: string;
  children: ReactNode;
  className?: string;
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

type TrackedLinkProps = CtaProps | SelectContentProps | OutboundProps | FileDownloadProps;

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
  }
}

/** Client link that fires a GA4 marketing event on click. */
export function TrackedLink(props: TrackedLinkProps) {
  const { href, children, className } = props;
  const isExternal = href.startsWith("http") || props.track === "outbound";
  const isDownload = props.track === "file_download";

  if (isExternal || isDownload) {
    const target = props.track === "outbound" ? (props.target ?? "_blank") : undefined;
    const rel = props.track === "outbound" ? (props.rel ?? "noopener noreferrer") : undefined;
    return (
      <a
        href={href}
        className={className}
        target={target}
        rel={rel}
        onClick={() => fire(props)}
        download={isDownload || undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={() => fire(props)}>
      {children}
    </Link>
  );
}
