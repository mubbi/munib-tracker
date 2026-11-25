import { createContext, type ReactNode, useContext } from "react";

/**
 * Whether inline recite-along buttons (beside a quoted ayah, e.g. in
 * `JannahQuranEvidence`) should render. A screen that already shows a
 * recite-along card for the same ayahs wraps its article in
 * `<ReciteAlongInlineScope enabled={false}>` so the ayahs aren't offered twice.
 */
const ReciteAlongInlineContext = createContext(true);

export function ReciteAlongInlineScope({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  return (
    <ReciteAlongInlineContext.Provider value={enabled}>
      {children}
    </ReciteAlongInlineContext.Provider>
  );
}

export function useReciteAlongInlineEnabled(): boolean {
  return useContext(ReciteAlongInlineContext);
}
