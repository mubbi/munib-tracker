# Adhan call audio (D11)

`adhan.mp3` — a small (~53 KB) bundled call-to-prayer clip, played through the
shared audio player via `src/lib/adhan-audio.ts` (`require()`d — Metro bundles
`.mp3` under `assets/`, so no native dependency is added). It is previewable
from Settings → Notifications.

Source: https://github.com/itsnavee/prayeraudio (`sounds/adhan.mp3`).

To add more styles, drop additional MP3s here and extend `ADHAN_STYLES` in
`src/lib/adhan-audio.ts`.

**Custom notification sound**: `adhan.mp3` is registered in the `expo-notifications`
plugin `sounds` array in `app.json`, so the "Play adhan at prayer time" option
(`notificationPrefs.playAdhanOnPrayer`) can use it as the OS notification sound for
obligatory prayers. On Android it plays via the dedicated `prayerAdhan` channel; on
iOS it is attached to the notification content. This requires a **dev/EAS build +
prebuild** — custom sounds do not work in Expo Go or on the web. iOS notification
sounds prefer `.wav`/`.caf`/`.aiff`; if the mp3 does not play on iOS, drop a `.wav`
alongside it and update `ADHAN_NOTIFICATION_SOUND` in
`src/lib/notifications/build-reminders.ts`. Foreground in-app playback (the Settings
preview) works without a build.
