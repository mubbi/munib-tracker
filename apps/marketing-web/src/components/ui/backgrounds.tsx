import { cn } from "@/lib/utils";

/** Soft animated emerald/gold blobs. Reads as "light gradients" on white, glow on charcoal. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="animate-aurora absolute -top-48 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[130px]" />
      <div
        className="animate-aurora absolute -right-40 top-24 size-[30rem] rounded-full bg-gold/15 blur-[130px]"
        style={{ animationDelay: "-4s" }}
      />
      <div
        className="animate-aurora absolute -bottom-48 -left-32 size-[34rem] rounded-full bg-brand-strong/15 blur-[130px]"
        style={{ animationDelay: "-8s" }}
      />
    </div>
  );
}

/** Warm-gold girih strapwork lattice — the same Islamic pattern used in the hero. */
export function IslamicPatternBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "islamic-tiles-soft pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(90%_80%_at_15%_20%,#000_0%,rgba(0,0,0,0.45)_50%,transparent_80%)]",
        className,
      )}
    />
  );
}

/** A single positioned glow orb. */
export function Glow({
  className,
  color = "brand",
}: {
  className?: string;
  color?: "brand" | "gold";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-[120px]",
        color === "gold" ? "bg-gold/20" : "bg-brand/25",
        className,
      )}
    />
  );
}
