import {
  type AppVersionMeta,
  mergeAppVersionMeta,
  setAppVersionInfo,
  setVersionMetaCallback,
  type UpdateRequired,
} from "@munib-tracker/api-client";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppVersionBackgroundSync } from "@/hooks/use-app-version-background-sync";
import {
  dismissSoftUpdate,
  isSoftUpdateDismissed,
  isSoftUpdateDismissedSync,
} from "@/lib/app/app-update-dismiss";
import {
  isHardUpdateBlockingApp,
  isPendingUpdate,
  normalizeIncomingVersionMeta,
  shouldShowSettingsUpdateBadge,
  shouldShowUpdateModal,
} from "@/lib/app/app-version-policy";
import { resolveAppPlatform } from "@/lib/app/resolve-app-platform";
import { resolveAppVersion } from "@/lib/app/resolve-app-version";
import { useAuth } from "@/providers/auth-provider";

export type AppVersionContextValue = {
  clientVersion: string;
  versionMeta: AppVersionMeta | null;
  updateRequired: UpdateRequired;
  hasPendingUpdate: boolean;
  updatePromptDismissed: boolean;
  showUpdateModal: boolean;
  isHardUpdateBlocking: boolean;
  showSettingsBadge: boolean;
  dismissUpdatePrompt: () => void;
  openUpdatePrompt: () => void;
};

const AppVersionContext = createContext<AppVersionContextValue | null>(null);

function applyVersionMeta(
  prev: AppVersionMeta | null,
  incoming: AppVersionMeta,
  clientVersion: string,
): AppVersionMeta | null {
  if (incoming.updateRequired === "none") return null;
  const merged = mergeAppVersionMeta(prev, incoming);
  if (merged.updateRequired === "none") return null;
  return normalizeIncomingVersionMeta(prev, merged, clientVersion);
}

export function AppVersionProvider({ children }: { children: ReactNode }) {
  const { isReady } = useAuth();
  const clientVersion = resolveAppVersion();
  const clientPlatform = resolveAppPlatform();
  setAppVersionInfo(clientVersion, clientPlatform);

  const [versionMeta, setVersionMeta] = useState<AppVersionMeta | null>(null);
  const [localDismissed, setLocalDismissed] = useState(false);
  const [modalForcedOpen, setModalForcedOpen] = useState(false);
  const versionMetaRef = useRef<AppVersionMeta | null>(null);
  versionMetaRef.current = versionMeta;

  const targetVersion = versionMeta?.latestVersion ?? "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset dismiss/modal state when server version metadata changes
  useEffect(() => {
    setLocalDismissed(false);
    setModalForcedOpen(false);
  }, [versionMeta]);

  const updatePromptDismissed = useMemo(() => {
    if (versionMeta?.updateRequired !== "soft" || !targetVersion) return false;
    return localDismissed || isSoftUpdateDismissedSync(targetVersion);
  }, [versionMeta?.updateRequired, targetVersion, localDismissed]);

  useEffect(() => {
    if (versionMeta?.updateRequired !== "soft" || !targetVersion) return;
    void isSoftUpdateDismissed(targetVersion);
  }, [versionMeta?.updateRequired, targetVersion]);

  const dismissUpdatePrompt = useCallback(() => {
    setModalForcedOpen(false);
    const current = versionMetaRef.current;
    if (current?.updateRequired === "soft" && current.latestVersion) {
      setLocalDismissed(true);
      void dismissSoftUpdate(current.latestVersion);
    }
  }, []);

  const openUpdatePrompt = useCallback(() => {
    setModalForcedOpen(true);
  }, []);

  useEffect(() => {
    setAppVersionInfo(clientVersion, clientPlatform);
  }, [clientVersion, clientPlatform]);

  const ingestVersionMeta = useCallback(
    (meta: AppVersionMeta) => {
      setVersionMeta((prev) => applyVersionMeta(prev, meta, clientVersion));
    },
    [clientVersion],
  );

  useEffect(() => {
    setVersionMetaCallback(ingestVersionMeta);
    return () => setVersionMetaCallback(null);
  }, [ingestVersionMeta]);

  useAppVersionBackgroundSync(ingestVersionMeta, isReady);

  const updateRequired: UpdateRequired = versionMeta?.updateRequired ?? "none";
  const hasPendingUpdate = isPendingUpdate(versionMeta);
  const showUpdateModal =
    modalForcedOpen || shouldShowUpdateModal(versionMeta, updatePromptDismissed);
  const isHardUpdateBlocking = isHardUpdateBlockingApp(
    updateRequired,
    showUpdateModal,
    versionMeta,
  );
  const showSettingsBadge = shouldShowSettingsUpdateBadge(versionMeta, updatePromptDismissed);

  return (
    <AppVersionContext.Provider
      value={{
        clientVersion,
        versionMeta,
        updateRequired,
        hasPendingUpdate,
        updatePromptDismissed,
        showUpdateModal,
        isHardUpdateBlocking,
        showSettingsBadge,
        dismissUpdatePrompt,
        openUpdatePrompt,
      }}
    >
      {children}
    </AppVersionContext.Provider>
  );
}

export function useAppVersion(): AppVersionContextValue {
  const ctx = useContext(AppVersionContext);
  if (!ctx) throw new Error("useAppVersion must be used within AppVersionProvider");
  return ctx;
}

export function useAppVersionOptional(): AppVersionContextValue | null {
  return useContext(AppVersionContext);
}
