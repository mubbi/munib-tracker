import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { DeviceScreen } from "@/components/content/device-screen";
import { PageSection } from "@/components/content/primitives";
import { TrackedLink } from "@/components/tracked-link";
import { capture, captureAlt, type Device } from "@/lib/screenshots";
import { cn } from "@/lib/utils";

type Item = {
  /** Key under `home.devices.items`. */
  id: "tv" | "androidTablet" | "iphone" | "android" | "ipad" | "watch" | "wear";
  device: Device;
  scene: string;
  /** Width of the framed device inside its tile. */
  fit: string;
  sizes: string;
  /** `crop`: anchored to the top and faded out at the tile's bottom edge. */
  align: "center" | "crop";
  /** Extra classes for the tile (grid span). */
  tile?: string;
};

/** Big screens: one wide row. */
const LARGE: readonly Item[] = [
  {
    id: "tv",
    device: "tv",
    scene: "quran",
    fit: "w-full max-w-[34rem]",
    sizes: "(min-width: 1024px) 544px, 90vw",
    align: "center",
    tile: "lg:col-span-7",
  },
  {
    id: "androidTablet",
    device: "android-tablet",
    scene: "tracker",
    fit: "w-full max-w-[26rem]",
    sizes: "(min-width: 1024px) 416px, 90vw",
    align: "center",
    tile: "lg:col-span-5",
  },
];

/** Handhelds and watches: two columns on phones, one row of five on desktop. */
const SMALL: readonly Item[] = [
  {
    id: "iphone",
    device: "iphone",
    scene: "tasbeeh",
    fit: "w-full max-w-[150px]",
    sizes: "(min-width: 1024px) 150px, 40vw",
    align: "crop",
  },
  {
    id: "android",
    device: "android",
    scene: "names",
    fit: "w-full max-w-[150px]",
    sizes: "(min-width: 1024px) 150px, 40vw",
    align: "crop",
  },
  {
    id: "ipad",
    device: "ipad",
    scene: "home",
    fit: "w-full max-w-[230px] lg:max-w-[190px]",
    sizes: "(min-width: 1024px) 190px, 230px",
    align: "crop",
    tile: "col-span-2 lg:col-span-1",
  },
  {
    id: "watch",
    device: "watch",
    scene: "schedule",
    fit: "w-full max-w-[100px]",
    sizes: "100px",
    align: "center",
  },
  {
    id: "wear",
    device: "wear",
    scene: "tasbeeh-tile",
    fit: "w-full max-w-[112px]",
    sizes: "112px",
    align: "center",
  },
];

/**
 * "On every screen": the app's real captures in each device's own frame —
 * TV, Android tablet, iPhone, Android phone, iPad, Apple Watch and Wear OS —
 * in the visitor's language (watches fall back to English). Below the fold,
 * so every image lazy-loads.
 */
export function DeviceShowcase() {
  const t = useTranslations("home.devices");
  const ts = useTranslations("screenshots");
  const locale = useLocale();

  const tile = (item: Item, stage: string) => {
    const shot = {
      ...capture(item.device, item.scene, locale),
      alt: captureAlt(ts, item.device, item.scene),
    };
    return (
      <figure
        key={item.id}
        className={cn(
          "flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015))]",
          item.tile,
        )}
      >
        <div
          className={cn(
            "relative flex flex-1 justify-center overflow-hidden px-4",
            stage,
            item.align === "crop"
              ? "items-start pt-6 [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]"
              : "items-center py-6",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,185,104,0.16)_0%,transparent_65%)]"
          />
          <DeviceScreen shot={shot} className={item.fit} sizes={item.sizes} />
        </div>
        <figcaption className="border-t border-white/[0.06] px-5 py-4">
          <span className="block font-display font-semibold text-white">
            {t(`items.${item.id}.name`)}
          </span>
          <span className="mt-0.5 block text-sm leading-snug text-white/60">
            {t(`items.${item.id}.text`)}
          </span>
        </figcaption>
      </figure>
    );
  };

  return (
    <PageSection id="devices" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
      <div className="grid gap-4 lg:grid-cols-12">
        {LARGE.map((item) => tile(item, "min-h-[220px] sm:min-h-[300px] sm:px-8"))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {SMALL.map((item) => tile(item, "h-[250px] sm:h-[270px]"))}
      </div>
      <TrackedLink
        href="/features/widgets-and-devices"
        className="mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
        track="select_content"
        contentType="feature"
        itemId="widgets-and-devices"
        placement="home_devices"
      >
        {t("more")} <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
      </TrackedLink>
    </PageSection>
  );
}
