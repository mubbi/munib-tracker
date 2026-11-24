# Adhan call audio (D11)

## Bundled

`adhan.mp3` — a small (~53 KB) bundled call-to-prayer clip for offline preview and
notification sounds. Played through the shared audio player via `src/lib/adhan-audio.ts`.

Source: https://github.com/itsnavee/prayeraudio (`sounds/adhan.mp3`).

## Learn-the-words phrase clips (`phrases/`)

Seven short MP3s matching the numbered sentence cards on `/salah-guide/adhan`
(standard Sunni lines, no Fajr-only phrase).

| File                       | Line                                    |
| -------------------------- | --------------------------------------- |
| `01-allahu-akbar-x4.mp3`   | Allahu Akbar (×4)                       |
| `02-ashhadu-la-ilaha.mp3`  | Ashhadu an la ilaha illallah (×2)       |
| `03-ashhadu-muhammad.mp3`  | Ashhadu anna Muhammadan rasulullah (×2) |
| `04-hayya-ala-salah.mp3`   | Hayya 'ala as-salah (×2)                |
| `05-hayya-ala-falah.mp3`   | Hayya 'ala al-falah (×2)                |
| `06-allahu-akbar-x2.mp3`   | Allahu Akbar (×2)                       |
| `07-la-ilaha-illallah.mp3` | La ilaha illallah                       |

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

**Custom notification sounds (B2, D13)**: each adhan style maps to a registered
notification sound in `src/lib/notifications/adhan-sounds.ts`
(`ADHAN_NOTIFICATION_SOUNDS`), and every file there is listed in the
`expo-notifications` plugin `sounds` array in `app.json` (a test enforces both).
When "Play adhan at prayer time" (`notificationPrefs.playAdhanOnPrayer`) is on,
obligatory-prayer reminders carry the selected style's sound (iOS, per
notification) and its own Android channel `adhan-<styleId>` — Android channel
sounds are fixed at creation, so a style change switches channel (stale adhan
channels, including the legacy `prayerAdhan`, are deleted) and reschedules.

| File                                    | Style            | Source recording (Kiwifu/adhan-mp3 unless noted)                                    | Cut (source s) | Length |
| --------------------------------------- | ---------------- | ----------------------------------------------------------------------------------- | -------------- | ------ |
| `notification/adhan_default.wav`        | `default`        | `adhan.mp3` above (itsnavee/prayeraudio)                                            | whole clip     | 15.1 s |
| `notification/adhan_mecca_fajr.wav`     | `mecca-fajr`     | `Adhan_Fajr_Al_Haram_Al_Maki_(أذان_الفجر_الحرم_المكي).mp3`                          | 0.5 – 28.0     | 27.5 s |
| `notification/adhan_medina.wav`         | `medina`         | `Adhan_Al_Haram_Al_Madani_-_Al_Madinah_1_(أذان_الحرم_المدني_-_المدينة_المنورة).mp3` | 0.0 – 28.0     | 28.0 s |
| `notification/adhan_mishary.wav`        | `mishary`        | `Mishary_Rashid_Alafasy_1_-_Kuwait_(مشاري_راشد_العفاسي_-_الكويت).mp3`               | 0.0 – 17.6     | 17.6 s |
| `notification/adhan_makkah_muezzin.wav` | `makkah-muezzin` | `Ali_Ibn_Ahmad_Mala_1_-_Al_Haram_Al_Maki_(علي_بن_أحمد_ملا_-_الحرم_المكي).mp3`        | 0.4 – 23.6     | 23.2 s |

Every file is 16 kHz mono 16-bit PCM WAV (a documented iOS notification format
and a valid Android raw resource), named `[a-z0-9_]+.wav` (Android resource
names), ≤ 30 s (iOS ignores longer sounds). Each style clip is the opening of
that style's own recording, cut in a pause between phrases (a full second
phrase wouldn't fit in 30 s for Mishary, so his clip stops after the first),
peak-normalised to −3 dBFS to match the default clip, with a 50 ms fade-in and
a 1.5 s fade-out. A test (`adhan-sounds.test.ts`) checks every style has its own
registered file and validates each WAV header and duration.

**Licence (D29):** adhan recordings are exempt from the D12 licence-clearance
rule. Kiwifu/adhan-mp3 publishes no licence (checked 2026-11-23) and
itsnavee/prayeraudio states none for `adhan.mp3`; the owner accepted both
sources on 2026-11-24 and they're credited in
`packages/shared/src/constants/credits.ts` (`adhan-audio`). D12 still applies
to every other audio source.

Custom sounds need a **dev/EAS build + prebuild** — they do not work in Expo Go or
on the web. Foreground in-app playback (Settings preview and Learn Salah) works
without a build.

Regenerate the clips (ffmpeg; on Windows the binary bundled with Python's
`imageio_ffmpeg` works — `python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`):

```bash
ENC="-ac 1 -ar 16000 -c:a pcm_s16le -map_metadata -1 -fflags +bitexact"
ffmpeg -y -i adhan.mp3 $ENC notification/adhan_default.wav

# Style clips: download each source from https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/<file>
# clip <source.mp3> <out.wav> <start> <duration> <gain dB>
clip() {
  ffmpeg -y -ss "$3" -t "$4" -i "$1" \
    -af "volume=$5dB,afade=t=in:st=0:d=0.05,afade=t=out:st=$(echo "$4 - 1.5" | bc):d=1.5" \
    $ENC "notification/$2"
}
clip mecca-fajr.mp3     adhan_mecca_fajr.wav     0.5 27.5 6.2
clip medina.mp3         adhan_medina.wav         0   28.0 1.3
clip mishary.mp3        adhan_mishary.wav        0   17.6 2.2
clip makkah-muezzin.mp3 adhan_makkah_muezzin.wav 0.4 23.2 4.2
```
