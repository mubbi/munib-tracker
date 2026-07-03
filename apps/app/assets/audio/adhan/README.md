# Adhan call audio (D11)

`adhan.mp3` — a small (~53 KB) bundled call-to-prayer clip, played through the
shared audio player via `src/lib/adhan-audio.ts` (`require()`d — Metro bundles
`.mp3` under `assets/`, so no native dependency is added). It is previewable
from Settings → Notifications.

Source: https://github.com/itsnavee/prayeraudio (`sounds/adhan.mp3`).

To add more styles, drop additional MP3s here and extend `ADHAN_STYLES` in
`src/lib/adhan-audio.ts`.

**Custom notification sound** (optional): using this clip as the actual OS
notification sound additionally requires registering it in `app.json` and a
prebuild. Foreground in-app playback (the preview) works without that.
