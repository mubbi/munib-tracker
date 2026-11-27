import { useCallback, useRef } from "react";

import { useUndoToast } from "@/hooks/use-undo-toast";
import { useDuroodFavoritesActions, useFavoriteDuroodIds } from "@/stores/durood-favorites-store";

/**
 * Save / un-save a durood from the list or the reader. Saving is one tap;
 * un-saving runs through the Undo toast and Undo puts the durood back at its
 * place in the saved order (B-30). Render `<TvUndoButton controller={undoToast} />`
 * on TV, where toasts take no focus.
 */
export function useDuroodSaveToggle() {
  const order = useFavoriteDuroodIds();
  const orderRef = useRef(order);
  orderRef.current = order;
  const { toggle, restore } = useDuroodFavoritesActions();
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
        messageKey: "duroods.removedToast",
      });
    },
    [restore, toggle, undoToast],
  );

  return { toggleSaved, undoToast };
}
