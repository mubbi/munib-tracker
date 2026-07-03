import { APP_VALUE_PROPS } from "@munib-tracker/shared/constants";

export function ValueProps() {
  return (
    <section className="border-b border-border/60 bg-card py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
        {APP_VALUE_PROPS.map((prop, index) => (
          <article
            key={prop.title}
            className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border/50 bg-background p-6 shadow-sm"
          >
            <span
              aria-hidden
              className="flex size-9 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand"
            >
              {index + 1}
            </span>
            <h3 className="text-lg font-semibold tracking-tight">{prop.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{prop.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
