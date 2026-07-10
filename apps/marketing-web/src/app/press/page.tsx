import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Image from "next/image";
import { ContentPage, ContentSection } from "@/components/content-page";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Press kit",
  description: `Logos, brand colors, and media resources for ${APP_NAME}.`,
};

const BRAND_COLORS = [
  { name: "Hero green (from)", hex: "#12463A" },
  { name: "Hero green (to)", hex: "#0B2A22" },
  { name: "Brand emerald", hex: "#059669" },
  { name: "Forest accent", hex: "#2E7D32" },
  { name: "Hero gold", hex: "#E4CE9E" },
  { name: "Cream background", hex: "#F5F0E6" },
  { name: "Deep forest text", hex: "#152921" },
] as const;

export default function PressPage() {
  return (
    <ContentPage
      wide
      eyebrow="Press"
      title="Press kit"
      intro={`Media resources for ${APP_NAME} — the offline-first Muslim worship companion.`}
    >
      <ContentSection heading="Boilerplate">
        <p className="text-muted">
          <strong>{APP_NAME}</strong> — {APP_TAGLINE} Available on iOS, Android, and web. Free for
          personal and educational use with no ads. Features include salah tracking, qaza calculator
          and planner, adhkar and tasbeeh, offline Qur&apos;an (surah, juz, 604-page mushaf) and
          hadith, qibla, Hijri events, widgets and watch companions, 23 languages, and optional
          cloud sync — plus a full learning library (aqeedah, prophets, seerah, the Hereafter, and
          Qur&apos;an study) and step-by-step worship guides for salah, wudu, zakat, and hajj.
        </p>
      </ContentSection>

      <ContentSection heading="Brand colors">
        <ul className="grid gap-3 sm:grid-cols-2">
          {BRAND_COLORS.map((color) => (
            <li
              key={color.hex}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3"
            >
              <span
                aria-hidden
                className="size-10 shrink-0 rounded-lg border border-border/40"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <p className="text-sm font-medium">{color.name}</p>
                <p className="font-mono text-xs text-muted">{color.hex}</p>
              </div>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection heading="Typography">
        <ul className="list-inside list-disc text-sm text-muted">
          <li>Display & UI: Spline Sans</li>
          <li>Headlines: Lora (serif accent)</li>
          <li>
            Arabic content in-app: Amiri, Scheherazade New, Noto Naskh Arabic, QPC Hafs
            (user-selectable)
          </li>
        </ul>
      </ContentSection>

      <ContentSection heading="Logo">
        <div className="flex flex-wrap items-end gap-6">
          <figure className="flex flex-col items-center gap-2">
            <Image
              src="/munib-logo.png"
              alt={`${APP_NAME} app icon`}
              width={128}
              height={128}
              className="size-32 rounded-[28px] shadow-md"
            />
            <figcaption className="text-xs text-muted">App icon (PNG)</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <Image
              src="/icon-512.png"
              alt={`${APP_NAME} icon 512px`}
              width={128}
              height={128}
              className="size-32 rounded-[28px] border border-border/60 shadow-sm"
            />
            <figcaption className="text-xs text-muted">
              <a href="/icon-512.png" className="font-medium text-brand hover:underline">
                Download 512×512
              </a>
            </figcaption>
          </figure>
        </div>
        <p className="mt-4 text-sm text-muted">
          Use the official Munib app icon with sufficient contrast. Do not stretch, rotate, or
          recolor the mark. Minimum clear space: one-quarter of the icon width on all sides.
        </p>
      </ContentSection>

      <ContentSection heading="Screenshots">
        <p className="text-muted">
          High-resolution screenshots are available on request. Email us via the{" "}
          <a href="/contact" className="font-medium text-brand hover:underline">
            contact form
          </a>{" "}
          with your publication name and deadline.
        </p>
      </ContentSection>

      <ContentSection heading="Links">
        <ul className="list-inside list-disc text-sm text-muted">
          <li>
            Website: <a href={SITE_URL}>{SITE_URL}</a>
          </li>
          <li>App: iOS and Google Play (coming soon) · Web app available now</li>
        </ul>
      </ContentSection>

      <ContentSection heading="Press contact">
        <p className="text-muted">
          For interviews, review units, or partnership inquiries, use our{" "}
          <a href="/contact" className="font-medium text-brand hover:underline">
            contact page
          </a>{" "}
          with &ldquo;Press&rdquo; in the subject line.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
