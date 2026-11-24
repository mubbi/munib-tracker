import type { KhatmUnit } from "@munib-tracker/shared/circles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { NavRow } from "@/components/ui/nav-row";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import type { CircleMember, Khatm, KhatmPart } from "@/lib/circles/api";
import { type KhatmUiAction, partActions } from "@/lib/circles/khatm";

import { assigneeName, khatmPartTitle, khatmStatusLabel } from "./khatm-labels";

type Step = "actions" | "askFirst" | "pick";

const ACTION_LABEL: Record<Exclude<KhatmUiAction, "assign" | "reassignStale">, string> = {
  read: "khatmGroups.action.read",
  claim: "khatmGroups.action.claim",
  reading: "khatmGroups.action.reading",
  complete: "khatmGroups.action.complete",
  release: "khatmGroups.action.release",
};

/**
 * Actions for one part. Reassigning someone else's idle part takes two steps:
 * the manager is first asked to check with the member ("ask the member
 * first", NF-3.18) — the app never takes a part away silently.
 */
export function KhatmPartSheet({
  part,
  unit,
  khatm,
  members,
  myMemberId,
  isManager,
  busy,
  onClose,
  onAction,
  onAssign,
}: {
  part: KhatmPart | null;
  unit: KhatmUnit;
  khatm: Pick<Khatm, "status" | "assignmentMode" | "deadlinePassed">;
  members: readonly CircleMember[] | undefined;
  myMemberId: string;
  isManager: boolean;
  busy: boolean;
  onClose: () => void;
  onAction: (part: KhatmPart, action: Exclude<KhatmUiAction, "assign" | "reassignStale">) => void;
  onAssign: (part: KhatmPart, memberId: string | null) => void;
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("actions");

  const partNo = part?.partNo;
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset the flow whenever another part opens
  useEffect(() => {
    setStep("actions");
  }, [partNo]);

  if (!part)
    return (
      <Sheet visible={false} onClose={onClose} variant="bottom">
        <View />
      </Sheet>
    );

  const actions = partActions(part, { myMemberId, isManager, khatm });
  const who = assigneeName(members, part, t);
  const candidates = (members ?? []).filter((m) => m.memberKind === "user");

  return (
    <Sheet visible onClose={onClose} variant="bottom" solid>
      <View style={styles.body}>
        <ThemedText type="subtitle">{khatmPartTitle(unit, part.partNo, t)}</ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {who
            ? t("khatmGroups.sheet.statusWithName", {
                status: khatmStatusLabel(part.status, t),
                name: who,
              })
            : khatmStatusLabel(part.status, t)}
        </ThemedText>

        {step === "actions" ? (
          <View style={styles.actions}>
            {actions.length === 0 ? (
              <ThemedText type="small" themeColor="mutedForeground">
                {part.status === "done"
                  ? t("khatmGroups.sheet.doneNote")
                  : t("khatmGroups.sheet.noActions")}
              </ThemedText>
            ) : null}
            {actions.map((action) => {
              if (action === "assign") {
                return (
                  <Button
                    key={action}
                    variant="secondary"
                    label={t("khatmGroups.action.assign")}
                    disabled={busy}
                    onPress={() => setStep("pick")}
                  />
                );
              }
              if (action === "reassignStale") {
                return (
                  <Button
                    key={action}
                    variant="secondary"
                    label={t("khatmGroups.action.reassign")}
                    disabled={busy}
                    onPress={() => setStep("askFirst")}
                  />
                );
              }
              return (
                <Button
                  key={action}
                  variant={
                    action === "complete" || action === "claim" || action === "read"
                      ? "primary"
                      : "ghost"
                  }
                  label={t(ACTION_LABEL[action])}
                  disabled={busy}
                  onPress={() => onAction(part, action)}
                />
              );
            })}
            {part.stale && !isManager && part.assigneeMemberId === myMemberId ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("khatmGroups.sheet.staleMine")}
              </ThemedText>
            ) : null}
          </View>
        ) : null}

        {step === "askFirst" ? (
          <View style={styles.actions}>
            <ThemedText type="small">
              {t("khatmGroups.sheet.askFirst", { name: who ?? t("khatmGroups.unnamedMember") })}
            </ThemedText>
            <Button label={t("khatmGroups.sheet.askedThem")} onPress={() => setStep("pick")} />
            <Button variant="ghost" label={t("khatmGroups.sheet.notYet")} onPress={onClose} />
          </View>
        ) : null}

        {step === "pick" ? (
          <View style={styles.actions}>
            <ThemedText type="smallBold">{t("khatmGroups.sheet.pickTitle")}</ThemedText>
            {candidates.map((m) => (
              <NavRow
                key={m.memberId}
                icon={{ ios: "person.fill", android: "person", web: "person" }}
                label={
                  m.isMe ? t("khatmGroups.you") : (m.displayName ?? t("khatmGroups.unnamedMember"))
                }
                onPress={() => onAssign(part, m.memberId)}
              />
            ))}
            {part.status !== "open" ? (
              <Button
                variant="ghost"
                label={t("khatmGroups.sheet.returnToPool")}
                disabled={busy}
                onPress={() => onAssign(part, null)}
              />
            ) : null}
          </View>
        ) : null}

        <Button variant="ghost" label={t("common.cancel")} onPress={onClose} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, padding: Spacing.three },
  actions: { gap: Spacing.two },
});
