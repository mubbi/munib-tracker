import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FocusLockEvidence } from "@/components/focus-lock/focus-lock-evidence";
import {
  FocusLockSettingsForm,
  ToggleRow,
  useFocusLockPrefs,
} from "@/components/focus-lock/focus-lock-settings-form";
import { FocusSoftPrompt } from "@/components/focus-lock/focus-soft-prompt";
import { useNativeFocusTheme } from "@/components/focus-lock/use-native-focus-theme";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { useWizardFooterSlot, WizardShell } from "@/components/wizard/wizard-shell";
import { Spacing } from "@/constants/theme";
import { useFocusPlan } from "@/hooks/use-focus-lock";
import { useForegroundInterval } from "@/hooks/use-foreground-interval";
import { type LaunchableApp, pickableApps } from "@/lib/focus-lock/allowlist";
import { syncNativePlan } from "@/lib/focus-lock/controller";
import {
  type AndroidFocusPermissions,
  type AndroidFocusSettingsPage,
  androidPermissions,
  authorizationStatus,
  blockedPackages,
  type FocusAuthStatus,
  focusLockCapability,
  focusLockPlatform,
  listLaunchableApps,
  openAndroidSettings,
  pickApps,
  requestAuthorization,
  setBlockedPackages,
} from "@/lib/focus-lock/native";
import { type FocusWindow, testWindow } from "@/lib/focus-lock/plan";
import { patchFocusLockPrefs } from "@/lib/focus-lock/prefs";
import { goBackOrReplace } from "@/lib/navigation";
import { requestExactAlarmPermission } from "@/lib/notifications/exact-alarm";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useSetting } from "@/lib/settings/use-setting";
import { focusLockStore, useFocusLockDevice } from "@/stores/focus-lock-store";

const STEPS = ["explain", "permissions", "apps", "timing", "test"] as const;
type Step = (typeof STEPS)[number];

const STEP_TITLE_KEYS: Record<Step, string> = {
  explain: "focusLock.setup.explain.title",
  permissions: "focusLock.setup.perm.title",
  apps: "focusLock.setup.apps.title",
  timing: "focusLock.setup.timing.title",
  test: "focusLock.setup.test.title",
};

/**
 * NF-3.13 onboarding: 1 explain → 2 permissions (step by step, re-checked on
 * return from Settings) → 3 pick apps → 4 Salah, timing and mode → 5 test with
 * a 1-minute window. Soft-only devices skip the permission and app steps.
 */
