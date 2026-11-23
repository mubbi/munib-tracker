import { BookCheck, Code2, HeartHandshake, ShieldCheck, Sparkles, WifiOff } from "lucide-react";
import type { Metadata } from "next";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection, Screenshot } from "@/components/content/primitives";
import { RichText } from "@/components/content/rich-text";
import { pageMetadata } from "@/lib/seo";
import { graph, webPageSchema } from "@/lib/structured-data";

const PATH = "/why-munib-tracker";
const TITLE = "Why Munib Tracker";
const DESCRIPTION =
  "The principles behind Munib Tracker: consistency over guilt, privacy by default, no ads, authentic cited sources, offline-first, and free for everyone.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: "Why Munib Tracker — Private, Ad-Free and Built on Authentic Sources",
  description: DESCRIPTION,
});

const PRINCIPLES = [
  {
    icon: HeartHandshake,
    title: "Consistency, not guilt",
    text: "Munib is a Qur'anic word for someone who turns back to Allah. The app is built for coming back: missed Salah are recorded honestly but gently, excused days don't break your streak, and levels never run out.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    text: "No account is needed for personal use. Without signing in, your worship record stays on your device; only the Masjid finder looks up nearby masjids through our server, and family features share just a small signal. Qur'an practice processes your voice on the device and never uploads it.",
  },
  {
    icon: Sparkles,
    title: "No ads, ever",
    text: "Worship deserves focus. There are no ads, no advertising SDKs, no subscriptions and no in-app purchases.",
  },
  {
    icon: BookCheck,
    title: "Authentic, cited content",
    text: "Qur'an text, translations, hadith, adhkar and duas come from established open datasets, never written by hand or generated. Sources are listed on our [credits page](/credits).",
  },
  {
    icon: WifiOff,
    title: "Offline-first",
    text: "Tracking, the Qur'an text, adhkar, duas and the learning library all work without a connection, so the app is there on a flight or in a basement Masjid.",
  },
  {
    icon: Code2,
    title: "Open for anyone to check",
    text: "The source code is public on GitHub under a non-commercial licence, so anyone can see how it works. [Learn about our open-source approach](/open-source).",
  },
];

const WONT = [
  "Show ads or sell your data",
  "Lock features behind a subscription",
  "Rank you against other people on leaderboards",
  "Replace Qur'an, hadith or adhkar text with AI-generated or hand-typed versions",
  "Issue fatwas: calculators and guides point you to qualified scholars",
  "Accept donations or sponsorship",
];

export default function WhyPage() {
  return (
    <>
      <JsonLdScript
        data={graph(webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION }))}
      />
      <PageHero
        crumbs={[{ name: "Why Munib Tracker", href: PATH }]}
        eyebrow="Our principles"
        title="A worship companion that's on your side"
        intro={
          <p>
            Many Islamic apps are funded by ads or subscriptions, which pulls them towards more
            screen time and more data. Munib Tracker is built differently: to help you turn back to
            Allah, then get out of the way.
          </p>
        }
        screenshot={{
          key: "offline-data",
          caption: "Downloaded content is stored on your device.",
        }}
      />

      <PageSection title="What we believe">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-[#0c2131]/50 p-6">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand/12 text-brand ring-1 ring-brand/20">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-[17px] font-semibold text-white">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/72">
                <RichText text={text} />
              </p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection tone="band" eyebrow="Promises" title="What Munib Tracker won't do">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <ul className="grid gap-3 sm:grid-cols-2">
            {WONT.map((w) => (
              <li
                key={w}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white/80"
              >
                {w}
              </li>
            ))}
          </ul>
          <Screenshot
            slot={{ key: "tracker", caption: "Encouragement without leaderboards." }}
            className="mx-auto w-[200px]"
          />
        </div>
      </PageSection>

      <PageSection eyebrow="More than a tracker" title="One calm place for your daily worship">
        <p className="max-w-3xl text-[17px] leading-[1.75] text-white/78">
          <RichText text="Munib Tracker brings together what usually takes several apps: a [Salah tracker](/features/salah-tracker), a [Qaza planner](/features/qaza-salah-tracker), [adhkar with sources](/features/zikr-tracker), the Qur'an with [recitation practice](/features/quran-practice), and a cited [learning library](/learn). Compare it honestly with other apps on our [comparison pages](/compare)." />
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <LinkCard
            href="/features"
            title="All features"
            description="Everything the app can do, feature by feature."
          />
          <LinkCard
            href="/compare"
            title="Compare apps"
            description="Sourced comparisons with Muslim Pro, Tarteel and more."
          />
          <LinkCard
            href="/privacy"
            title="Privacy policy"
            description="Exactly what is stored, where, and why."
          />
        </div>
      </PageSection>

      <DownloadCta
        title="Try an Islamic app built around you"
        text="Free, ad-free and private. Download Munib Tracker and see the difference."
        placement="why_page"
      />
    </>
  );
}
