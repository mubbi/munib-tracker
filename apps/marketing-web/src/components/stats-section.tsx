import { DUA_COUNT } from "@munib-tracker/shared/constants";
import { useLocale, useTranslations } from "next-intl";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/motion";

const STATS = [
  { id: "ayahs", value: 6236 },
  { id: "library", value: 350, suffix: "+" },
  { id: "duas", value: DUA_COUNT },
  { id: "languages", value: 24 },
] as const;

export function StatsSection() {
  const t = useTranslations("home.stats");
  const locale = useLocale();
  return (
    <section id="how" className="relative py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-b from-surface to-background p-8 shadow-[var(--shadow-card)] md:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-brand/10 blur-3xl"
            />
            <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className="text-gradient font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                    <Counter
                      value={stat.value}
                      suffix={"suffix" in stat ? stat.suffix : undefined}
                      locale={locale}
                    />
                  </div>
                  <p className="mx-auto mt-2 max-w-[12rem] text-sm text-muted">{t(stat.id)}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