export default function FocusLockSetupScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ step?: string }>();
  const hard = focusLockCapability() === "hard";
  const platform = focusLockPlatform();
  const steps = useMemo<Step[]>(
    () => (hard ? [...STEPS] : STEPS.filter((s) => s !== "permissions" && s !== "apps")),
    [hard],
  );
  const initial = Math.max(0, steps.indexOf(params.step as Step));
  const [index, setIndex] = useState(initial);
  const step = steps[index] ?? "explain";
  const [prefs, save] = useFocusLockPrefs();
  const plan = useFocusPlan();
  const device = useFocusLockDevice();
  const confirmAlert = useSetting<boolean>("notifications.salah.focusLockConfirm");
  const [test, setTest] = useState<FocusWindow | null>(null);
  // Hard-blocking needs the OS permissions: tracked here so the wizard can warn
  // on the permissions step and again before "Finish" (it never silently succeeds).
  const [auth, setAuth] = useState<FocusAuthStatus>("notDetermined");
  const [perms, setPerms] = useState<AndroidFocusPermissions | null>(null);
  const checkPermissions = useCallback(async () => {
    if (!hard) return;
    if (platform === "ios") setAuth(await authorizationStatus());
    else if (platform === "android") setPerms(await androidPermissions());
  }, [hard, platform]);
  useForegroundCheck(checkPermissions);
  const permissionsGranted = !hard
    ? true
    : platform === "ios"
      ? auth === "granted"
      : perms == null || (perms.usageAccess === true && perms.overlay === true);

  const theme = useNativeFocusTheme();
  // The step Back / Next row pins above the keyboard and tab bar on phones.
  const footerSlot = useWizardFooterSlot();

  const finish = async () => {
    await focusLockStore.getState().patch({ setupDone: true });
    await save(patchFocusLockPrefs(prefs, { enabled: true }));
    goBackOrReplace(router, "/focus-lock" as Href);
  };

  const startTest = async () => {
    const w = testWindow(new Date());
    setTest(w);
    if (hard) await syncNativePlan(theme, [w]);
    setTimeout(() => {
      setTest(null);
      if (hard) void syncNativePlan(theme);
    }, w.end.getTime() - w.start.getTime());
  };

  return (
    <ScreenLayout
      title={t("focusLock.setup.title")}
      onBack={() =>
        index > 0 ? setIndex(index - 1) : goBackOrReplace(router, "/focus-lock" as Href)
      }
      footer={footerSlot.footer}
    >
      <Seo path="/focus-lock/setup" />
      <footerSlot.Provider>
        <WizardShell
          title={t(STEP_TITLE_KEYS[step])}
          stepIndex={index}
          total={steps.length}
          stepLabel={t("focusLock.setup.step", { current: index + 1, total: steps.length })}
          progressLabel={t("focusLock.setup.progressLabel")}
          backDisabled={false}
          onBack={() =>
            index > 0 ? setIndex(index - 1) : goBackOrReplace(router, "/focus-lock" as Href)
          }
          nextLabel={
            index < steps.length - 1 ? t("focusLock.setup.next") : t("focusLock.setup.finish")
          }
          onNext={() => (index < steps.length - 1 ? setIndex(index + 1) : void finish())}
        >
          {step === "explain" ? (
            <View style={styles.stack}>
              <ThemedText type="small">{t("focusLock.setup.explain.body1")}</ThemedText>
              <ThemedText type="small">{t("focusLock.setup.explain.body2")}</ThemedText>
              <ThemedText type="small">{t("focusLock.setup.explain.body3")}</ThemedText>
              {!hard ? (
                <ThemedText type="small" themeColor="mutedForeground">
                  {t("focusLock.setup.softSkip")}
                </ThemedText>
              ) : null}
            </View>
          ) : null}

          {step === "permissions" && platform === "ios" ? (
            <IosPermissions auth={auth} onCheck={checkPermissions} />
          ) : null}
          {step === "permissions" && platform === "android" ? (
            <AndroidPermissions perms={perms} onCheck={checkPermissions} />
          ) : null}
          {(step === "permissions" || step === "test") && !permissionsGranted ? (
            <Callout tone="warning" style={styles.warning}>
              {t(
                step === "test"
                  ? "focusLock.setup.perm.finishWarning"
                  : "focusLock.setup.perm.noneWarning",
              )}
            </Callout>
          ) : null}

          {step === "apps" ? (
            <View style={styles.stack}>
              <ThemedText type="small">{t("focusLock.setup.apps.body")}</ThemedText>
              {platform === "android" ? (
                <AndroidAppPicker />
              ) : (
                <>
                  <Button
                    label={t("focusLock.setup.apps.pick")}
                    onPress={async () => {
                      const { count } = await pickApps();
                      await focusLockStore.getState().patch({ appsCount: count });
                    }}
                  />
                  <ThemedText type="smallBold">
                    {t("focusLock.setup.apps.count", { count: device.appsCount })}
                  </ThemedText>
                </>
              )}
            </View>
          ) : null}

          {step === "timing" ? (
            <View style={styles.stack}>
              <FocusLockSettingsForm iqamahAvailable={plan.iqamahAvailable} />
            </View>
          ) : null}

          {step === "test" ? (
            <View style={styles.stack}>
              <ThemedText type="small">{t("focusLock.setup.test.body")}</ThemedText>
              <Button
                variant="secondary"
                label={t("focusLock.setup.test.start")}
                disabled={test != null}
                onPress={() => void startTest()}
              />
              {test && hard ? (
                <ThemedText type="smallBold" accessibilityLiveRegion="polite">
                  {t("focusLock.setup.test.running")}
                </ThemedText>
              ) : null}
              <ToggleRow
                label={t("focusLock.setup.confirmAlert")}
                hint={t("focusLock.setup.confirmAlertHint")}
                value={confirmAlert.value}
                onChange={(on) => void confirmAlert.setValue(on)}
              />
            </View>
          ) : null}
        </WizardShell>
      </footerSlot.Provider>

      {step === "explain" ? <FocusLockEvidence /> : null}

      {test && !hard ? (
        <FocusSoftPrompt
          window={test}
          mode={prefs.unlockMode}
          emergencyLeft={prefs.emergencyUnlocksPerDay}
          onDismiss={() => setTest(null)}
          onUnlock={() => setTest(null)}
        />
      ) : null}
    </ScreenLayout>
  );
}

/** Re-runs `check` on mount and whenever the app returns to the foreground (back from Settings). */
function useForegroundCheck(check: () => Promise<void>) {
  useForegroundInterval(() => void check(), null);
}

