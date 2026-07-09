import { StyleSheet, View } from "react-native";

import { UpdateRequiredModal } from "@/components/app-update/update-required-modal";
import { usePinLock } from "@/features/pin-lock";
import { useHardUpdateWebLock } from "@/hooks/use-hard-update-web-lock";
import { useAppVersion } from "@/providers/app-version-provider";

/** Soft update overlay — hard update replaces the app via HardUpdateBlockScreen. */
export function AppVersionSoftGate() {
  const { isLocked, isReady } = usePinLock();
  const { versionMeta, showUpdateModal, updateRequired, isHardUpdateBlocking } = useAppVersion();

  if (!showUpdateModal || !versionMeta || isHardUpdateBlocking) return null;
  if (isReady && isLocked) return null;
  if (updateRequired === "hard") return null;

  return (
    <View style={styles.softOverlay} pointerEvents="box-none" collapsable={false}>
      <UpdateRequiredModal visible meta={versionMeta} isHard={false} />
    </View>
  );
}

/** Hard update: only this UI is mounted — deleting overlay DOM cannot reveal the app. */
export function HardUpdateBlockScreen() {
  const { isLocked, isReady } = usePinLock();
  const { versionMeta, isHardUpdateBlocking } = useAppVersion();

  const active = isHardUpdateBlocking && versionMeta != null && !(isReady && isLocked);
  useHardUpdateWebLock(active);

  if (!active || !versionMeta) return null;

  return <UpdateRequiredModal visible meta={versionMeta} isHard presentation="fullscreen" />;
}

/** Wraps main app content and swaps to hard-update block when required. */
export function AppVersionGate({ children }: { children: React.ReactNode }) {
  const { isLocked, isReady } = usePinLock();
  const { isHardUpdateBlocking } = useAppVersion();
  const hardBlocked = isHardUpdateBlocking && !(isReady && isLocked);

  if (hardBlocked) {
    return <HardUpdateBlockScreen />;
  }

  return (
    <>
      {children}
      <AppVersionSoftGate />
    </>
  );
}

const styles = StyleSheet.create({
  softOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 9000,
  },
});
