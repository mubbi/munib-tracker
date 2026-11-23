import type { Metadata } from "next";
import Link from "next/link";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, PageSection, Screenshot } from "@/components/content/primitives";
import { RichText } from "@/components/content/rich-text";
import { StoreBadges } from "@/components/store-badges";
import type { ScreenshotSlot } from "@/content/types";
import { pageMetadata } from "@/lib/seo";
import { graph, webPageSchema } from "@/lib/structured-data";

const PATH = "/how-it-works";
const TITLE = "How Munib Tracker works";
const DESCRIPTION =
  "Set up Munib Tracker in a minute: choose your location, log each Salah, follow your adhkar, plan Qaza, read and practise the Qur'an, and review your week.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: "How It Works — Set Up Your Salah, Zikr & Qur'an Routine",
  description: DESCRIPTION,
});

const STEPS: { title: string; text: string; shot?: ScreenshotSlot }[] = [
  {
    title: "Download and open the app",
    text: "Install from the App Store or Google Play, or open the [web app](https://my.munibtracker.app). There's no account to create: everything works straight away and stays on your device.",
  },
  {
    title: "Set your location",
    text: "Allow location or search for your city, then choose your calculation method and Asr madhab. Your Salah times appear on the home screen with the Hijri date and a countdown. [More on Salah times](/features/prayer-times-qibla).",
    shot: { key: "home", caption: "Today's Salah times and the next Salah countdown." },
  },
  {
    title: "Log each Salah",
    text: "After you pray, tap the Salah and mark it completed, delayed, missed or Qaza. Your streak and progress ring update instantly. [About the Salah tracker](/features/salah-tracker).",
    shot: { key: "tracker", caption: "The tracker with today's progress and streak." },
  },
  {
    title: "Add your adhkar",
    text: "Open the session for the time of day (morning, evening, after Salah or before sleep) and tap to count. Each zikr shows its source. [About the Zikr tracker](/features/zikr-tracker).",
    shot: { key: "zikr", caption: "Adhkar grouped by time of day." },
  },
  {
    title: "Make a plan for missed Salah",
    text: "If you have Qaza to make up, estimate it once and pick a daily pace. The app shows what's left and when you'll finish. [About the Qaza tracker](/features/qaza-salah-tracker).",
    shot: { key: "qaza", caption: "Qaza remaining, made up, and the finish date." },
  },
  {
    title: "Read and practise the Qur'an",
    text: "Set a khatm plan for a daily target, and use [Qur'an practice](/features/quran-practice) to recite with an on-device listener and revise what you're memorizing.",
    shot: { key: "quran", caption: "Continue reading or start a khatm plan." },
  },
  {
    title: "Turn on only the reminders you want",
    text: "Salah, Adhan, adhkar, Qaza, Friday and more. Every reminder is off until you switch it on, so the app never nags you.",
  },
  {
    title: "Look back once a week",
    text: "Check your statistics and weekly report, see what's growing, and choose one small thing to improve next week. [About worship progress](/features/worship-progress).",
  },
];

const DAY = [
  {
    time: "Fajr",
    text: "Mark Fajr, run the after-Salah adhkar, then the morning adhkar and today's khatm pages.",
  },
  { time: "Dhuhr", text: "A reminder at work; mark it from the widget once you've prayed." },
  { time: "Asr", text: "Pray, then make up one Qaza Salah alongside it if you have a plan." },
  {
    time: "Maghrib",
    text: "Evening adhkar, and ten minutes of Qur'an practice on what you're memorizing.",
  },
  { time: "Isha", text: "Mark Isha and Witr, then the before-sleep adhkar when you go to bed." },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLdScript
        data={graph(webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION }))}
      />
      <PageHero
        crumbs={[{ name: "How it works", href: PATH }]}
        eyebrow="How it works"
        title="Set up your worship routine in a minute"
        intro={
          <p>
            Munib Tracker fits around the five daily Salah. Here's how to get started, and what a
            typical day looks like once you do.
          </p>
        }
        actions={<StoreBadges placement="hub_page" />}
        screenshot={{ key: "home-light", caption: "The home screen." }}
      />

      <PageSection title="Getting started, step by step">
        <ol className="flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="grid items-center gap-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[1fr_auto] md:p-8"
            >
              <div className="flex gap-5">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/15 font-display text-lg font-bold text-brand">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-white/72">
                    <RichText text={step.text} />
                  </p>
                </div>
              </div>
              {step.shot ? (
                <Screenshot slot={step.shot} className="mx-auto w-[150px] md:w-[160px]" />
              ) : null}
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection
        tone="band"
        eyebrow="A typical day"
        title="What a day with Munib Tracker looks like"
        intro="An example routine. Start with whatever part of it feels easy, and add the rest over time."
      >
        <ol className="relative grid gap-4 md:grid-cols-5">
          {DAY.map((d) => (
            <li key={d.time} className="rounded-2xl border border-white/10 bg-[#0c2131]/50 p-5">
              <p className="font-display text-lg font-bold text-gold">{d.time}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/72">{d.text}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection eyebrow="Your data" title="Where your information lives">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "On your device by default",
              text: "Without signing in, your Salah, Qaza, zikr and notes are stored only on your phone, tablet or browser.",
            },
            {
              title: "Synced only if you choose",
              text: "Sign in with Google, Apple or Facebook to sync between devices. You can delete your account and data at any time.",
            },
            {
              title: "Backups you control",
              text: "Export a backup file from Settings and import it on another device, without an account.",
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-display text-[17px] font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[15px] text-white/65">
          Read the full{" "}
          <Link href="/privacy" className="text-brand underline underline-offset-2">
            privacy policy
          </Link>{" "}
          or see{" "}
          <Link href="/why-munib-tracker" className="text-brand underline underline-offset-2">
            why we built it this way
          </Link>
          .
        </p>
      </PageSection>

      <DownloadCta
        title="Ready when you are"
        text="Download Munib Tracker and set your location. Your first Salah log is one tap away."
        placement="hub_page"
      />
    </>
  );
}
