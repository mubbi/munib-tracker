import type {
  ContentReportIssueType,
  ContentReportReference,
} from "@munib-tracker/shared/types/content-report";
import Constants from "expo-constants";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, type AppStateStatus, Platform } from "react-native";

import { ContentReportAuthGate } from "@/components/content-report/content-report-auth-gate";
import { ContentReportContext } from "@/components/content-report/content-report-context";
import { ContentReportSheet } from "@/components/content-report/content-report-sheet";
import {
  isGuestReportError,
  isOfflineReportError,
  type ReportAttachmentInput,
  submitContentReport,
} from "@/lib/content-report-api";
import { enqueueContentReport, flushContentReportQueue } from "@/lib/content-report-queue";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";

export function ContentReportProvider({ children }: { children: ReactNode }) {
  const { session, isGuest } = useAuth();
  const toast = useToast();
  const { t } = useTranslation();
  const [activeRef, setActiveRef] = useState<ContentReportReference | null>(null);
  const [authGateVisible, setAuthGateVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const flushQueue = useCallback(async () => {
    const token = session?.accessToken;
    if (!token || isGuest) return;
    try {
      const sent = await flushContentReportQueue(token);
      if (sent > 0) {
        toast.success(
          sent === 1
            ? t("contentReport.queuedSentOne")
            : t("contentReport.queuedSentMany", { count: sent }),
        );
      }
    } catch {
      // remain queued
    }
  }, [session?.accessToken, isGuest, toast, t]);

  useEffect(() => {
    void flushQueue();
  }, [flushQueue]);

  useEffect(() => {
    const onChange = (status: AppStateStatus) => {
      if (status === "active") void flushQueue();
    };
    const subscription = AppState.addEventListener("change", onChange);
    return () => subscription.remove();
  }, [flushQueue]);

  const openReport = useCallback(
    (ref: ContentReportReference) => {
      if (isGuest || !session?.accessToken) {
        setAuthGateVisible(true);
        return;
      }
      setActiveRef(ref);
    },
    [isGuest, session?.accessToken],
  );

  const closeSheet = useCallback(() => {
    setActiveRef(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: {
      issueType: ContentReportIssueType;
      description: string;
      suggestedCorrection: string;
      userReference: string;
      attachments: ReportAttachmentInput[];
    }) => {
      if (!activeRef || !session?.accessToken) return;

      const payload = {
        issueType: values.issueType,
        description: values.description,
        suggestedCorrection: values.suggestedCorrection || undefined,
        userReference: values.userReference || undefined,
        content: activeRef,
        appVersion: Constants.expoConfig?.version ?? "1.0.0",
        platform: Platform.OS,
      };

      setSubmitting(true);
      try {
        await submitContentReport(session.accessToken, payload, values.attachments);
        toast.success(t("contentReport.submitSuccess"));
        closeSheet();
      } catch (error) {
        if (isGuestReportError(error)) {
          closeSheet();
          setAuthGateVisible(true);
          return;
        }
        if (isOfflineReportError(error)) {
          await enqueueContentReport(payload, values.attachments);
          toast.success(t("contentReport.queuedOffline"));
          closeSheet();
          return;
        }
        toast.error(t("contentReport.submitFailed"));
      } finally {
        setSubmitting(false);
      }
    },
    [activeRef, session?.accessToken, toast, t, closeSheet],
  );

  const contextValue = useMemo(() => ({ openReport }), [openReport]);

  return (
    <ContentReportContext.Provider value={contextValue}>
      {children}
      <ContentReportAuthGate visible={authGateVisible} onClose={() => setAuthGateVisible(false)} />
      <ContentReportSheet
        visible={activeRef != null}
        contentRef={activeRef}
        submitting={submitting}
        onSubmit={(values) => void handleSubmit(values)}
        onClose={closeSheet}
      />
    </ContentReportContext.Provider>
  );
}
