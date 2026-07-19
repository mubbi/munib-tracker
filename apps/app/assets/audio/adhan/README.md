# Adhan call audio (D11)

## Bundled

`adhan.mp3` — a small (~53 KB) bundled call-to-prayer clip for offline preview and
notification sounds. Played through the shared audio player via `src/lib/adhan-audio.ts`.

Source: https://github.com/itsnavee/prayeraudio (`sounds/adhan.mp3`).

## Learn-the-words phrase clips (`phrases/`)

Seven short MP3s matching the numbered sentence cards on `/salah-guide/adhan`
(standard Sunni lines, no Fajr-only phrase).

| File | Line |
|------|------|
| `01-allahu-akbar-x4.mp3` | Allahu Akbar (×4) |
| `02-ashhadu-la-ilaha.mp3` | Ashhadu an la ilaha illallah (×2) |
| `03-ashhadu-muhammad.mp3` | Ashhadu anna Muhammadan rasulullah (×2) |
| `04-hayya-ala-salah.mp3` | Hayya 'ala as-salah (×2) |
| `05-hayya-ala-falah.mp3` | Hayya 'ala al-falah (×2) |
| `06-allahu-akbar-x2.mp3` | Allahu Akbar (×2) |
| `07-la-ilaha-illallah.mp3` | La ilaha illallah |

**Source:** [Wikimedia Commons — Adhan_wiki.oga](https://commons.wikimedia.org/wiki/File:Adhan_wiki.oga)
(author Jarih, Sunni lecture, ~27 s).

**License:** Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0). Derivatives
must keep the same license and credit the author. These files are a **segmented**
remix of the original recording.

**CDN:** once on GitHub `main`, jsDelivr serves:

`https://cdn.jsdelivr.net/gh/mubbi/munib-tracker@main/apps/app/assets/audio/adhan/phrases/{filename}`

Playback uses Metro `require()` for offline reliability, with the CDN URI attached
for cache/telemetry classification (`classify-oss-audio-uri.ts`).

### Regenerating phrase clips

```bash
# Download original
curl -L -o Adhan_wiki.oga \
  "https://upload.wikimedia.org/wikipedia/commons/1/16/Adhan_wiki.oga"

# Convert + split (silence-tuned cuts; adjust if the source changes)
ffmpeg -y -i Adhan_wiki.oga full.wav
# Approximate cut points used for the current pack (seconds):
# 0.00 | 10.40 | 15.40 | 19.25 | 21.10 | 23.65 | 24.95 | 26.56
ffmpeg -ss START -t DUR -i full.wav -codec:a libmp3lame -q:a 4 phrases/NN-name.mp3
```

## Follow-along cues (Medina)

[`assets/data/adhan/medina-phrase-cues.json`](../../data/adhan/medina-phrase-cues.json)
maps timestamps on the Kiwifu **Medina** full recording to the same 7 sentence
indexes. Playing Medina on the learn screen highlights the matching card via
`readPlaybackSeconds()` + `phraseIndexAtCueTime()`.

## Open-source CDN styles

Additional muezzin recordings stream from the **Kiwifu/adhan-mp3** collection
(https://github.com/Kiwifu/adhan-mp3) via jsDelivr — Mecca Fajr, Medina, Mishary
Alafasy, and Al-Haram muezzins. Native builds cache downloads under `audio-cache.ts`
(hashed short filenames — the Arabic CDN paths exceed filesystem `NAME_MAX` if
encoded in full); web streams directly.

Configured in `ADHAN_STYLES` inside `src/lib/adhan-audio.ts`. To add more styles,
pick a filename from the repo and append an entry with `uri: adhanRemoteUrl(...)`.

**Learn Salah page**: `/salah-guide/adhan` lists all styles with inline play controls,
phrase-by-phrase learning, and Medina follow-along highlighting.

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
