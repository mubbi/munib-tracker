/**
 * Bundled tasbeeh click sounds — loaded lazily by `sound.ts` only when sound is
 * on. All CC0 (Kenney); per-file sources in `assets/audio/tasbeeh/README.md`.
 */
import type { TasbeehSoundKind, TasbeehSoundPackId } from "./sound-packs";

export const TASBEEH_SOUND_FILES: Record<TasbeehSoundPackId, Record<TasbeehSoundKind, number>> = {
  woodSoft: {
    bead: require("../../../assets/audio/tasbeeh/wood-bead.m4a") as number,
    spacer: require("../../../assets/audio/tasbeeh/wood-spacer.m4a") as number,
    complete: require("../../../assets/audio/tasbeeh/wood-complete.m4a") as number,
  },
  woodHard: {
    bead: require("../../../assets/audio/tasbeeh/wood-hard-bead.m4a") as number,
    spacer: require("../../../assets/audio/tasbeeh/wood-hard-spacer.m4a") as number,
    complete: require("../../../assets/audio/tasbeeh/wood-hard-complete.m4a") as number,
  },
  resin: {
    bead: require("../../../assets/audio/tasbeeh/amber-bead.m4a") as number,
    spacer: require("../../../assets/audio/tasbeeh/amber-spacer.m4a") as number,
    complete: require("../../../assets/audio/tasbeeh/amber-complete.m4a") as number,
  },
  stone: {
    bead: require("../../../assets/audio/tasbeeh/stone-bead.m4a") as number,
    spacer: require("../../../assets/audio/tasbeeh/stone-spacer.m4a") as number,
    complete: require("../../../assets/audio/tasbeeh/stone-complete.m4a") as number,
  },
  glass: {
    bead: require("../../../assets/audio/tasbeeh/glass-bead.m4a") as number,
    spacer: require("../../../assets/audio/tasbeeh/glass-spacer.m4a") as number,
    complete: require("../../../assets/audio/tasbeeh/glass-complete.m4a") as number,
  },
  pearl: {
    bead: require("../../../assets/audio/tasbeeh/pearl-bead.m4a") as number,
    spacer: require("../../../assets/audio/tasbeeh/pearl-spacer.m4a") as number,
    complete: require("../../../assets/audio/tasbeeh/pearl-complete.m4a") as number,
  },
  clicker: {
    bead: require("../../../assets/audio/tasbeeh/clicker-bead.m4a") as number,
    spacer: require("../../../assets/audio/tasbeeh/clicker-spacer.m4a") as number,
    complete: require("../../../assets/audio/tasbeeh/clicker-complete.m4a") as number,
  },
  lcd: {
    bead: require("../../../assets/audio/tasbeeh/lcd-bead.m4a") as number,
    spacer: require("../../../assets/audio/tasbeeh/lcd-spacer.m4a") as number,
    complete: require("../../../assets/audio/tasbeeh/lcd-complete.m4a") as number,
  },
};
