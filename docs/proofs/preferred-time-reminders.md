# Proof log: preferred-time reminders (D40)

Review date: 2026-11-23. Code: `apps/app/src/lib/notifications/preferred-time-reminders.ts`.

This feature makes **no new ruling**. It schedules an optional notification at the start of the band that `apps/app/src/lib/salah-phase/preferred-window.ts` already draws. That band's per-school positions, evidence and minute approximations are recorded in [`madhhab.md`](madhhab.md):

- `fajr.preferred`, `asr.preferred`, `isha.preferred` (§1: the school positions and their sources)
- "Preferred-time hints (Fajr / Asr / Isha sub-band): app approximations" (the minute boundaries)

## What the reminder claims

| Claim (copy / behaviour)                                                              | Basis                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hanafi: a reminder when Fajr's isfar band begins                                      | `fajr.preferred` (Hanafi isfar; Tirmidhi 154, verified, with gradings in madhhab.md)                                                                                                                           |
| Hanafi: a reminder when Asr's "delay, before the sun yellows" band begins             | `asr.preferred` (al-Hidayah); the yellowing time is the app approximation logged in madhhab.md (Muslim 612 = corpus `muslim:1385`–`1387`)                                                                      |
| Hanafi and Hanbali: a reminder when Isha's "towards a third of the night" band begins | `isha.preferred` (al-Hidayah; Zad; Tirmidhi 167, verified). The Hanbali position adds "unless it is hard on the followers"; the reminder is opt-in and says the whole time stays valid, so it imposes nothing. |
| Shafi'i and Maliki (all three prayers), Hanbali Fajr and Asr: **no** extra reminder   | Their preferred time is early (ta'jil / taghlis), which begins at the prayer's own start time; the normal Salah reminder already covers it.                                                                    |
| No reminder in all-views mode                                                         | No school chosen ⇒ no band (madhhab.md "All views"). The setting row is hidden there as well.                                                                                                                  |
| Body: "The preferred time for {prayer} has begun. The whole time stays valid."        | All schools agree the whole time is valid; madhhab.md records that the band is a soft hint and that its minute boundaries are approximate. The setting subtitle says "Times are approximate".                  |

## Behaviour notes (not rulings)

- Paused during an excused period (`activeExcusedReason`), per plan §2.
- Never within 15 minutes of another reminder the user already gets for the same prayer and day (their own offset, before/after zikr nudges, iqamah).
- §11 tier 2 (`preferredTime`), ranked after iqamah: prayer-adjacent like iqamah, but an optional extra on top of the tier-1 Salah alert.
