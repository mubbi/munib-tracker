import { Check, CircleHelp, Clock, Minus, X } from "lucide-react";
import type { CompareCell, ComparePage } from "@/content/types";
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

/**
 * Side-by-side comparison: a sticky-column table from `md` up, one card per
 * feature on small screens. A legend lists only the statuses the page uses.
 */
export function ComparisonTable({ page }: { page: ComparePage }) {
  const roundup = page.kind === "roundup";
  return (
    <>
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
                  <p className="font-display text-[15px] font-semibold text-white">{row.feature}</p>
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
    </>
  );
}
