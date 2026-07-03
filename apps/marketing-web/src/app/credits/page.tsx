import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Credits",
  description: `Open data sources and attributions for ${APP_NAME}.`,
};

const BUNDLED_SOURCES = [
  {
    name: "Adhkar & duas",
    license: "Text: public domain (Qur'an & Hadith). Audio: streamed.",
    attribution:
      "fitrahive/dua-dhikr (Arabic, transliteration, translation) + Hisnul Muslim. Audio matched to sheikhhanif/Hisnul_Muslim_Database.",
    url: "https://github.com/fitrahive/dua-dhikr",
  },
  {
    name: "Hadith highlights",
    license: "Classical / public-domain hadith text",
    attribution: "Nawawi 40, Riyad as-Salihin via AhmedBaset/hadith-json (sunnah.com).",
    url: "https://sunnah.com/",
  },
  {
    name: "99 Names of Allah",
    license: "Text: public domain. Audio: streamed.",
    attribution:
      "Standard Tirmidhi enumeration. Audio via ProgrammerHasan/99-names-of-allah-audios.",
    url: "https://sunnah.com/tirmidhi:3507",
  },
  {
    name: "Qur'an core",
    license: "Qur'an text: public domain. Translations: respective authors.",
    attribution: "Arabic Uthmani text and bundled translation.",
    url: "https://github.com/fawazahmed0/quran-api",
  },
] as const;

const RUNTIME_SOURCES = [
  {
    name: "Extra Qur'an translations",
    attribution: "Saheeh International & Clear Qur'an (Khattab) fetched on demand.",
    url: "https://github.com/fawazahmed0/quran-api",
  },
  {
    name: "Full hadith collections",
    attribution: "The six books via fawazahmed0/hadith-api.",
    url: "https://github.com/fawazahmed0/hadith-api",
  },
  {
    name: "Qur'an recitation audio",
    attribution: "Per-ayah recitations from everyayah.com.",
    url: "https://everyayah.com/",
  },
  {
    name: "Audio translation & adhkar audio",
    attribution: "QuranicAudio.com and Internet Archive.",
    url: "https://archive.org/",
  },
  {
    name: "Adhan call audio",
    attribution: "Bundled call-to-prayer clip.",
    url: "https://github.com/itsnavee/prayeraudio",
  },
] as const;

export default function CreditsPage() {
  return (
    <ContentPage
      wide
      eyebrow="Credits"
      title="Open data & attributions"
      intro={`${APP_NAME} is built on the generosity of open-source contributors and classical Islamic texts. We are grateful to every project listed below.`}
    >
      <ContentSection heading="Bundled with the app">
        <div className="flex flex-col gap-4">
          {BUNDLED_SOURCES.map((source) => (
            <article
              key={source.name}
              className="rounded-[var(--radius-card)] border border-border/50 bg-card p-5"
            >
              <h3 className="font-semibold">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  {source.name}
                </a>
              </h3>
              <p className="mt-2 text-sm text-muted">{source.attribution}</p>
              <p className="mt-1 text-xs text-muted/80">{source.license}</p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection heading="Downloaded on demand">
        <div className="flex flex-col gap-4">
          {RUNTIME_SOURCES.map((source) => (
            <article
              key={source.name}
              className="rounded-[var(--radius-card)] border border-border/50 bg-card p-5"
            >
              <h3 className="font-semibold">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  {source.name}
                </a>
              </h3>
              <p className="mt-2 text-sm text-muted">{source.attribution}</p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection heading="Authenticity note">
        <p className="text-muted">
          We strive for accuracy in all religious content. If you notice an error, please report it
          through the app so we can correct it promptly. Calculators and estimates are aids, not
          fatwas — consult a qualified scholar for rulings specific to your situation.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
