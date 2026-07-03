# Adhan call audio (D11)

Drop a small, license-cleared muezzin clip here per style, e.g.:

- `adhan-makkah.mp3`
- `adhan-madinah.mp3`

Wire it via `src/lib/adhan-audio.ts` (`require("@/assets/audio/adhan/adhan-makkah.mp3")`)
and reference it from the prayer notification flow (`src/notifications/scheduler.ts`).

Expo bundles `.mp3` under `assets/` automatically — no native dependency is
added. A custom notification sound additionally needs the file registered in
`app.json` and a prebuild; foreground in-app playback works without that.

The binary is intentionally **not** committed here: it must be a specific,
license-verified recording chosen by the maintainer (Internet Archive muezzin
clips are a good no-key source — see `docs/FREE_OPEN_SOURCE_DATA.md`).
