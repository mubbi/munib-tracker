import { Flame, Moon } from "lucide-react";

const PRAYERS = [
  { name: "Fajr", time: "5:42", done: true },
  { name: "Dhuhr", time: "12:18", done: true },
  { name: "Asr", time: "3:45", active: true },
  { name: "Magh", time: "6:12" },
  { name: "Isha", time: "7:38" },
];

const QUICK = ["Zikr", "Qaza", "Qur'an", "Learn"];

/** Stylized in-app UI preview for the marketing hero — not a photograph. */
export function DeviceMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[288px]" aria-hidden="true">
      <div className="relative rounded-[2.75rem] border border-white/10 bg-neutral-900 p-2.5 shadow-2xl shadow-emerald-950/40 ring-1 ring-black/40">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-4 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div className="relative overflow-hidden rounded-[2.15rem] bg-gradient-to-b from-hero-from via-hero-via to-hero-to">
          <div className="hero-stars islamic-tiles absolute inset-0 opacity-70" />
          <div className="relative px-5 pb-6 pt-11">
            <div className="flex items-center justify-between text-[10px] font-medium text-hero-muted">
              <span>9:41</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-hero-gold">
                <Moon className="size-2.5" /> 14 Ramadan 1447
              </span>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="font-display text-3xl font-bold text-hero-text">Asr</p>
                <p className="mt-0.5 text-xs text-hero-gold">in 42 min · 3:45 PM</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg">
                🕌
              </div>
            </div>

            <div className="mt-5 grid grid-cols-5 gap-1">
              {PRAYERS.map((p) => (
                <div
                  key={p.name}
                  className={`rounded-xl px-1 py-2 text-center text-[8px] transition-colors ${
                    p.active
                      ? "bg-hero-gold/20 text-hero-gold ring-1 ring-hero-gold/40"
                      : "text-hero-muted/80"
                  }`}
                >
                  <div className="font-semibold">{p.name}</div>
                  <div className="mt-0.5 opacity-80">{p.time}</div>
                  <div
                    className={`mx-auto mt-1 size-1 rounded-full ${
                      p.done ? "bg-emerald-400" : p.active ? "bg-hero-gold" : "bg-white/20"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-hero-gold">
                  Today&apos;s goal
                </p>
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-300">
                  <Flame className="size-3" /> 7-day streak
                </span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-400 to-hero-gold" />
              </div>
              <p className="mt-2 text-[9px] text-hero-muted">6 of 8 acts complete</p>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {QUICK.map((label) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/5 bg-white/[0.05] px-1 py-2.5 text-center text-[8px] font-medium text-hero-text"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-around rounded-2xl border border-white/10 bg-black/20 py-2.5 text-[7px] text-hero-muted">
              <span className="text-hero-gold">Home</span>
              <span>Tracker</span>
              <span>Library</span>
              <span>Settings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
