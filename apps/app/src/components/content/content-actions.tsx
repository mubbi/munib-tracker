import { type ComponentProps, type ComponentRef, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PlayButton } from "@/components/content/play-button";
import { ThemedText } from "@/components/themed-text";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/context-menu";
import { IconButton } from "@/components/ui/icon-button";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

/** The fixed action order on every scripture item — never reorder per screen. */
export const CONTENT_ACTION_ORDER = ["play", "save", "share", "more"] as const;

type ContentActionsProps = {
  /** Omit when the item has no audio. */
  play?: { trackId: string; onPlay: () => void; accessibilityLabel?: string };
  /** Omit when the item cannot be saved. */
  save?: { saved: boolean; onToggle: () => void };
  /** Omit on TV / when sharing is unavailable. */
  share?: {
    onShare: () => void;
    loading?: boolean;
    accessibilityLabel?: string;
    /** Visible caption in `labelled` rows (e.g. "Tap to share" after a web gesture timeout). */
    label?: string;
    /** Caption while `loading` in `labelled` rows. */
    loadingLabel?: string;
  };
  /** Everything else (copy, report, tafsir…) — rendered in the "More actions" sheet. */
  more?: { actions: ContextMenuAction[]; onAction: (id: string) => void };
  /** TV: first control takes initial D-pad focus. */
  preferredFocus?: boolean;
  /**
   * Captions under each glyph (Play · Save/Saved · Share · More) — reading cards
   * and hadith rows, where icon-only actions were unclear. Same order and rules.
   */
  labelled?: boolean;
};

const SAVED_ICON = { ios: "bookmark.fill", android: "bookmark", web: "bookmark" } as const;
const SAVE_ICON = { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" } as const;
const SHARE_ICON = { ios: "square.and.arrow.up", android: "share", web: "share" } as const;
const MORE_ICON = { ios: "ellipsis.circle", android: "more_horiz", web: "more_horiz" } as const;

/**
 * The one action row for scripture items: **Play · Save · Share · More**.
 * Saved state is a filled bookmark in `accentText` (never a status colour).
 * "More" opens the same actions as the long-press `ContextMenu`.
 */
export function ContentActions({
  play,
  save,
  share,
  more,
  preferredFocus,
  labelled,
}: ContentActionsProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const tv = isTV();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreButtonRef = useRef<ComponentRef<typeof View>>(null);
  const moreActions = more?.actions ?? [];

  const saveLabel = save?.saved ? t("common.saved") : t("common.save");

  const row = labelled ? (
    <View style={[styles.row, styles.labelledRow]}>
      {play ? (
        <PlayButton
          labelled
          trackId={play.trackId}
          onPlay={play.onPlay}
          accessibilityLabel={play.accessibilityLabel}
          preferredFocus={preferredFocus}
        />
      ) : null}
      {save ? (
        <LabeledIconButton
          name={save.saved ? SAVED_ICON : SAVE_ICON}
          label={saveLabel}
          tintColor={save.saved ? colors.accentText : colors.mutedForeground}
          labelColor={save.saved ? colors.accentText : undefined}
          accessibilityLabel={saveLabel}
          accessibilityState={{ selected: save.saved }}
          haptic="selection"
          preferredFocus={preferredFocus && !play}
          onPress={save.onToggle}
        />
      ) : null}
      {share && !tv ? (
        <LabeledIconButton
          name={SHARE_ICON}
          label={share.label ?? t("common.share")}
          tintColor={colors.mutedForeground}
          accessibilityLabel={share.accessibilityLabel ?? t("common.share")}
          loading={share.loading}
          loadingLabel={share.loadingLabel}
          onPress={share.onShare}
        />
      ) : null}
      {moreActions.length > 0 ? (
        <LabeledIconButton
          name={MORE_ICON}
          label={t("common.more")}
          tintColor={colors.mutedForeground}
          accessibilityLabel={t("common.moreActions")}
          onPress={() => setMoreOpen(true)}
        />
      ) : null}
    </View>
  ) : (
    <View style={styles.row}>
      {play ? (
        <PlayButton
          trackId={play.trackId}
          onPlay={play.onPlay}
          accessibilityLabel={play.accessibilityLabel}
          preferredFocus={preferredFocus}
        />
      ) : null}
      {save ? (
        <IconButton
          name={save.saved ? SAVED_ICON : SAVE_ICON}
          size={20}
          tintColor={save.saved ? colors.accentText : colors.mutedForeground}
          accessibilityLabel={saveLabel}
          accessibilityState={{ selected: save.saved }}
          haptic="selection"
          preferredFocus={preferredFocus && !play}
          onPress={save.onToggle}
        />
      ) : null}
      {share && !tv ? (
        <IconButton
          name={SHARE_ICON}
          size={20}
          tintColor={colors.mutedForeground}
          accessibilityLabel={share.accessibilityLabel ?? t("common.share")}
          loading={share.loading}
          onPress={share.onShare}
        />
      ) : null}
      {moreActions.length > 0 ? (
        <IconButton
          ref={moreButtonRef}
          name={MORE_ICON}
          size={20}
          tintColor={colors.mutedForeground}
          accessibilityLabel={t("common.moreActions")}
          onPress={() => setMoreOpen(true)}
        />
      ) : null}
    </View>
  );

  return (
    <>
      {moreActions.length > 0 && more ? (
        <ContextMenu actions={moreActions} onAction={more.onAction} trigger="never">
          {row}
        </ContextMenu>
      ) : (
        row
      )}
      {moreActions.length > 0 && more ? (
        <Sheet
          visible={moreOpen}
          onClose={() => setMoreOpen(false)}
          // RN TV hosts expose focus(); the public View type omits it.
          // Labelled rows have no ref-able trigger: the Sheet falls back to the
          // opener it captured (web) / TV focus memory.
          returnFocusRef={
            labelled
              ? undefined
              : (moreButtonRef as unknown as ComponentProps<typeof Sheet>["returnFocusRef"])
          }
          variant="bottom"
          title={t("common.moreActions")}
          solid
        >
          <View style={styles.list}>
            {moreActions.map((action) => (
              <PressableScale
                key={action.id}
                role="button"
                accessibilityLabel={action.title}
                accessibilityState={{ disabled: Boolean(action.disabled) }}
                disabled={action.disabled}
                haptic="selection"
                onPress={() => {
                  setMoreOpen(false);
                  more.onAction(action.id);
                }}
                style={styles.item}
              >
                <ThemedText weight="medium">{action.title}</ThemedText>
              </PressableScale>
            ))}
          </View>
        </Sheet>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  labelledRow: { alignItems: "flex-start", flexWrap: "wrap" },
  list: { gap: Spacing.one },
  item: { minHeight: 48, justifyContent: "center", paddingHorizontal: Spacing.two },
});
