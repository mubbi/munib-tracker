/** Stylized in-app UI preview for marketing hero — not a photograph. */
export function DeviceMockup() {
  return (
    <div className="animate-float relative mx-auto w-full max-w-[280px]" aria-hidden="true">
      <div className="rounded-[2rem] border-[6px] border-black/80 bg-black p-2 shadow-2xl shadow-black/40 dark:border-white/20">
        <div className="overflow-hidden rounded-[1.4rem] bg-gradient-to-b from-[#12463a] to-[#0b2a22]">
          <div className="px-4 pb-5 pt-8">
            <div className="flex items-center justify-between text-[10px] text-[#a9c6bb]">
              <span>14 Ramadan 1447</span>
              <span>🌙</span>
            </div>
            <p className="mt-4 font-serif text-2xl font-bold text-[#f2efe6]">Asr</p>
            <p className="text-xs text-[#e4ce9e]">in 42 min</p>
            <div className="mt-4 grid grid-cols-5 gap-1">
              {["Fajr", "Dhuhr", "Asr", "Magh", "Isha"].map((prayer, index) => (
                <div
                  key={prayer}
                  className={`rounded-lg px-1 py-2 text-center text-[8px] ${
                    index === 2 ? "bg-[#e4ce9e]/20 text-[#e4ce9e]" : "text-[#a9c6bb]/80"
                  }`}
                >
                  <div className="font-semibold">{prayer}</div>
                  <div className="mt-0.5 opacity-80">
                    {["5:42", "12:18", "3:45", "6:12", "7:38"][index]}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-white/5 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[#e4ce9e]">
                Today&apos;s goal
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/5 rounded-full bg-[#2e9e6b]" />
              </div>
              <p className="mt-2 text-[9px] text-[#a9c6bb]">5 of 8 acts complete · 3-day streak</p>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {["Zikr", "Qaza", "Qur'an", "Stats"].map((label) => (
                <div
                  key={label}
                  className="rounded-lg bg-white/5 px-1 py-2 text-center text-[7px] text-[#f2efe6]"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-6 top-16 hidden w-[200px] rounded-2xl border border-border/40 bg-card p-3 shadow-xl md:block">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">Tracker</p>
        <ul className="mt-2 space-y-1.5">
          {["Fajr ✓", "Dhuhr ✓", "Asr · pending"].map((row) => (
            <li key={row} className="text-[10px] text-muted">
              {row}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
