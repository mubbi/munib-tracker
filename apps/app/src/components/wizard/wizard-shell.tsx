import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  findNodeHandle,
  Platform,
  StyleSheet,
  View,
  type ViewInstance,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spacing } from "@/constants/theme";

export type WizardShellProps = {
  /** Step heading (also the accessibility focus target when the step changes). */
  title: string;
  /** 0-based index of the current step. */
  stepIndex: number;
  total: number;
  /** "Step 2 of 9" — translated by the caller (each tool has its own plural-safe key). */
  stepLabel: string;
  /** What is progressing ("Setup steps"); spoken with the percentage. */
  progressLabel: string;
  /** Small line under the heading ("Optional"). */
  subtitle?: string;
  children: ReactNode;
  onBack: () => void;
  /** Hidden on the first step unless a caller keeps a leave action there. */
  backLabel?: string;
  backDisabled?: boolean;
  /** Absent on the last step when the body owns the primary action (review → save). */
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  /** Why Next is disabled — shown as a quiet line above the footer, never grey-only. */
  nextHint?: string;
  /** Lets the screen turn the shell's content into a Card (default) or a bare stack. */
  bare?: boolean;
  /** Extra footer content between Back and Next (e.g. "Skip"). */
  footerExtra?: ReactNode;
};

/** Back / Next row props (shared by the inline footer and the screen footer). */
type WizardFooterProps = Pick<
  WizardShellProps,
  | "stepIndex"
  | "onBack"
  | "backLabel"
  | "backDisabled"
  | "onNext"
  | "nextLabel"
  | "nextDisabled"
  | "nextHint"
  | "footerExtra"
>;

/** Set by `useWizardFooterSlot`: where a nested `WizardShell` publishes its footer. */
const FooterSlotContext = createContext<((footer: ReactNode) => void) | null>(null);

/**
 * Lets a route pin a nested wizard's Back / Next row in `ScreenLayout`'s
 * `footer` (above the keyboard, safe area and tab bar on phones; inline on wide
 * windows and TV) when the wizard lives in a component:
 *
 *   const slot = useWizardFooterSlot();
 *   <ScreenLayout footer={slot.footer}><slot.Provider>…<WizardShell/>…</slot.Provider></ScreenLayout>
 *
 * Without a slot the shell draws the row inline after the step body.
 */
export function useWizardFooterSlot(): {
  footer: ReactNode;
  Provider: (props: { children: ReactNode }) => ReactNode;
} {
  const [footer, setFooter] = useState<ReactNode>(null);
  const Provider = useCallback(
    ({ children }: { children: ReactNode }) => (
      <FooterSlotContext.Provider value={setFooter}>{children}</FooterSlotContext.Provider>
    ),
    [],
  );
  return { footer, Provider };
}

type FooterStore = {
  get: () => WizardFooterProps;
  set: (next: WizardFooterProps) => void;
  subscribe: (listener: () => void) => () => void;
};

function createFooterStore(initial: WizardFooterProps): FooterStore {
  let current = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => current,
    set: (next) => {
      current = next;
      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** The published footer: re-renders from the shell's latest props without re-rendering the route. */
function SlottedFooter({ store }: { store: FooterStore }) {
  const props = useSyncExternalStore(store.subscribe, store.get, store.get);
  return <WizardFooter {...props} />;
}

/** Disabled-Next hint + Back / extra / Next row. */
export function WizardFooter({
  stepIndex,
  onBack,
  backLabel,
  backDisabled,
  onNext,
  nextLabel,
  nextDisabled,
  nextHint,
  footerExtra,
}: WizardFooterProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.footerStack}>
      {nextDisabled && nextHint ? <Callout tone="info">{nextHint}</Callout> : null}
      <View style={styles.footer}>
        <Button
          label={backLabel ?? t("common.back")}
          variant="ghost"
          disabled={backDisabled ?? stepIndex === 0}
          onPress={onBack}
        />
        {footerExtra}
        {onNext ? (
          <Button label={nextLabel ?? t("common.next")} disabled={nextDisabled} onPress={onNext} />
        ) : null}
      </View>
    </View>
  );
}

/**
 * The one chrome for multi-step tools (focus-lock setup, wasiyyah, mirath):
 * heading + "Step n of m" + progress bar on top, the step body, and a footer
 * with Back / Next. A disabled Next always says why (`nextHint`). Moving to
 * another step moves accessibility focus to the new heading.
 */
export function WizardShell({
  title,
  stepIndex,
  total,
  stepLabel,
  progressLabel,
  subtitle,
  children,
  onBack,
  backLabel,
  backDisabled,
  onNext,
  nextLabel,
  nextDisabled,
  nextHint,
  bare,
  footerExtra,
}: WizardShellProps) {
  const headingRef = useRef<ViewInstance>(null);
  const footerProps: WizardFooterProps = {
    stepIndex,
    onBack,
    backLabel,
    backDisabled,
    onNext,
    nextLabel,
    nextDisabled,
    nextHint,
    footerExtra,
  };
  const publish = useContext(FooterSlotContext);
  const storeRef = useRef<FooterStore | null>(null);
  if (!storeRef.current) storeRef.current = createFooterStore(footerProps);
  const store = storeRef.current;

  // Keep the published footer on the latest step / handlers.
  useLayoutEffect(() => {
    store.set(footerProps);
  });
  useEffect(() => {
    if (!publish) return;
    publish(<SlottedFooter store={store} />);
    return () => publish(null);
  }, [publish, store]);
  const firstRender = useRef(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run when the step changes
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (Platform.OS === "web") {
      (headingRef.current as unknown as HTMLElement | null)?.focus?.();
      return;
    }
    const node = headingRef.current ? findNodeHandle(headingRef.current) : null;
    if (node != null) AccessibilityInfo.setAccessibilityFocus(node);
  }, [stepIndex]);

  const body = bare ? <View style={styles.stack}>{children}</View> : <Card>{children}</Card>;

  return (
    <View style={styles.stack}>
      <View style={styles.progress}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {stepLabel}
        </ThemedText>
        <ProgressBar
          value={total > 0 ? (stepIndex + 1) / total : 0}
          accessibilityLabel={progressLabel}
        />
      </View>
      <View
        ref={headingRef}
        accessible
        focusable
        {...(Platform.OS === "web" ? ({ tabIndex: -1 } as object) : null)}
        style={styles.heading}
      >
        <ThemedText type="subtitle" heading={2}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {body}
      {publish ? null : <WizardFooter {...footerProps} />}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  progress: { gap: Spacing.two },
  heading: { gap: Spacing.half },
  footerStack: { gap: Spacing.three },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
  },
});
