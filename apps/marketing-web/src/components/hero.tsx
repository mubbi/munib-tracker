import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { CtaButton } from "@/components/cta-button";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-24 text-center md:px-16">
      <p className="text-sm font-medium uppercase tracking-widest text-brand">
        Salah · Dhikr · Qadha
      </p>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">{APP_NAME}</h1>
      <p className="max-w-2xl text-lg text-muted md:text-xl">{APP_TAGLINE}</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <CtaButton href="#features">Explore features</CtaButton>
        <CtaButton href="http://localhost:8081" variant="outline">
          Open product app
        </CtaButton>
      </div>
    </section>
  );
}
