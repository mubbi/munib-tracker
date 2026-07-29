"use client";

import type {
  AdminBroadcastCategory,
  AdminBroadcastFilters,
  AdminBroadcastInternalScreen,
  AdminBroadcastLinkType,
  AdminBroadcastPlatform,
  AdminBroadcastScheduleMode,
  AdminBroadcastTemplate,
} from "@munib-tracker/shared";
import {
  ADMIN_BROADCAST_BODY_MAX,
  ADMIN_BROADCAST_FILTER_PRESETS,
  ADMIN_BROADCAST_INTERNAL_SCREENS,
  ADMIN_BROADCAST_SUBTITLE_MAX,
  ADMIN_BROADCAST_TITLE_MAX,
  type AdminBroadcastFilterPreset,
  broadcastFiltersEqual,
  canonicalBroadcastFilters,
} from "@munib-tracker/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { BroadcastFilterPresetPicker } from "@/components/notifications/broadcast-filter-preset-picker";
import { BroadcastNotificationPreview } from "@/components/notifications/broadcast-notification-preview";
import { BroadcastSendSummary } from "@/components/notifications/broadcast-send-summary";
import { BroadcastTemplatePicker } from "@/components/notifications/broadcast-template-picker";
import {
  CharCountField,
  CollapsibleSection,
  FilterSection,
  ReachBadge,
  ToggleChip,
  WizardFooter,
  WizardPanel,
  WizardStepIndicator,
} from "@/components/notifications/broadcast-wizard-ui";
import {
  FilterOptionChips,
  SingleSelectChips,
} from "@/components/notifications/filter-option-chips";
import { Alert } from "@/components/ui/alert";
import { buttonClasses } from "@/components/ui/button";
import { Field, FormGrid } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/input";
import {
  type CreateBroadcastInput,
  createAdminBroadcast,
  previewBroadcastAudience,
} from "@/lib/actions/broadcasts";
import type { BroadcastFilterOptions } from "@/lib/notifications/broadcastFilterOptions";
import {
  countActiveBroadcastFilters,
  formatBroadcastFilterSummary,
} from "@/lib/notifications/broadcastFilterUtils";
import { formatNumber } from "@/lib/utils";

const WIZARD_STEPS = [
  { id: "message", label: "Message" },
  { id: "target", label: "Target & deliver" },
  { id: "review", label: "Review" },
] as const;

type WizardState = {
  category: AdminBroadcastCategory;
  title: string;
  subtitle: string;
  body: string;
  filters: AdminBroadcastFilters;
  sendInApp: boolean;
  sendPush: boolean;
  scheduleMode: AdminBroadcastScheduleMode;
  scheduleDate: string;
  scheduleTime: string;
  linkType: AdminBroadcastLinkType;
  internalScreen: AdminBroadcastInternalScreen;
  externalUrl: string;
};

const INITIAL_STATE: WizardState = {
  category: "product_news",
  title: "",
  subtitle: "",
  body: "",
  filters: {},
  sendInApp: true,
  sendPush: true,
  scheduleMode: "immediate",
  scheduleDate: "",
  scheduleTime: "",
  linkType: "none",
  internalScreen: "/",
  externalUrl: "",
};

type BroadcastWizardProps = {
  estimatedAllUsers: number;
  webPushConfigured: boolean;
  filterOptions: BroadcastFilterOptions;
};

type ProgressState = {
  broadcastId: number;
  totalUsers: number;
  usersProcessed: number;
  status: string;
};

function deliverySummary(
  sendInApp: boolean,
  sendPush: boolean,
  scheduleMode: AdminBroadcastScheduleMode,
): string {
  const channels =
    [sendInApp && "In-app", sendPush && "Push"].filter(Boolean).join(" + ") || "No channel";
  const when =
    scheduleMode === "immediate"
      ? "now"
      : scheduleMode === "fixed_utc"
        ? "scheduled UTC"
        : "local time";
  return `${channels} · ${when}`;
}

function tapActionSummary(state: WizardState): string {
  if (state.linkType === "none") return "Dashboard (default)";
  if (state.linkType === "external") return state.externalUrl.trim() || "External URL required";
  return state.internalScreen;
}

