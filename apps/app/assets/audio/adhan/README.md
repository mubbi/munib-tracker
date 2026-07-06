# Adhan call audio (D11)

## Bundled

`adhan.mp3` — a small (~53 KB) bundled call-to-prayer clip for offline preview and
notification sounds. Played through the shared audio player via `src/lib/adhan-audio.ts`.

Source: https://github.com/itsnavee/prayeraudio (`sounds/adhan.mp3`).

## Open-source CDN styles

Additional muezzin recordings stream from the **Kiwifu/adhan-mp3** collection
(https://github.com/Kiwifu/adhan-mp3) via jsDelivr — Mecca Fajr, Medina, Mishary
Alafasy, and Al-Haram muezzins. Native builds cache downloads under `audio-cache.ts`;
web streams directly.

Configured in `ADHAN_STYLES` inside `src/lib/adhan-audio.ts`. To add more styles,
pick a filename from the repo and append an entry with `uri: adhanRemoteUrl(...)`.

**Learn Salah page**: `/salah-guide/adhan` lists all styles with inline play controls.

**Custom notification sound**: `adhan.mp3` is registered in the `expo-notifications`
plugin `sounds` array in `app.json`, so the "Play adhan at prayer time" option
(`notificationPrefs.playAdhanOnPrayer`) can use it as the OS notification sound for
obligatory prayers. On Android it plays via the dedicated `prayerAdhan` channel; on
iOS it is attached to the notification content. This requires a **dev/EAS build +
prebuild** — custom sounds do not work in Expo Go or on the web. iOS notification
sounds prefer `.wav`/`.caf`/`.aiff`; if the mp3 does not play on iOS, drop a `.wav`
alongside it and update `ADHAN_NOTIFICATION_SOUND` in
`src/lib/notifications/build-reminders.ts`. Foreground in-app playback (Settings
preview and Learn Salah) works without a build.
