import { useCallback, useEffect, useRef, useState } from "react";

import { discardPhoto } from "@/lib/timetable-ocr";

/**
 * The one photo copy the timetable import may keep for its review (D3: the
 * app's copy never outlives the screen). Keeping a new photo discards the one
 * it replaces, `clear()` discards it now, and unmount discards whatever is left.
 */
export function useKeptPhoto(): {
  uri: string | null;
  keep: (uri: string) => void;
  clear: () => void;
} {
  const [uri, setUri] = useState<string | null>(null);
  const ref = useRef<string | null>(null);

  const replace = useCallback((next: string | null) => {
    if (ref.current && ref.current !== next) discardPhoto(ref.current);
    ref.current = next;
    setUri(next);
  }, []);

  useEffect(
    () => () => {
      discardPhoto(ref.current);
      ref.current = null;
    },
    [],
  );

  return {
    uri,
    keep: useCallback((next: string) => replace(next), [replace]),
    clear: useCallback(() => replace(null), [replace]),
  };
}
