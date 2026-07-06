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

/** Hairline grid or dot field, faded toward the edges. */
export function GridBackdrop({
  className,
  variant = "grid",
}: {
  className?: string;
  variant?: "grid" | "dots";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "mask-radial pointer-events-none absolute inset-0",
        variant === "dots" ? "bg-dots" : "bg-grid",
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