function PermissionRow({
  label,
  hint,
  granted,
  onGrant,
}: {
  label: string;
  hint: string;
  granted: boolean;
  onGrant: () => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.permission}>
      <View style={styles.flex}>
        <ThemedText type="smallBold">{label}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {hint}
        </ThemedText>
      </View>
      {granted ? (
        <ThemedText type="smallBold" themeColor="accent">
          {t("focusLock.setup.perm.granted")}
        </ThemedText>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          label={t("focusLock.setup.perm.grant")}
          accessibilityHint={hint}
          onPress={onGrant}
        />
      )}
    </View>
  );
}

function IosPermissions({
  auth,
  onCheck: check,
}: {
  auth: FocusAuthStatus;
  onCheck: () => Promise<void>;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.stack}>
      <PermissionRow
        label={t("focusLock.setup.perm.screenTime")}
        hint={t("focusLock.setup.perm.screenTimeHint")}
        granted={auth === "granted"}
        onGrant={async () => {
          await requestAuthorization();
          await check();
        }}
      />
    </View>
  );
}

function AndroidPermissions({
  perms,
  onCheck: check,
}: {
  perms: AndroidFocusPermissions | null;
  onCheck: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const open = (page: AndroidFocusSettingsPage) => () => void openAndroidSettings(page);
  return (
    <View style={styles.stack}>
      <PermissionRow
        label={t("focusLock.setup.perm.usage")}
        hint={t("focusLock.setup.perm.usageHint")}
        granted={perms?.usageAccess === true}
        onGrant={open("usageAccess")}
      />
      <PermissionRow
        label={t("focusLock.setup.perm.overlay")}
        hint={t("focusLock.setup.perm.overlayHint")}
        granted={perms?.overlay === true}
        onGrant={open("overlay")}
      />
      <PermissionRow
        label={t("focusLock.setup.perm.exact")}
        hint={t("focusLock.setup.perm.exactHint")}
        granted={perms?.exactAlarm === true}
        onGrant={() => void requestExactAlarmPermission().then(check)}
      />
      <PermissionRow
        label={t("focusLock.setup.perm.battery")}
        hint={t("focusLock.setup.perm.batteryHint")}
        granted={perms?.batteryUnrestricted === true}
        onGrant={open("battery")}
      />
      <Button
        variant="ghost"
        size="sm"
        label={t("focusLock.setup.perm.check")}
        onPress={() => void check()}
      />
    </View>
  );
}

function AndroidAppPicker() {
  const { t, i18n } = useTranslation();
  const [apps, setApps] = useState<LaunchableApp[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const persist = async (next: ReadonlySet<string>) => {
    try {
      const { count } = await setBlockedPackages([...next]);
      await focusLockStore.getState().patch({ appsCount: count });
    } catch {
      // Native module unavailable — the hub still shows the last saved count.
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([listLaunchableApps(), blockedPackages()])
      .then(([{ apps: all, context }, current]) => {
        if (cancelled) return;
        setApps(context ? pickableApps(all, context, i18n.language) : []);
        setSelected(new Set(current));
      })
      .catch(() => {
        // Native module failed — show the "no apps" note instead of a blank step.
        if (!cancelled) setApps([]);
      });
    return () => {
      cancelled = true;
    };
  }, [i18n.language]);

  // Loading the launchable apps: a row skeleton, never a blank step (R-19).
  if (!apps) {
    return (
      <SkeletonPlaceholder preset="rows" count={4} accessibilityLabel={t("common.loadingRoute")} />
    );
  }
  if (apps.length === 0) {
    return (
      <ThemedText type="small" themeColor="mutedForeground">
        {t("focusLock.setup.apps.empty")}
      </ThemedText>
    );
  }
  return (
    <View style={styles.stack}>
      {apps.map((app) => (
        <ToggleRow
          key={app.packageName}
          label={app.label}
          value={selected.has(app.packageName)}
          onChange={(on) => {
            const next = new Set(selected);
            if (on) next.add(app.packageName);
            else next.delete(app.packageName);
            setSelected(next);
            // Saved on every change: "Next" / "Finish" never drops a selection.
            void persist(next);
          }}
        />
      ))}
      <ThemedText type="smallBold" accessibilityLiveRegion="polite">
        {t("focusLock.setup.apps.count", { count: selected.size })}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  warning: { marginTop: Spacing.three },
  permission: { alignItems: "center", flexDirection: "row", gap: Spacing.three },
  flex: { flex: 1, gap: Spacing.half },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/focus-lock/setup");
