import { TRACKER_CATEGORIES } from "@munib-tracker/shared/constants";

const featureCopy: Record<(typeof TRACKER_CATEGORIES)[number], string> = {
  salah: "Track daily prayers and stay consistent with your salah routine.",
  dhikr: "Log dhikr sessions and build meaningful daily remembrance habits.",
  qadha: "Manage qadha obligations with clarity and gentle accountability.",
};

export function Features() {
  return (
    <section id="features" className="px-6 py-16 md:px-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-semibold">Built for your journey</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {TRACKER_CATEGORIES.map((category) => (
            <article
              key={category}
              className="rounded-2xl border border-black/10 p-6 dark:border-white/10"
            >
              <h3 className="mb-3 text-xl font-semibold capitalize">{category}</h3>
              <p className="text-muted">{featureCopy[category]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
