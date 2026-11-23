import { Check, CircleHelp, Clock, Minus, X } from "lucide-react";
import Link from "next/link";
import { Blocks } from "@/components/content/blocks";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import {
  DateStamp,
  FaqList,
  JsonLdScript,
  LinkCard,
  PageSection,
} from "@/components/content/primitives";
import { RichText } from "@/components/content/rich-text";
import { compareHref, getComparison } from "@/content/compare";
import { getFeature } from "@/content/features";
import {
  MUNIB_FEATURE_INVENTORY,
  PLANNED_FEATURES,
  SHIPPED_FEATURE_COUNT,
} from "@/content/munib-features";
import { articleByHref } from "@/content/resources";
import type { CompareCell, ComparePage } from "@/content/types";
import { graph, webPageSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

const STATUS = {
  yes: { icon: Check, label: "Available", className: "text-brand" },
  no: { icon: X, label: "Not available", className: "text-rose-300" },
  partial: { icon: Minus, label: "Partially available", className: "text-gold" },
  unverified: { icon: CircleHelp, label: "Not verified", className: "text-white/60" },
  planned: { icon: Clock, label: "Coming soon", className: "text-sky-300" },
} as const;

function Cell({ value }: { value: CompareCell | undefined }) {
  if (!value) return <span className="text-white/40">—</span>;
  if ("text" in value) return <span className="text-white/80">{value.text}</span>;
  const s = STATUS[value.status];
  const Icon = s.icon;
  return (
    <span className="flex items-start gap-2">
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", s.className)} />
      <span>
        <span className={cn("font-medium", s.className)}>{s.label}</span>
        {value.note ? (
          <span className="block text-[13px] text-white/60 [overflow-wrap:anywhere]">
            {value.note}
          </span>
        ) : null}
      </span>
    </span>
  );
}

function Legend({ page }: { page: ComparePage }) {
  const used = new Set(
    page.table.flatMap((g) =>
      g.rows.flatMap((r) => Object.values(r.cells).map((c) => ("status" in c ? c.status : null))),
    ),
  );
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/65">
      {(Object.keys(STATUS) as (keyof typeof STATUS)[])
        .filter((k) => used.has(k))
        .map((k) => {
          const { icon: Icon, label, className } = STATUS[k];
          return (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon aria-hidden className={cn("size-4", className)} />
              {label}
            </li>
          );
        })}
    </ul>
  );
}

/** Resolves a related href to a card (feature, article, comparison or hub). */
function relatedCard(href: string) {
  if (href.startsWith("/features/")) {
    const f = getFeature(href.slice("/features/".length));
    if (f) return { href, title: f.navLabel, description: f.description, meta: "Feature" };
  }
  if (href.startsWith("/compare/")) {
    const c = getComparison(href.slice("/compare/".length));
    if (c) return { href, title: c.title, description: c.description, meta: "Comparison" };
  }
  const a = articleByHref(href);
  if (a) return { href, title: a.title, description: a.description, meta: "Guide" };
  if (href === "/compare") {
    return {
      href,
      title: "All comparisons",
      description: "Every app comparison in one place.",
      meta: "Compare",
    };
  }
  return null;
}

