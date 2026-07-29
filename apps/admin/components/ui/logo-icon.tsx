import Image from "next/image";

interface LogoIconProps {
  className?: string;
}

/** ~iOS app-icon corner curve; matches marketing site LogoIcon. */
export const LOGO_ICON_RADIUS_CLASS = "rounded-[22%]";

/** Munib Tracker app icon. */
export function LogoIcon({
  className = `h-9 w-9 shrink-0 object-cover ${LOGO_ICON_RADIUS_CLASS}`,
}: LogoIconProps) {
  return (
    <Image
      src="/logo-192.png"
      alt=""
      className={className}
      width={192}
      height={192}
      sizes="36px"
      decoding="async"
    />
  );
}