export function BroadcastWizard({
  estimatedAllUsers,
  webPushConfigured,
  filterOptions,
}: BroadcastWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [audienceCount, setAudienceCount] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [, startTransition] = useTransition();

  const activeFilterCount = countActiveBroadcastFilters(state.filters);

  const selectedFilterPresetId = useMemo(
    () =>
      ADMIN_BROADCAST_FILTER_PRESETS.find((preset) =>
        broadcastFiltersEqual(preset.filters, state.filters),
      )?.id ?? null,
    [state.filters],
  );

  const audienceSummaryText = useMemo(() => {
    if (previewLoading) return "Calculating reach…";
    if (audienceCount != null) {
      const filters = formatBroadcastFilterSummary(state.filters);
      return filters.length > 0 ? filters.slice(0, 2).join(" · ") : "All linked users";
    }
    return `≈ ${formatNumber(estimatedAllUsers)} linked users`;
  }, [audienceCount, estimatedAllUsers, previewLoading, state.filters]);

  const patch = (partial: Partial<WizardState>) => setState((prev) => ({ ...prev, ...partial }));

  const patchFilters = (partial: AdminBroadcastFilters) =>
    setState((prev) => {
      const merged = { ...prev.filters, ...partial };
      const filters = Object.fromEntries(
        Object.entries(merged).filter(([, value]) => value !== undefined),
      ) as AdminBroadcastFilters;
      return { ...prev, filters };
    });

  const applyTemplate = useCallback((template: AdminBroadcastTemplate) => {
    setState((prev) => {
      return {
        ...prev,
        category: template.category,
        title: template.title,
        subtitle: template.subtitle ?? "",
        body: template.body,
        ...(template.internalScreen !== undefined
          ? { linkType: "internal" as const, internalScreen: template.internalScreen }
          : {}),
      };
    });
    setSelectedTemplateId(template.id);
  }, []);

  const hasMessageContent =
    Boolean(state.title.trim()) || Boolean(state.subtitle.trim()) || Boolean(state.body.trim());

  const buildInput = useCallback((): CreateBroadcastInput => {
    return {
      category: state.category,
      title: state.title.trim(),
      body: state.body.trim(),
      subtitle: state.subtitle.trim() || undefined,
      sendInApp: state.sendInApp,
      sendPush: state.sendPush,
      scheduleMode: state.scheduleMode,
      scheduleDate: state.scheduleDate || undefined,
      scheduleTime: state.scheduleTime || undefined,
      linkType: state.linkType,
      internalScreen: state.internalScreen,
      externalUrl: state.externalUrl.trim() || undefined,
      filters: state.filters,
    };
  }, [state]);

  const refreshAudience = useCallback(async (filters: AdminBroadcastFilters) => {
    setPreviewLoading(true);
    try {
      const { totalUsers } = await previewBroadcastAudience({ filters });
      setAudienceCount(totalUsers);
      return totalUsers;
    } catch {
      setAudienceCount(null);
      return null;
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  const applyFilterPreset = useCallback(
    (preset: AdminBroadcastFilterPreset) => {
      const filters = canonicalBroadcastFilters(preset.filters);
      setState((prev) => ({ ...prev, filters }));
      void refreshAudience(filters);
    },
    [refreshAudience],
  );

  const validateStep = (index: number): string | null => {
    if (index === 0) {
      if (!state.title.trim()) return "Title is required";
      if (!state.body.trim()) return "Body is required";
    }
    if (index === 1) {
      if (!state.sendInApp && !state.sendPush) return "Enable at least one delivery channel";
      if (state.scheduleMode !== "immediate" && (!state.scheduleDate || !state.scheduleTime)) {
        return "Schedule date and time are required";
      }
      if (state.linkType === "external" && !state.externalUrl.trim()) {
        return "External URL is required";
      }
    }
    return null;
  };

  const goNext = async () => {
    setError(null);
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (step === 1) {
      const count = await refreshAudience(state.filters);
      if (count === 0) {
        setError("No users match these filters. Adjust targeting before continuing.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  };

  const goBack = () => {
    setError(null);
    setConfirmOpen(false);
    setStep((s) => Math.max(s - 1, 0));
  };

  const runBatches = async (broadcastId: number, totalUsers: number) => {
    setIsRunning(true);
    setProgress({ broadcastId, totalUsers, usersProcessed: 0, status: "processing" });
    try {
      let done = false;
      while (!done) {
        const res = await fetch(`/api/broadcasts/${broadcastId}/process`, { method: "POST" });
        const data = (await res.json()) as {
          done?: boolean;
          waiting?: boolean;
          error?: string;
          broadcast?: { usersProcessed?: number; status?: string; totalUsers?: number };
        };
        if (!res.ok) throw new Error(data.error ?? "Batch processing failed");
        if (data.broadcast) {
          setProgress({
            broadcastId,
            totalUsers: data.broadcast.totalUsers ?? totalUsers,
            usersProcessed: data.broadcast.usersProcessed ?? 0,
            status: data.broadcast.status ?? "processing",
          });
        }
        done = data.done === true;
        if (data.waiting) break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Broadcast failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSend = () => {
    setError(null);
    startTransition(async () => {
      try {
        const input = buildInput();
        const { broadcastId, totalUsers, scheduled } = await createAdminBroadcast(input);
        if (scheduled) {
          router.push("/notifications/broadcasts");
          router.refresh();
          return;
        }
        await runBatches(broadcastId, totalUsers);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not start broadcast");
        setConfirmOpen(false);
      }
    });
  };

  const pct =
    progress && progress.totalUsers > 0
      ? Math.min(100, Math.round((progress.usersProcessed / progress.totalUsers) * 100))
      : 0;

  const filterDraft = state.filters;
  const chipCompact = true;

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      <WizardStepIndicator steps={WIZARD_STEPS} currentIndex={step} />

      {error ? <Alert variant="error">{error}</Alert> : null}
      {!webPushConfigured ? (
        <Alert variant="info">
          Web Push not configured — mobile push still works; browser users need VAPID keys.
        </Alert>
      ) : null}

      {progress ? (
        <Alert variant={progress.status === "completed" ? "success" : "info"}>
          <p className="text-sm font-medium">
            {progress.status === "completed" ? "Broadcast completed" : "Sending…"}{" "}
            <span className="font-normal tabular-nums text-fg-muted">
              {formatNumber(progress.usersProcessed)} / {formatNumber(progress.totalUsers)} ({pct}%)
            </span>
          </p>
          {progress.status !== "completed" ? (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-brand-600 transition-[width]"
                style={{ width: `${pct}%` }}
              />
            </div>
          ) : (
            <Link
              href="/notifications/broadcasts"
              className="mt-1 inline-block text-xs font-medium text-brand-600 hover:underline"
            >
              View history
            </Link>
          )}
        </Alert>
      ) : null}

      {step === 0 ? (
        <WizardPanel title="Compose" description="Short copy works best on lock screens.">
          <div className="grid gap-4 lg:grid-cols-[1fr_minmax(280px,320px)] lg:items-start">
            <div className="space-y-3">
              <BroadcastTemplatePicker
                selectedId={selectedTemplateId}
                onApply={applyTemplate}
                disabled={isRunning}
                hasExistingContent={hasMessageContent}
              />
              <FormGrid className="gap-3">
                <Field label="Category" required className="sm:col-span-2">
                  <Select
                    value={state.category}
                    onChange={(e) => patch({ category: e.target.value as AdminBroadcastCategory })}
                    disabled={isRunning}
                    className="text-sm"
                  >
                    <option value="product_news">Product news</option>
                    <option value="content">Content</option>
                    <option value="reminder">Reminder</option>
                    <option value="general">General</option>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <CharCountField
                    compact
                    label="Title"
                    required
                    maxLength={ADMIN_BROADCAST_TITLE_MAX}
                    value={state.title}
                    onChange={(title) => patch({ title })}
                    disabled={isRunning}
                    placeholder="What's new"
                  />
                </div>
                <div className="sm:col-span-2">
                  <CharCountField
                    compact
                    label="Subtitle"
                    maxLength={ADMIN_BROADCAST_SUBTITLE_MAX}
                    value={state.subtitle}
                    onChange={(subtitle) => patch({ subtitle })}
                    disabled={isRunning}
                  />
                </div>
                <div className="sm:col-span-2">
                  <CharCountField
                    compact
                    label="Body"
                    required
                    multiline
                    rows={3}
                    maxLength={ADMIN_BROADCAST_BODY_MAX}
                    value={state.body}
                    onChange={(body) => patch({ body })}
                    disabled={isRunning}
                  />
                </div>
              </FormGrid>
            </div>
            <BroadcastNotificationPreview
              compact
              className="lg:sticky lg:top-3"
              title={state.title}
              subtitle={state.subtitle}
              body={state.body}
            />
          </div>
        </WizardPanel>
      ) : null}

      {step === 1 ? (
        <WizardPanel
          title="Target & deliver"
          description="Audience filters, channels, schedule, and tap destination."
        >
          <div className="space-y-2">
            <CollapsibleSection
              title="Audience"
              defaultOpen
              badge={
                <ReachBadge
                  count={audienceCount}
                  loading={previewLoading}
                  filterCount={activeFilterCount}
                />
              }
              summary={audienceSummaryText}
            >
              <div className="space-y-3">
                <BroadcastFilterPresetPicker
                  selectedId={selectedFilterPresetId}
                  onApply={applyFilterPreset}
                  disabled={isRunning}
                  hasCustomFilters={activeFilterCount > 0}
                />
                <FilterSection title="Platform">
                  <FilterOptionChips
                    compact={chipCompact}
                    label="Platform"
                    options={filterOptions.platforms}
                    selected={(filterDraft.platforms ?? []) as string[]}
                    onChange={(selected) =>
                      patchFilters({
                        platforms: selected.length
                          ? (selected as AdminBroadcastPlatform[])
                          : undefined,
                      })
                    }
                    disabled={isRunning}
                  />
                </FilterSection>
                <FilterSection title="Language">
                  <FilterOptionChips
                    compact={chipCompact}
                    label="Language"
                    options={filterOptions.locales}
                    selected={filterDraft.locales ?? []}
                    onChange={(selected) =>
                      patchFilters({ locales: selected.length ? selected : undefined })
                    }
                    disabled={isRunning}
                  />
                </FilterSection>

                <FilterSection title="Activity">
                  <SingleSelectChips
                    compact={chipCompact}
                    label="Active within"
                    options={filterOptions.activityPresets}
                    value={
                      filterDraft.activeWithinDays != null
                        ? String(filterDraft.activeWithinDays)
                        : undefined
                    }
                    onChange={(value) =>
                      patchFilters({
                        activeWithinDays: value ? Number(value) : undefined,
                        inactiveForDays: value ? undefined : filterDraft.inactiveForDays,
                      })
                    }
                    disabled={isRunning}
                  />
                  <SingleSelectChips
                    compact={chipCompact}
                    label="Inactive for"
                    options={filterOptions.activityPresets}
                    value={
                      filterDraft.inactiveForDays != null
                        ? String(filterDraft.inactiveForDays)
                        : undefined
                    }
                    onChange={(value) =>
                      patchFilters({
                        inactiveForDays: value ? Number(value) : undefined,
                        activeWithinDays: value ? undefined : filterDraft.activeWithinDays,
                      })
                    }
                    disabled={isRunning}
                  />
                </FilterSection>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    className={buttonClasses("ghost", undefined, "xs")}
                    disabled={previewLoading || isRunning}
                    onClick={() => void refreshAudience(state.filters)}
                  >
                    Refresh reach
                  </button>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Delivery & schedule"
              defaultOpen
              summary={deliverySummary(state.sendInApp, state.sendPush, state.scheduleMode)}
            >
              <div className="space-y-3">
                <div className="flex gap-2">
                  <ToggleChip
                    label="In-app"
                    description="Notification inbox"
                    checked={state.sendInApp}
                    onChange={(sendInApp) => patch({ sendInApp })}
                    disabled={isRunning}
                  />
                  <ToggleChip
                    label="Push"
                    description="Lock screen alert"
                    checked={state.sendPush}
                    onChange={(sendPush) => patch({ sendPush })}
                    disabled={isRunning}
                  />
                </div>
                <FormGrid className="gap-3">
                  <Field label="When" className="sm:col-span-2">
                    <Select
                      value={state.scheduleMode}
                      onChange={(e) =>
                        patch({ scheduleMode: e.target.value as AdminBroadcastScheduleMode })
                      }
                      disabled={isRunning}
                      className="text-sm"
                    >
                      <option value="immediate">Send immediately</option>
                      <option value="fixed_utc">Fixed UTC for everyone</option>
                      <option value="user_local">Each user&apos;s local time</option>
                    </Select>
                  </Field>
                  {state.scheduleMode !== "immediate" ? (
                    <>
                      <Field label="Date" required>
                        <Input
                          type="date"
                          value={state.scheduleDate}
                          onChange={(e) => patch({ scheduleDate: e.target.value })}
                          required
                          disabled={isRunning}
                          className="text-sm"
                        />
                      </Field>
                      <Field label="Time" required>
                        <Input
                          type="time"
                          value={state.scheduleTime}
                          onChange={(e) => patch({ scheduleTime: e.target.value })}
                          required
                          disabled={isRunning}
                          className="text-sm"
                        />
                      </Field>
                    </>
                  ) : null}
                </FormGrid>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Tap action" summary={tapActionSummary(state)}>
              <FormGrid className="gap-3">
                <Field label="Destination" className="sm:col-span-2">
                  <Select
                    value={state.linkType}
                    onChange={(e) => patch({ linkType: e.target.value as AdminBroadcastLinkType })}
                    disabled={isRunning}
                    className="text-sm"
                  >
                    <option value="none">Dashboard (default)</option>
                    <option value="internal">In-app screen</option>
                    <option value="external">External HTTPS link</option>
                  </Select>
                </Field>
                {state.linkType === "internal" ? (
                  <Field label="Screen">
                    <Select
                      value={state.internalScreen}
                      onChange={(e) =>
                        patch({ internalScreen: e.target.value as AdminBroadcastInternalScreen })
                      }
                      disabled={isRunning}
                      className="text-sm"
                    >
                      {ADMIN_BROADCAST_INTERNAL_SCREENS.map((screen) => (
                        <option key={screen} value={screen}>
                          {screen}
                        </option>
                      ))}
                    </Select>
                  </Field>
                ) : null}
                {state.linkType === "external" ? (
                  <Field label="URL" className="sm:col-span-2">
                    <Input
                      type="url"
                      value={state.externalUrl}
                      onChange={(e) => patch({ externalUrl: e.target.value })}
                      placeholder="https://munibtracker.app/…"
                      required
                      disabled={isRunning}
                      className="text-sm"
                    />
                  </Field>
                ) : null}
              </FormGrid>
            </CollapsibleSection>
          </div>
        </WizardPanel>
      ) : null}

      {step === 2 ? (
        <WizardPanel
          title="Review"
          description="Confirm before sending — immediate sends start right away."
        >
          <div className="grid gap-3 lg:grid-cols-[1fr_minmax(280px,320px)] lg:items-start">
            <div className="space-y-3">
              <BroadcastSendSummary
                totalUsers={audienceCount ?? 0}
                title={state.title}
                category={state.category}
                body={state.body}
                subtitle={state.subtitle}
                sendInApp={state.sendInApp}
                sendPush={state.sendPush}
                scheduleMode={state.scheduleMode}
                scheduleDate={state.scheduleDate}
                scheduleTime={state.scheduleTime}
                linkType={state.linkType}
                filters={state.filters}
                activeFilterCount={activeFilterCount}
              />
              {!confirmOpen ? (
                <button
                  type="button"
                  className={buttonClasses("danger", "w-full sm:w-auto", "sm")}
                  disabled={isRunning || audienceCount == null || audienceCount === 0}
                  onClick={() => setConfirmOpen(true)}
                >
                  Send to {formatNumber(audienceCount ?? 0)} users
                </button>
              ) : (
                <div className="rounded-md border border-danger-line bg-danger-bg/30 p-3">
                  <p className="text-xs font-medium text-fg">
                    {state.scheduleMode === "immediate"
                      ? "Start sending now? Delivery begins immediately."
                      : "Schedule this broadcast for the chosen time?"}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className={buttonClasses("secondary", undefined, "xs")}
                      onClick={() => setConfirmOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={buttonClasses("danger", undefined, "xs")}
                      disabled={isRunning}
                      onClick={handleSend}
                    >
                      {isRunning ? "Sending…" : "Confirm send"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <BroadcastNotificationPreview
              compact
              title={state.title}
              subtitle={state.subtitle}
              body={state.body}
            />
          </div>
        </WizardPanel>
      ) : null}

      <WizardFooter>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {step > 0 ? (
              <button
                type="button"
                className={buttonClasses("ghost", undefined, "sm")}
                onClick={goBack}
                disabled={isRunning}
              >
                Back
              </button>
            ) : (
              <Link
                href="/notifications/broadcasts"
                className={buttonClasses("ghost", undefined, "sm")}
              >
                Cancel
              </Link>
            )}
          </div>
          {step < WIZARD_STEPS.length - 1 ? (
            <button
              type="button"
              className={buttonClasses("primary", undefined, "sm")}
              onClick={() => void goNext()}
              disabled={isRunning}
            >
              Continue
            </button>
          ) : null}
        </div>
      </WizardFooter>
    </div>
  );
}
