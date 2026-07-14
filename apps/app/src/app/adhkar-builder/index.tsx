import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
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
import { Sheet } from "@/components/ui/sheet";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { resolveArabicLineHeight } from "@/lib/reading-typography";
import { arabicTextAlign, useIsRTL } from "@/lib/rtl";
import type { SttErrorKind } from "@/lib/stt";
import { deleteUserMediaMany, isGuestUserMediaError, uploadUserMedia } from "@/lib/user-media-api";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import {
  type CustomAdhkar,
  type CustomAdhkarInput,
  useCustomAdhkarActions,
  useCustomAdhkarList,
  useEnsureCustomAdhkarLoaded,
} from "@/stores/custom-adhkar-store";
import { usePreferences } from "@/stores/preferences-store";

const EMPTY: CustomAdhkarInput = { title: "", arabic: "" };

type DictatableField = "arabic" | "transliteration" | "translation";

const DICTATABLE_FIELDS = new Set<string>(["arabic", "transliteration", "translation"]);

export default function AdhkarBuilderScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs } = usePreferences();
  const arabicFontFamily = useArabicFontFamily();
  const arabicInputLineHeight = resolveArabicLineHeight(20, fontPrefs.arabic.family);
  const rtl = useIsRTL();
  const { isAuthenticated, session } = useAuth();
  const toast = useToast();
  useEnsureCustomAdhkarLoaded();
  const items = useCustomAdhkarList();
  const { create, update, remove } = useCustomAdhkarActions();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CustomAdhkar | null>(null);
  const [draft, setDraft] = useState<CustomAdhkarInput>(EMPTY);
  const [draftAttachments, setDraftAttachments] = useState<DraftAdhkarAttachment[]>([]);
  const [saving, setSaving] = useState(false);
  const sttFieldRef = useRef<DictatableField | null>(null);

  const canSave = draft.title.trim().length > 0 && draft.arabic.trim().length > 0 && !saving;
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
  };

  const openCreate = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (item: CustomAdhkar) => {
    stt.abort();
    setEditingId(item.id);
    setDraft({
      title: item.title,
      arabic: item.arabic,
      transliteration: item.transliteration ?? "",
      translation: item.translation ?? "",
      reference: item.reference ?? "",
    });
    setDraftAttachments([]);
    setFormOpen(true);
  };

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      if (isEditing && editingId) {
        await update(editingId, draft);
      } else if (draftAttachments.length > 0) {
        if (!isAuthenticated || !session?.accessToken) {
          toast.warning(t("customAdhkar.attachments.signInRequired"));
          return;
        }
        const uploaded = await uploadUserMedia(session.accessToken, draftAttachments);
        try {
          await create({
            ...draft,
            images: uploaded.map((item) => ({
              mediaId: item.id,
              mimeType: item.mimeType,
              filename: item.filename,
            })),
          });
        } catch (error) {
          await deleteUserMediaMany(
            session.accessToken,
            uploaded.map((item) => item.id),
          );
          throw error;
        }
      } else {
        await create(draft);
      }

      resetForm();
      setFormOpen(false);
    } catch (error) {
      if (isGuestUserMediaError(error)) {
        toast.warning(t("customAdhkar.attachments.signInRequired"));
      } else {
        toast.error(t("customAdhkar.attachments.uploadFailed"));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (item: CustomAdhkar) => {
    const removed = await remove(item.id);
    const mediaIds =
      removed?.images
        ?.map((image) => image.mediaId)
        .filter((mediaId): mediaId is string => !!mediaId) ?? [];
    if (mediaIds.length > 0 && session?.accessToken) {
      void deleteUserMediaMany(session.accessToken, mediaIds);
    }
  };

  const toggleDictate = (key: DictatableField) => {
    if (stt.listening && stt.activeField === key) {
      stt.stop();
      return;
    }
    sttFieldRef.current = key;
    void stt.start(key, draft[key] ?? "", key === "arabic" ? "arabic" : "other");
  };

  const input = (
    key: keyof Omit<CustomAdhkarInput, "images">,
    labelKey: string,
    opts?: { multiline?: boolean; rtl?: boolean },
  ) => {
    const dictatable = DICTATABLE_FIELDS.has(key);
    const listeningHere = stt.listening && stt.activeField === key;

    return (
      <View style={styles.field}>
        <View style={styles.labelRow}>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.labelText}>
            {t(labelKey)}
          </ThemedText>
          {dictatable && stt.available ? (
            <VoiceInputButton
              listening={!!listeningHere}
              level={stt.level}
              accessibilityLabel={
                listeningHere ? t("customAdhkar.stt.stopDictate") : t("customAdhkar.stt.dictate")
              }
              accessibilityHint={listeningHere ? t("customAdhkar.stt.listening") : undefined}
              disabled={saving}
              onPress={() => toggleDictate(key as DictatableField)}
            />
          ) : null}
        </View>
        <TextInput
          value={draft[key] ?? ""}
          onChangeText={(v) => {
            if (stt.listening && stt.activeField === key) stt.abort();
            setDraft((prev) => ({ ...prev, [key]: v }));
          }}
          placeholder={t(labelKey)}
          placeholderTextColor={colors.mutedForeground}
          accessibilityLabel={t(labelKey)}
          multiline={opts?.multiline}
          style={[
            styles.input,
            opts?.multiline ? styles.inputMultiline : null,
            opts?.rtl
              ? [
                  styles.inputRtl,
                  {
                    fontFamily: arabicFontFamily,
                    lineHeight: arabicInputLineHeight,
                    textAlign: arabicTextAlign(rtl),
                  },
                ]
              : null,
            {
              backgroundColor: colors.muted,
              color: colors.foreground,
              borderWidth: listeningHere ? 1.5 : 0,
              borderColor: listeningHere ? colors.accent : "transparent",
            },
          ]}
        />
      </View>
    );
  };

  return (
    <ScreenLayout
      eyebrow={t("customAdhkar.eyebrow")}
      title={t("customAdhkar.title")}
      subtitle={t("customAdhkar.subtitle")}
      onBack={() => goBackOrReplace(router, "/zikr")}
    >
      <Seo path="/adhkar-builder" />
      <Button
        label={t("customAdhkar.add")}
        icon={{ ios: "plus", android: "add", web: "add" }}
        fullWidth
        onPress={openCreate}
        style={styles.addButton}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={{ ios: "square.and.pencil", android: "edit_note", web: "edit_note" }}
          title={t("customAdhkar.emptyTitle")}
          description={t("customAdhkar.emptyDesc")}
        />
      ) : (
        <Stagger>
          {items.map((item) => (
            <Card key={item.id} padding="four" style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <ThemedText type="smallBold" style={styles.itemTitle} numberOfLines={2}>
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
                  />
                  <IconButton
                    name={{ ios: "trash", android: "delete", web: "delete" }}
                    size={16}
                    tintColor={tokens.status.danger.color}
                    background={tokens.status.danger.soft}
                    accessibilityLabel={t("customAdhkar.delete")}
                    haptic="warning"
                    onPress={() => setPendingDelete(item)}
                  />
                </View>
              </View>
              <View style={[styles.itemDivider, { backgroundColor: tokens.hairline }]} />
              <ReadingCard
                item={{ ...item, translation: item.translation ?? "" }}
                enableTts
                enableContextMenu={false}
                framed={false}
              />
              {item.images?.length ? (
                <CustomAdhkarImageGallery images={item.images} compact />
              ) : null}
            </Card>
          ))}
        </Stagger>
      )}

      <Sheet
        visible={formOpen}
        onClose={() => {
          if (saving) return;
          setFormOpen(false);
          resetForm();
        }}
        variant="bottom"
      >
        <ThemedText type="subtitle" style={styles.sheetTitle}>
          {isEditing ? t("customAdhkar.editTitle") : t("customAdhkar.newTitle")}
        </ThemedText>
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {input("title", "customAdhkar.field.title")}
          {input("arabic", "customAdhkar.field.arabic", { multiline: true, rtl: true })}
          {input("transliteration", "customAdhkar.field.transliteration", { multiline: true })}
          {input("translation", "customAdhkar.field.translation", { multiline: true })}
          {input("reference", "customAdhkar.field.reference")}
          {!isEditing ? (
            <CustomAdhkarAttachments
              attachments={draftAttachments}
              onChange={setDraftAttachments}
              canUpload={isAuthenticated}
            />
          ) : null}
        </ScrollView>
        <Button
          label={saving ? t("customAdhkar.attachments.uploading") : t("common.save")}
          fullWidth
          disabled={!canSave}
          onPress={() => void save()}
          style={styles.saveButton}
        />
      </Sheet>

      <ConfirmDialog
        visible={pendingDelete !== null}
        title={t("customAdhkar.confirmDeleteTitle")}
        message={
          pendingDelete
            ? t("customAdhkar.confirmDeleteMsg", { title: pendingDelete.title })
            : undefined
        }
        confirmLabel={t("common.delete")}
        destructive
        onConfirm={() => {
          if (pendingDelete) void handleRemove(pendingDelete);
        }}
        onClose={() => setPendingDelete(null)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  addButton: { marginBottom: Spacing.three },
  itemCard: {
    gap: Spacing.three,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
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
  field: { gap: Spacing.one, marginBottom: Spacing.three },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 56,
  },
  labelText: { flex: 1, marginEnd: Spacing.two },
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: "top" },
  inputRtl: { writingDirection: "rtl", fontSize: 20 },
  saveButton: { marginTop: Spacing.two },
});
