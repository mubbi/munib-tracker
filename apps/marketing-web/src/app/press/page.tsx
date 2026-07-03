import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
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
          personal and educational use with no ads. Features include prayer tracking, qaza
          calculator and planner, adhkar and tasbeeh, offline Qur'an and hadith, qibla, Hijri
          calendar, and optional cloud sync.
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
          <li>Arabic content in-app: system serif stack</li>
        </ul>
      </ContentSection>

      <ContentSection heading="Logo">
        <div className="flex flex-wrap gap-4">
          <div className="flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-hero-from to-hero-to text-3xl text-hero-gold shadow-md">
            ﷽
          </div>
          <div className="flex size-24 items-center justify-center rounded-2xl border border-border bg-card text-3xl">
            ﷽
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">
          Use the Bismillah mark or wordmark &ldquo;{APP_NAME}&rdquo; with sufficient contrast. Do
          not stretch or recolor the hero gradient arbitrarily.
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
