# Tasbeeh counter click sounds (NF-3.19, D16 / D28 / D12)

Short, natural, percussive clicks for the tasbeeh counter designs: wood, resin, stone,
glass, pearl and a mechanical clicker. **No music, no bells, no melodic chimes**
(Muslim 2114 — see `docs/proofs/tasbeeh-designs.md`). Played by `src/lib/tasbeeh/sound.ts`
(lazy-loaded; sound is off by default on phones, on by default on TV).

**Licence:** every file is **CC0 1.0** (public-domain dedication) by **Kenney**
(<https://kenney.nl>). Each pack's `License.txt` reads "License: (Creative Commons Zero,
CC0) http://creativecommons.org/publicdomain/zero/1.0/". Downloaded 2026-11-23 from the
pack pages below. No Freesound clips are used (the Freesound API needs a key; D28 / §13 #3
Kenney-only fallback).

**Processing:** leading silence removed, trimmed to the active click (≤ 0.32 s), 60 ms
fade-out, downmixed to mono, AAC 48 kbps in `.m4a` (each file < 3 KB). Bead colours are
material data; these clips are the only bundled audio for the feature.

| File                     | Pack (Kenney, CC0)                                            | Source clip                   |
| ------------------------ | ------------------------------------------------------------- | ----------------------------- |
| `wood-bead.m4a`          | [Impact Sounds](https://kenney.nl/assets/impact-sounds)       | `impactWood_light_000.ogg`    |
| `wood-spacer.m4a`        | Impact Sounds                                                 | `impactWood_medium_000.ogg`   |
| `wood-complete.m4a`      | Impact Sounds                                                 | `impactWood_heavy_002.ogg`    |
| `wood-hard-bead.m4a`     | Impact Sounds                                                 | `impactPlank_medium_001.ogg`  |
| `wood-hard-spacer.m4a`   | Impact Sounds                                                 | `impactWood_medium_002.ogg`   |
| `wood-hard-complete.m4a` | Impact Sounds                                                 | `impactWood_heavy_000.ogg`    |
| `amber-bead.m4a`         | [UI Audio](https://kenney.nl/assets/ui-audio)                 | `click2.ogg`                  |
| `amber-spacer.m4a`       | Impact Sounds                                                 | `impactGeneric_light_001.ogg` |
| `amber-complete.m4a`     | [Interface Sounds](https://kenney.nl/assets/interface-sounds) | `drop_004.ogg`                |
| `stone-bead.m4a`         | Impact Sounds                                                 | `impactPlate_light_000.ogg`   |
| `stone-spacer.m4a`       | Impact Sounds                                                 | `impactGeneric_light_000.ogg` |
| `stone-complete.m4a`     | Impact Sounds                                                 | `impactPlate_medium_003.ogg`  |
| `glass-bead.m4a`         | Impact Sounds                                                 | `impactGlass_light_002.ogg`   |
| `glass-spacer.m4a`       | Impact Sounds                                                 | `impactGlass_medium_000.ogg`  |
| `glass-complete.m4a`     | Impact Sounds                                                 | `impactGlass_medium_002.ogg`  |
| `pearl-bead.m4a`         | Interface Sounds                                              | `select_001.ogg`              |
| `pearl-spacer.m4a`       | Interface Sounds                                              | `select_002.ogg`              |
| `pearl-complete.m4a`     | Interface Sounds                                              | `drop_002.ogg`                |
| `clicker-bead.m4a`       | UI Audio                                                      | `switch13.ogg`                |
| `clicker-spacer.m4a`     | UI Audio                                                      | `switch11.ogg`                |
| `clicker-complete.m4a`   | Interface Sounds                                              | `switch_007.ogg`              |
| `lcd-bead.m4a`           | Interface Sounds                                              | `click_005.ogg`               |
| `lcd-spacer.m4a`         | Interface Sounds                                              | `click_002.ogg`               |
| `lcd-complete.m4a`       | Interface Sounds                                              | `drop_001.ogg`                |

Excluded on purpose: every `impactBell_*` clip, and the Interface Sounds `bong`,
`confirmation`, `maximize`, `minimize`, `pluck`, `question` and `glass_004` clips
(tonal / chime-like). Spacer clips were chosen with a lower spectral centroid than
their pack's bead click so the 11/22 (33/66) boundary sounds heavier.
