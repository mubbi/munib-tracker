import { useRouter } from "expo-router";
import { type ReactNode, useCallback, useState } from "react";

import { ReciteAlongSectionSheet } from "@/components/quran/recite-along-section-sheet";
import { useReciteAlongAvailable } from "@/hooks/use-recite-along-available";
import type { Passage } from "@/lib/quran-companion/types";
import {
  isLongPassage,
  type ReciteAlongMode,
  reciteAlongHref,
  reciteAlongModeFor,
} from "@/lib/recite-along/passages";

/**
 * Recite-along for actions that cannot host a `ReciteAlongButton` themselves —
 * e.g. a button inside another sheet (a group-khatm part). `launch()`
 * opens the practice session straight away, or the "whole passage / ten ayahs"
 * sheet for a long passage (> 20 ayahs). Render `sheet` once, outside any other
 * sheet. `available` mirrors `useReciteAlongAvailable()` (no TV, no unsupported runtime).
 */
export function useReciteAlongLauncher(): {
  available: boolean;
  launch: (passage: Passage, mode?: ReciteAlongMode) => void;
  sheet: ReactNode;
} {
  const router = useRouter();
  const available = useReciteAlongAvailable();
  const [pending, setPending] = useState<{ passage: Passage; mode: ReciteAlongMode } | null>(null);
  const [open, setOpen] = useState(false);

  const launch = useCallback(
    (passage: Passage, mode: ReciteAlongMode = "follow") => {
      if (isLongPassage(passage)) {
        setPending({ passage, mode });
        setOpen(true);
        return;
      }
      router.push(reciteAlongHref(passage, reciteAlongModeFor(passage, mode)));
    },
    [router],
  );

  // Kept mounted after the first long passage so the sheet can animate out.
  const sheet = pending ? (
    <ReciteAlongSectionSheet
      visible={open}
      passage={pending.passage}
      mode={pending.mode}
      onClose={() => setOpen(false)}
      onPick={(target, pickedMode) => {
        setOpen(false);
        router.push(reciteAlongHref(target, pickedMode));
      }}
    />
  ) : null;

  return { available, launch, sheet };
}
