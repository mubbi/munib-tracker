import { useCallback, useRef } from "react";

import { useUndoToast } from "@/hooks/use-undo-toast";
import { useDuaFavoritesActions, useFavoriteDuaIds } from "@/stores/dua-favorites-store";

/**
 * Save / un-save a dua from a list or reader. Saving is one tap; un-saving
 * runs through the Undo toast (P8-07) and Undo puts the dua back at its place
 * in the user's saved order (B-30). Render `<TvUndoButton controller={undoToast} />`
 * on TV, where toasts take no focus.
 */
export function useDuaSaveToggle() {
  const order = useFavoriteDuaIds();
  const orderRef = useRef(order);
  orderRef.current = order;
  const { toggle, restore } = useDuaFavoritesActions();
  const undoToast = useUndoToast();

  const toggleSaved = useCallback(
    (id: string) => {
      const position = orderRef.current.indexOf(id);
      if (position < 0) {
        void toggle(id);
        return;
      }
      void undoToast.run({
        do: () => toggle(id),
        undo: () => restore(id, position),
        messageKey: "dua.removedToast",
      });
    },
    [restore, toggle, undoToast],
  );

  return { toggleSaved, undoToast };
}
