import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, type TextInputInstance, useWindowDimensions, View } from "react-native";
import { apiAuthHeaders } from "@/api/auth-options";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ReadingCard } from "@/components/content/reading-card";
import {
  CustomAdhkarAttachments,
  type DraftAdhkarAttachment,
} from "@/components/custom-adhkar/custom-adhkar-attachments";
import { CustomAdhkarImageGallery } from "@/components/custom-adhkar/custom-adhkar-image-gallery";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { VoiceInputButton } from "@/components/stt/voice-input-button";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { SearchField } from "@/components/ui/search-field";
import { Sheet } from "@/components/ui/sheet";
import { Stagger } from "@/components/ui/stagger";
import { TextField } from "@/components/ui/text-field";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { Breakpoints, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { TASBEEH_ICON } from "@/lib/quick-actions";
import { resolveArabicLineHeight } from "@/lib/reading-typography";
import { arabicTextAlign, useIsRTL } from "@/lib/rtl";
import { createCustomAdhkarSearch } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import type { SttErrorKind } from "@/lib/stt";
import {
  customAdhkarMediaIds,
  deleteUserMediaMany,
  isGuestUserMediaError,
  purgeCustomAdhkarAttachments,
  uploadUserMedia,
  userMediaContentUrl,
} from "@/lib/user-media-api";
import { useAuth } from "@/providers/auth-provider";
import { TOAST_ACTION_DURATION_MS, useToast } from "@/providers/toast-provider";
import {
  type CustomAdhkar,
  type CustomAdhkarImage,
  type CustomAdhkarInput,
  useCustomAdhkarActions,
  useCustomAdhkarList,
  useEnsureCustomAdhkarLoaded,
} from "@/stores/custom-adhkar-store";
import { usePreferences } from "@/stores/preferences-store";

const EMPTY: CustomAdhkarInput = { title: "", arabic: "" };

type DictatableField = "arabic" | "transliteration" | "translation";

const DICTATABLE_FIELDS = new Set<string>(["arabic", "transliteration", "translation"]);

type FieldKey = keyof Omit<CustomAdhkarInput, "images">;
/** Single-line fields chain with the return key: title → reference → save. */
const FIELD_ORDER: FieldKey[] = ["title", "arabic", "transliteration", "translation", "reference"];

/** Stable fingerprint of the editable form — equal fingerprints mean "nothing to lose". */
function formFingerprint(draft: CustomAdhkarInput, attachments: DraftAdhkarAttachment[]): string {
  return JSON.stringify([
    draft.title,
    draft.arabic ?? "",
    draft.transliteration ?? "",
    draft.translation ?? "",
    draft.reference ?? "",
    attachments.map((item) => item.mediaId ?? item.uri),
  ]);
}

export default function AdhkarBuilderScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const undoToast = useUndoToast();
  const { fontPrefs } = usePreferences();
  const arabicFontFamily = useArabicFontFamily();
  const arabicInputLineHeight = resolveArabicLineHeight(20, fontPrefs.arabic.family);
  const rtl = useIsRTL();
  const tv = isTV();
  const { width: windowWidth } = useWindowDimensions();
  // Wide web / tablets: list beside an inline editor + live preview (no sheet).
  const wide = !tv && windowWidth >= Breakpoints.wide;
  const { isAuthenticated, session } = useAuth();
  const toast = useToast();
  useEnsureCustomAdhkarLoaded();
  const items = useCustomAdhkarList();
  const { create, update, remove, restore } = useCustomAdhkarActions();

  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Unsaved edits (dictated Arabic, attachments) are never dropped silently (B-56).
  const [baseline, setBaseline] = useState(() => formFingerprint(EMPTY, []));
  const [discardAction, setDiscardAction] = useState<(() => void) | null>(null);
  // Delete asks first (destructive), then keeps the Undo toast as a safety net.
  const [pendingDelete, setPendingDelete] = useState<CustomAdhkar | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fieldRefs = useRef<Partial<Record<FieldKey, TextInputInstance | null>>>({});
  // Attachment purges wait out the Undo window so "Deleted" can really be undone.
  const purgeTimers = useRef(
    new Map<string, { timer: ReturnType<typeof setTimeout>; run: () => void }>(),
  );
  // Entries whose server attachments were already purged (Undo can no longer bring them back).
  const purgedIds = useRef(new Set<string>());
  const [draft, setDraft] = useState<CustomAdhkarInput>(EMPTY);
  const [draftAttachments, setDraftAttachments] = useState<DraftAdhkarAttachment[]>([]);
  const [saving, setSaving] = useState(false);
  const sttFieldRef = useRef<DictatableField | null>(null);

  const searchIndex = useMemo(() => createCustomAdhkarSearch(items), [items]);
  const searching = query.trim().length > 0;
  const visibleItems = searching ? searchIndex.search(query) : items;
  /** Stable 1-based list numbers from the full library order (not search rank). */
  const numberById = useMemo(
    () => new Map(items.map((item, index) => [item.id, index + 1])),
    [items],
  );

  const dirty = formFingerprint(draft, draftAttachments) !== baseline;
  const titleError =
    submitted && draft.title.trim().length === 0 ? t("customAdhkar.titleRequired") : undefined;
  const canSave = !saving;
  const isEditing = editingId !== null;

  const handleSttError = useCallback(
    (kind: SttErrorKind) => {
      switch (kind) {
        case "permission":
          toast.warning(t("customAdhkar.stt.permissionDenied"));
          break;
        case "noSpeech":
          toast.info(t("customAdhkar.stt.couldNotHear"));
          break;
        case "unavailable":
          toast.warning(t("customAdhkar.stt.unavailable"));
          break;
        default:
          toast.error(t("customAdhkar.stt.errorGeneric"));
      }
    },
    [t, toast],
  );

  const handleTranscript = useCallback((text: string) => {
    const field = sttFieldRef.current;
    if (!field) return;
    setDraft((prev) => ({ ...prev, [field]: text }));
  }, []);

  const stt = useSpeechToText({
    uiLocale: i18n.language ?? "en",
    onTranscript: handleTranscript,
    onError: handleSttError,
  });

  useEffect(() => {
    sttFieldRef.current = (stt.activeField as DictatableField | null) ?? null;
  }, [stt.activeField]);

  useEffect(() => {
    if (!formOpen) stt.abort();
  }, [formOpen, stt.abort]);

  const resetForm = () => {
    stt.abort();
    setDraft(EMPTY);
    setDraftAttachments([]);
    setEditingId(null);
    setSubmitted(false);
    setBaseline(formFingerprint(EMPTY, []));
  };

  /** Runs the action now, or after the user confirms discarding unsaved edits. */
  const guardDiscard = (action: () => void) => {
    if (dirty && !saving) setDiscardAction(() => action);
    else action();
  };

  const closeForm = () => {
    setFormOpen(false);
    resetForm();
  };

  const openCreate = () => {
    guardDiscard(() => {
      resetForm();
      setFormOpen(true);
    });
  };

  const openEdit = (item: CustomAdhkar) => {
    guardDiscard(() => startEdit(item));
  };

  const startEdit = (item: CustomAdhkar) => {
    stt.abort();
    setEditingId(item.id);
    setSubmitted(false);
    const nextDraft: CustomAdhkarInput = {
      title: item.title,
      arabic: item.arabic,
      transliteration: item.transliteration ?? "",
      translation: item.translation ?? "",
      reference: item.reference ?? "",
    };
    setDraft(nextDraft);
    const authHeaders = apiAuthHeaders(session?.accessToken);
    const nextAttachments = (item.images ?? [])
      .map((image, index): DraftAdhkarAttachment | null => {
        if (image.mediaId) {
          return {
            uri: userMediaContentUrl(image.mediaId),
            mimeType: image.mimeType || "image/jpeg",
            filename: image.filename ?? `attachment-${index + 1}`,
            mediaId: image.mediaId,
            headers: authHeaders,
          };
        }
        if (image.localUri) {
          return {
            uri: image.localUri,
            mimeType: image.mimeType || "image/jpeg",
            filename: image.filename ?? `attachment-${index + 1}`,
          };
        }
        return null;
      })
      .filter((row): row is DraftAdhkarAttachment => row !== null);
    setDraftAttachments(nextAttachments);
    setBaseline(formFingerprint(nextDraft, nextAttachments));
    setFormOpen(true);
  };

  const save = async () => {
    if (!canSave) return;
    setSubmitted(true);
    if (draft.title.trim().length === 0) {
      fieldRefs.current.title?.focus();
      return;
    }
    setSaving(true);

    const existingKept = draftAttachments.filter((item) => Boolean(item.mediaId));
    const toUpload = draftAttachments.filter((item) => !item.mediaId);

    try {
      if (toUpload.length > 0 && (!isAuthenticated || !session?.accessToken)) {
        toast.warning(t("customAdhkar.attachments.signInRequired"));
        return;
      }

      const uploaded =
        toUpload.length > 0 && session?.accessToken
          ? await uploadUserMedia(session.accessToken, toUpload)
          : [];

      const nextImages: CustomAdhkarImage[] = [
        ...existingKept.map((item) => ({
          mediaId: item.mediaId,
          mimeType: item.mimeType,
          filename: item.filename,
        })),
        ...uploaded.map((item) => ({
          mediaId: item.id,
          mimeType: item.mimeType,
          filename: item.filename,
        })),
      ];

      try {
        if (isEditing && editingId) {
          const previous = items.find((item) => item.id === editingId);
          const previousIds = new Set(customAdhkarMediaIds(previous?.images));
          const nextIds = new Set(customAdhkarMediaIds(nextImages));
          const removedIds = [...previousIds].filter((id) => !nextIds.has(id));

          await update(editingId, { ...draft, images: nextImages });
          if (removedIds.length > 0) {
            await deleteUserMediaMany(session?.accessToken, removedIds);
          }
        } else if (nextImages.length > 0) {
          await create({ ...draft, images: nextImages });
        } else {
          await create(draft);
        }
      } catch (error) {
        if (uploaded.length > 0 && session?.accessToken) {
          await deleteUserMediaMany(
            session.accessToken,
            uploaded.map((item) => item.id),
          );
        }
        throw error;
      }

      closeForm();
    } catch (error) {
      if (isGuestUserMediaError(error)) {
        toast.warning(t("customAdhkar.attachments.signInRequired"));
      } else if (toUpload.length > 0) {
        toast.error(t("customAdhkar.attachments.uploadFailed"));
      } else {
        toast.error(t("customAdhkar.saveFailed"));
      }
    } finally {
      setSaving(false);
    }
  };

  const schedulePurge = (item: CustomAdhkar) => {
    const accessToken = session?.accessToken;
    const run = () => {
      purgeTimers.current.delete(item.id);
      purgedIds.current.add(item.id);
      // Background purge: a failure must not resurrect the row — tell the user instead.
      purgeCustomAdhkarAttachments(accessToken, item.images).catch(() => {
        toast.error(t("customAdhkar.purgeFailed"));
      });
    };
    const timer = setTimeout(run, TOAST_ACTION_DURATION_MS + 500);
    purgeTimers.current.set(item.id, { timer, run });
  };

  // Delete asks for confirmation first; the delete itself is optimistic.
  const handleRemove = (item: CustomAdhkar) => setPendingDelete(item);

  // Optimistic delete: the row goes at once, "Deleted" offers Undo, and the
  // attachment purge runs in the background once the Undo window has closed.
  const performRemove = (item: CustomAdhkar) => {
    if (editingId === item.id) closeForm();
    void undoToast.run({
      do: async () => {
        await remove(item.id);
        schedulePurge(item);
      },
      undo: async () => {
        const pending = purgeTimers.current.get(item.id);
        if (pending) clearTimeout(pending.timer);
        purgeTimers.current.delete(item.id);
        // Same id back; attachments only if their server copies were not purged yet.
        const purged = purgedIds.current.delete(item.id);
        await restore(
          purged ? { ...item, images: item.images?.filter((image) => !image.mediaId) } : item,
        );
      },
      messageKey: "customAdhkar.deletedToast",
      messageOptions: { title: item.title },
    });
  };

  // Leaving the screen: finish any purge still waiting out its Undo window.
  useEffect(() => {
    const timers = purgeTimers.current;
    return () => {
      for (const pending of [...timers.values()]) {
        clearTimeout(pending.timer);
        pending.run();
      }
    };
  }, []);

  const toggleDictate = (key: DictatableField) => {
    if (stt.listening && stt.activeField === key) {
      stt.stop();
      return;
    }
    sttFieldRef.current = key;
    void stt.start(key, draft[key] ?? "", key === "arabic" ? "arabic" : "other");
  };

  const focusNext = (key: FieldKey) => {
    const next = FIELD_ORDER[FIELD_ORDER.indexOf(key) + 1];
    if (next) fieldRefs.current[next]?.focus();
    else void save();
  };

  const input = (
    key: FieldKey,
    labelKey: string,
    opts?: { multiline?: boolean; rtl?: boolean; required?: boolean },
  ) => {
    const dictatable = DICTATABLE_FIELDS.has(key);
    const listeningHere = stt.listening && stt.activeField === key;

    return (
      <TextField
        ref={(node) => {
          fieldRefs.current[key] = node;
        }}
        label={t(labelKey)}
        required={opts?.required}
        optional={!opts?.required}
        error={key === "title" ? titleError : undefined}
        value={draft[key] ?? ""}
        onChangeText={(v) => {
          if (stt.listening && stt.activeField === key) stt.abort();
          setDraft((prev) => ({ ...prev, [key]: v }));
        }}
        multiline={opts?.multiline}
        returnKeyType={
          opts?.multiline
            ? "default"
            : FIELD_ORDER.indexOf(key) === FIELD_ORDER.length - 1
              ? "done"
              : "next"
        }
        onSubmitEditing={opts?.multiline ? undefined : () => focusNext(key)}
        blurOnSubmit={!opts?.multiline && FIELD_ORDER.indexOf(key) === FIELD_ORDER.length - 1}
        style={styles.field}
        inputStyle={
          opts?.rtl
            ? [
                styles.inputRtl,
                {
                  fontFamily: arabicFontFamily,
                  lineHeight: arabicInputLineHeight,
                  textAlign: arabicTextAlign(rtl),
                },
              ]
            : undefined
        }
        trailing={
          dictatable && stt.available ? (
            <VoiceInputButton
              listening={!!listeningHere}
              level={stt.level}
              accessibilityLabel={
                listeningHere ? t("customAdhkar.stt.stopDictate") : t("customAdhkar.stt.dictate")
              }
              accessibilityHint={listeningHere ? t("customAdhkar.stt.listening") : undefined}
              disabled={saving}
              onPress={() => toggleDictate(key as DictatableField)}
              size="sm"
            />
          ) : undefined
        }
      />
    );
  };

  const formFields = (
    <>
      {input("title", "customAdhkar.field.title", { required: true })}
      {input("arabic", "customAdhkar.field.arabic", { multiline: true, rtl: true })}
      {input("transliteration", "customAdhkar.field.transliteration", { multiline: true })}
      {input("translation", "customAdhkar.field.translation", { multiline: true })}
      {input("reference", "customAdhkar.field.reference")}
      <CustomAdhkarAttachments
        attachments={draftAttachments}
        onChange={setDraftAttachments}
        canUpload={isAuthenticated}
      />
    </>
  );

  const saveButton = (
    <Button
      label={saving ? t("customAdhkar.attachments.uploading") : t("common.save")}
      fullWidth
      disabled={!canSave}
      onPress={() => void save()}
      style={styles.saveButton}
    />
  );

  const hasPreview = Boolean(
    draft.arabic?.trim() ||
      draft.transliteration?.trim() ||
      draft.translation?.trim() ||
      draft.reference?.trim(),
  );

  // Wide web: the editor is always on screen — a fresh draft, or the row being edited.
  const editorPanel = (
    <View style={styles.editorStack}>
      <Card padding="four">
        <ThemedText type="subtitle" style={styles.sheetTitle}>
          {isEditing ? t("customAdhkar.editTitle") : t("customAdhkar.newTitle")}
        </ThemedText>
        {formFields}
        {saveButton}
        {isEditing || dirty ? (
          <Button
            label={t("common.cancel")}
            variant="ghost"
            fullWidth
            disabled={saving}
            onPress={() => guardDiscard(resetForm)}
            style={styles.saveButton}
          />
        ) : null}
      </Card>
      {hasPreview ? (
        <Card padding="four">
          {draft.title.trim() ? (
            <ThemedText type="smallBold" style={styles.previewTitle}>
              {draft.title}
            </ThemedText>
          ) : null}
          <ReadingCard
            item={{ ...draft, arabic: draft.arabic ?? "", translation: draft.translation ?? "" }}
            enableContextMenu={false}
            framed={false}
          />
        </Card>
      ) : null}
    </View>
  );

  const listSection = (
    <>
      <Button
        label={t("customAdhkar.add")}
        icon={{ ios: "plus", android: "add", web: "add" }}
        fullWidth
        onPress={openCreate}
        style={styles.addButton}
      />
      {/* TV: toasts take no focus — Undo of a delete lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} preferredFocus style={styles.addButton} />

      {items.length > 0 ? (
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder={t("customAdhkar.searchPlaceholder")}
          style={styles.searchCard}
        />
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          icon={{ ios: "square.and.pencil", android: "edit_note", web: "edit_note" }}
          title={t("customAdhkar.emptyTitle")}
          description={t("customAdhkar.emptyDesc")}
        />
      ) : visibleItems.length === 0 ? (
        <EmptyState
          icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
          title={t("customAdhkar.noResults")}
        />
      ) : (
        <Stagger>
          {visibleItems.map((item) => {
            const listNumber = numberById.get(item.id) ?? 0;
            return (
              <Card key={item.id} padding="four" style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View
                    style={[styles.number, { backgroundColor: tokens.accentSoft }]}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                  >
                    <ThemedText type="caption" style={{ color: colors.accentText }}>
                      {listNumber}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="smallBold"
                    style={styles.itemTitle}
                    numberOfLines={2}
                    accessibilityLabel={t("customAdhkar.itemNumberLabel", {
                      number: listNumber,
                      title: item.title,
                    })}
                  >
                    {item.title}
                  </ThemedText>
                  <View style={styles.itemActions}>
                    <IconButton
                      name={{ ios: "pencil", android: "edit", web: "edit" }}
                      size={16}
                      tintColor={colors.mutedForeground}
                      background={tokens.accentSoft}
                      accessibilityLabel={t("common.edit")}
                      onPress={() => openEdit(item)}
                      hitTarget={tv ? TvLayout.minFocusTargetDp : undefined}
                    />
                    <IconButton
                      name={{ ios: "trash", android: "delete", web: "delete" }}
                      size={16}
                      tintColor={tokens.status.danger.color}
                      background={tokens.status.danger.soft}
                      accessibilityLabel={t("customAdhkar.delete")}
                      haptic="warning"
                      onPress={() => handleRemove(item)}
                      hitTarget={tv ? TvLayout.minFocusTargetDp : undefined}
                    />
                  </View>
                </View>
                {item.arabic.trim() ||
                item.transliteration?.trim() ||
                item.translation?.trim() ||
                item.reference?.trim() ? (
                  <>
                    <View style={[styles.itemDivider, { backgroundColor: tokens.hairline }]} />
                    <ReadingCard
                      item={{ ...item, translation: item.translation ?? "" }}
                      enableTts
                      enableContextMenu={false}
                      framed={false}
                    />
                  </>
                ) : null}
                {item.images?.length ? (
                  <CustomAdhkarImageGallery images={item.images} compact />
                ) : null}
                <Button
                  label={t("handsFreeZikr2.builder.countThis")}
                  icon={TASBEEH_ICON}
                  variant="ghost"
                  size="sm"
                  accessibilityHint={t("handsFreeZikr2.builder.countThisHint", {
                    title: item.title,
                  })}
                  onPress={() =>
                    router.push({ pathname: "/tasbeeh/adhkar/[id]", params: { id: item.id } })
                  }
                  style={styles.countThis}
                />
              </Card>
            );
          })}
        </Stagger>
      )}
    </>
  );

  const sheetOpen = formOpen && !wide;
  const discardDialog = (
    <ConfirmDialog
      visible={discardAction !== null}
      title={t("common.discardTitle")}
      message={t("common.discardMessage")}
      confirmLabel={t("common.discard")}
      cancelLabel={t("common.keepEditing")}
      destructive
      onConfirm={() => {
        const action = discardAction;
        setDiscardAction(null);
        action?.();
      }}
      onClose={() => setDiscardAction(null)}
    />
  );

  return (
    <ScreenLayout
      eyebrow={t("customAdhkar.eyebrow")}
      title={t("customAdhkar.title")}
      subtitle={t("customAdhkar.subtitle")}
      onBack={() => goBackOrReplace(router, "/zikr")}
    >
      <Seo path="/adhkar-builder" />
      {wide ? (
        <View style={styles.wideRoot}>
          <View style={styles.wideList}>{listSection}</View>
          <View style={styles.wideEditor}>{editorPanel}</View>
        </View>
      ) : (
        listSection
      )}

      <Sheet
        visible={sheetOpen}
        onClose={() => {
          if (saving) return;
          guardDiscard(closeForm);
        }}
        variant="bottom"
        title={isEditing ? t("customAdhkar.editTitle") : t("customAdhkar.newTitle")}
        // Own scroller below — nested Sheet scroll fights Android touch / Save.
        scrollable={false}
        solid
      >
        <TvScrollView
          style={styles.form}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {formFields}
        </TvScrollView>
        {saveButton}
        <Button
          label={t("common.cancel")}
          variant="ghost"
          fullWidth
          disabled={saving}
          onPress={() => guardDiscard(closeForm)}
        />
        {/* iOS can't present a second modal over a presented sheet — nest it inside. */}
        {sheetOpen ? discardDialog : null}
      </Sheet>

      {/* Wide layout has no sheet: the discard dialog stands on its own. */}
      {sheetOpen ? null : discardDialog}

      <ConfirmDialog
        visible={pendingDelete !== null}
        title={t("customAdhkar.confirmDeleteTitle")}
        message={t("customAdhkar.confirmDeleteMsg", { title: pendingDelete?.title ?? "" })}
        confirmLabel={t("customAdhkar.delete")}
        cancelLabel={t("common.cancel")}
        destructive
        onConfirm={() => {
          const item = pendingDelete;
          setPendingDelete(null);
          if (item) performRemove(item);
        }}
        onClose={() => setPendingDelete(null)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  countThis: { alignSelf: "flex-start", marginTop: Spacing.two },
  wideRoot: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  wideList: { flex: 1, minWidth: 0 },
  wideEditor: { width: 460, flexShrink: 0 },
  editorStack: { gap: Spacing.three },
  previewTitle: { marginBottom: Spacing.two },
  addButton: { marginBottom: Spacing.three },
  searchCard: { marginBottom: Spacing.three },
  itemCard: {
    gap: Spacing.three,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  number: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: { flex: 1, minWidth: 0 },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  itemDivider: { height: StyleSheet.hairlineWidth },
  sheetTitle: { marginBottom: Spacing.two },
  form: { alignSelf: "stretch", maxHeight: 420 },
  field: { marginBottom: Spacing.three },
  inputRtl: { writingDirection: "rtl", fontSize: 20 },
  saveButton: { marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/adhkar-builder");