export function CompareTemplate({ page }: { page: ComparePage }) {
  const path = compareHref(page.slug);
  const related = page.related.map(relatedCard).filter((c) => c !== null);
  const roundup = page.kind === "roundup";

  return (
    <>
      <JsonLdScript
        data={graph(webPageSchema({ path, name: page.title, description: page.seoDescription }))}
      />
      <PageHero
        crumbs={[
          { name: "Compare", href: "/compare" },
          { name: page.title, href: path },
        ]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={
          <div className="flex flex-col gap-4">
            {page.intro.map((p) => (
              <p key={p}>
                <RichText text={p} />
              </p>
            ))}
          </div>
        }
        meta={<DateStamp label="Last verified" iso={page.verifiedOn} />}
      />

      <PageSection id="verdict" eyebrow="Quick answer" title="Which one should you choose?">
        <div
          className={cn(
            "grid gap-4",
            page.summary.length > 2 ? "md:grid-cols-2" : "md:grid-cols-2",
          )}
        >
          {page.summary.map((s) => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-[#0c2131]/50 p-6">
              <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/72">
                <RichText text={s.text} />
              </p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="comparison-table"
        tone="band"
        eyebrow="Side by side"
        title="Feature comparison"
        intro={`Checked against official websites and US App Store and Google Play listings. "Not verified" means we couldn't confirm it from an official source, not that the feature is missing.${PLANNED_FEATURES.length ? " “Coming soon” marks Munib Tracker features on our roadmap that are not in the app yet." : ""}`}
      >
        <Legend page={page} />
        <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-white/10 bg-[#07141f]/60 md:block">
          <table
            className={cn(
              "w-full border-collapse text-left text-[15px]",
              roundup ? "min-w-[64rem]" : "min-w-[40rem]",
            )}
          >
            <caption className="sr-only">
              {page.title}: feature comparison, last verified {page.verifiedOn}
            </caption>
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th
                  scope="col"
                  className="sticky left-0 z-10 w-56 bg-[#0b1b28] px-4 py-3 font-semibold text-white"
                >
                  Feature
                </th>
                {page.apps.map((app) => (
                  <th
                    key={app.id}
                    scope="col"
                    className={cn(
                      "px-4 py-3 font-semibold",
                      app.id === "munib" ? "text-brand" : "text-white",
                    )}
                  >
                    {app.name}
                  </th>
                ))}
              </tr>
            </thead>
            {page.table.map((group) => (
              <tbody key={group.group}>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th
                    scope="colgroup"
                    colSpan={page.apps.length + 1}
                    className="px-4 pb-2 pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-gold"
                  >
                    {group.group}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-white/[0.06] align-top">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-[#0b1b28] px-4 py-3 font-medium text-white/90"
                    >
                      {row.feature}
                    </th>
                    {page.apps.map((app) => (
                      <td
                        key={app.id}
                        className={cn("px-4 py-3", app.id === "munib" && "bg-brand/[0.04]")}
                      >
                        <Cell value={row.cells[app.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
        {/* Small screens: one card per feature instead of a wide table. */}
        <div className="mt-6 flex flex-col gap-8 md:hidden">
          {page.table.map((group) => (
            <section key={group.group} aria-label={group.group}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                {group.group}
              </h3>
              <ul className="mt-3 flex flex-col gap-3">
                {group.rows.map((row) => (
                  <li
                    key={row.feature}
                    className="rounded-2xl border border-white/10 bg-[#0c2131]/50 p-4"
                  >
                    <p className="font-display text-[15px] font-semibold text-white">
                      {row.feature}
                    </p>
                    <dl className="mt-3 flex flex-col gap-2.5 text-[14px]">
                      {page.apps.map((app) => (
                        <div key={app.id} className="grid grid-cols-[7.5rem_1fr] gap-3">
                          <dt
                            className={cn(
                              "font-medium",
                              app.id === "munib" ? "text-brand" : "text-white/70",
                            )}
                          >
                            {app.name}
                          </dt>
                          <dd>
                            <Cell value={row.cells[app.id]} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="everything-in-munib"
        eyebrow="Complete feature list"
        title="Everything in Munib Tracker"
        intro={
          PLANNED_FEATURES.length
            ? `${SHIPPED_FEATURE_COUNT} features in the app today, plus ${PLANNED_FEATURES.length} on our roadmap marked "Coming soon". Roadmap features aren't in the app yet, so they never count as available in the table above.`
            : `All ${SHIPPED_FEATURE_COUNT} features in Munib Tracker, grouped by area. Every one is free, with no ads.`
        }
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MUNIB_FEATURE_INVENTORY.map((group) => (
            <div key={group.id} className="rounded-2xl border border-white/10 bg-[#0c2131] p-5">
              <h3 className="font-display text-base font-semibold text-white">{group.title}</h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item.name} className="flex gap-2.5 text-[14px] leading-snug">
                    {item.status === "shipped" ? (
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                    ) : (
                      <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-sky-300" />
                    )}
                    <span>
                      <span className="font-medium text-white/90">
                        {item.href ? (
                          <Link href={item.href} className="hover:text-brand hover:underline">
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        )}
                      </span>
                      {item.status === "planned" ? (
                        <span className="ml-2 inline-block rounded-full bg-sky-300/15 px-2 py-0.5 text-[11px] font-semibold text-sky-200">
                          Coming soon
                        </span>
                      ) : null}
                      {item.detail ? (
                        <span className="block text-[13px] text-white/60">{item.detail}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection id="strengths" eyebrow="Strengths" title="What each app does well">
        <div
          className={cn("grid gap-4", roundup ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2")}
        >
          {page.apps.map((app) => (
            <div key={app.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3
                className={cn(
                  "font-display text-lg font-semibold",
                  app.id === "munib" ? "text-brand" : "text-white",
                )}
              >
                {app.name}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                <span className="font-semibold text-white/75">Best for: </span>
                {page.bestFor[app.id]}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {(page.strengths[app.id] ?? []).map((s) => (
                  <li key={s} className="flex gap-2.5 text-[15px] leading-relaxed text-white/75">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>

      {page.body?.length ? (
        <section className="py-6 md:py-10">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <Blocks blocks={page.body} />
          </div>
        </section>
      ) : null}

      <PageSection
        id="sources"
        tone="band"
        eyebrow="Sources"
        title="Where this information comes from"
      >
        <p className="max-w-2xl text-[15px] leading-relaxed text-white/65">
          Prices are US App Store prices and may differ in your country. Features and prices change;
          please check the official listings. Last verified{" "}
          <DateStamp label="" iso={page.verifiedOn} />.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {page.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[15px] text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="faq" eyebrow="FAQ" title="Questions people ask">
        <div className="max-w-3xl">
          <FaqList items={page.faqs} />
        </div>
      </PageSection>

      {related.length ? (
        <PageSection id="related" tone="band" eyebrow="Keep exploring" title="Related pages">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <LinkCard key={c.href} {...c} />
            ))}
          </div>
        </PageSection>
      ) : null}

      <DownloadCta
        title="Try Munib Tracker and decide for yourself"
        text="It's free with no ads or account, so there's nothing to lose by trying it alongside the app you use now."
        placement="compare_page"
      />
    </>
  );
}
