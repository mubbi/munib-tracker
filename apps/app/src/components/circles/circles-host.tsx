import type { FardStatusValue } from "@munib-tracker/shared/circles";
import { FARD_PRAYERS } from "@munib-tracker/shared/circles";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";

import { ReconsentSheet } from "@/components/circles/reconsent-sheet";
import { type CircleSummary, putFardStatus } from "@/lib/circles/api";
import {
  flushPendingChildStatuses,
  loadChildSession,
  refreshChildProfile,
  useChildSession,
} from "@/lib/circles/child-session";
import { pendingConsentChildren } from "@/lib/circles/consent";
import { fardValueFromStatuses, isFamilyParent, sameFardStatus } from "@/lib/circles/family";
import { useChildProfiles, useCircle, useCircleAuth, useCircles } from "@/lib/circles/hooks";
import { isKidsAllowedPath } from "@/lib/circles/kids-content";
import { isTV } from "@/lib/platform/is-tv";
import { setChildSessionPrivacy } from "@/lib/sentry";
import { usePreferences } from "@/stores/preferences-store";
import { useTodayPrayers } from "@/stores/tracker-store";

const SHARE_DEBOUNCE_MS = 4000;

/**
 * App-wide circles side effects (NF-3.16), mounted once in the root overlays:
 *
 * 1. Child device: load the scoped session, keep navigation inside kids mode,
 *    limit Sentry to crash data, retry pending fard-status pushes on resume.
 * 2. Adult family member (13+) who opted in: push today's five fard booleans.
 * 3. D34: a transferred child profile waiting for consent opens a blocking sheet.
 *
 * Circles data is fetched without polling here (screens poll while open).
 */
export function CirclesHost() {
  const tv = isTV();
  const session = useChildSession();
  const auth = useCircleAuth();
  const childDevice = session.token != null;

  useEffect(() => {
    if (!tv) void loadChildSession();
  }, [tv]);

  useEffect(() => {
    setChildSessionPrivacy(childDevice);
  }, [childDevice]);

  if (tv) return null;
  if (childDevice) return <ChildDeviceGuard />;
  if (!auth.isAccount) return null;
  return <AccountCircleEffects />;
}

function ChildDeviceGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname && !isKidsAllowedPath(pathname)) router.replace("/kids");
  }, [pathname, router]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      void refreshChildProfile();
      void flushPendingChildStatuses();
    });
    return () => sub.remove();
  }, []);

  return null;
}

function AccountCircleEffects() {
  const circles = useCircles({ poll: false });
  const families = useMemo(
    () => (circles.data ?? []).filter((c) => c.type === "family"),
    [circles.data],
  );
  return (
    <>
      {families.map((family) =>
        isFamilyParent(family.myRole) ? (
          <ParentConsentWatcher key={family.id} circle={family} />
        ) : family.myRole === "member" ? (
          <AdultFardShare key={family.id} circleId={family.id} />
        ) : null,
      )}
    </>
  );
}

/** D34: blocking re-consent sheet for transferred child profiles. */
function ParentConsentWatcher({ circle }: { circle: CircleSummary }) {
  const children = useChildProfiles(circle.id, { poll: false });
  const pending = pendingConsentChildren(children.data);
  const [dismissed, setDismissed] = useState(false);
  if (pending.length === 0 || dismissed) return null;
  return (
    <ReconsentSheet circleId={circle.id} pending={pending} onDone={() => setDismissed(true)} />
  );
}

/**
 * Adult (13+) family member who opted in to share: push today's five booleans
 * when the tracker changes. Never during an excused period (no signal is sent,
 * so nothing about it is revealed), never notes / qaza.
 */
function AdultFardShare({ circleId }: { circleId: string }) {
  const auth = useCircleAuth();
  const detail = useCircle(circleId, { poll: false });
  const me = detail.data?.members.find((m) => m.isMe);
  const prefs = usePreferences();
  const { status } = useTodayPrayers();
  const value = useMemo(() => fardValueFromStatuses(status), [status]);
  const lastSent = useRef<{ date: string; value: FardStatusValue } | null>(null);
  const enabled = me?.shareFardStatus === true && !prefs.activeExcusedReason;
  const anyLogged = FARD_PRAYERS.some((p) => value[p]);

  useEffect(() => {
    if (!enabled || !anyLogged) return;
    const date = getLocalDateString();
    const last = lastSent.current;
    if (last && last.date === date && sameFardStatus(last.value, value)) return;
    const timer = setTimeout(() => {
      putFardStatus(auth.token, circleId, { date, ...value })
        .then(() => {
          lastSent.current = { date, value };
        })
        .catch(() => {
          // Offline — the next tracker change retries.
        });
    }, SHARE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [enabled, anyLogged, value, auth.token, circleId]);

  return null;
}
