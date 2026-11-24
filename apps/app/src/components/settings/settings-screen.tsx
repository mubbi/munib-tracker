import { type Href, Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { type ReactNode, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { ScrollViewInstance } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";
import { goBackOrReplace } from "@/lib/navigation";
import { getSettingsGroup, isGroupAvailable } from "@/lib/settings/groups";
import { getPlatformCtx } from "@/lib/settings/platform";
import { getSetting } from "@/lib/settings/registry";
import { type SettingsGroupId, settingsGroupPath } from "@/lib/settings/routes";

import { SettingsGroupBody } from "./settings-group-body";
import { useSettingsFormMaxWidth } from "./settings-layout";

/**
 * A settings group route (§4.5.5): ScreenLayout + form max width + Back to the
 * hub + availability gate (TV / web never land on an empty state — they bounce
 * to the hub) + `?focus=<settingId>` scroll-and-pulse.
 */
export function SettingsScreen({ group }: { group: SettingsGroupId }) {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ focus?: string }>();
  const formMaxWidth = useSettingsFormMaxWidth();
  const meta = getSettingsGroup(group);
  const ctx = useMemo(getPlatformCtx, []);
  const scrollRef = useRef<ScrollViewInstance | null>(null);

  const focus = typeof params.focus === "string" ? params.focus : null;
  const focusId = focus && getSetting(focus)?.group === group ? focus : null;
  const { register, onScroll } = useScrollToActive(scrollRef, focusId);

  if (!isGroupAvailable(meta, ctx)) return <Redirect href="/settings" />;

  return (
    <ScreenLayout
      maxContentWidth={formMaxWidth}
      eyebrow={t("settings.title")}
      title={t(meta.titleKey)}
      subtitle={t(meta.subtitleKey)}
      onBack={() => goBackOrReplace(router, "/settings")}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path={settingsGroupPath(group)} />
      <SettingsGroupBody group={group} focusId={focusId} register={register} />
    </ScreenLayout>
  );
}

/**
 * A settings detail route (a rich editor a group row links to — app lock,
 * backup, home layout, practice…): the same chrome as `SettingsScreen` —
 * "Settings" eyebrow, form max width, Back to the parent group — plus the
 * availability gate: when the editor can't work on this device (TV, web) the
 * route bounces to its group instead of showing an empty state (§4.5.10).
 */
export function SettingsDetailScreen({
  parent,
  path,
  title,
  subtitle,
  seoTitle,
  available = true,
  wide = false,
  backTo,
  children,
}: {
  /** Group the editor belongs to (Back and the availability redirect go there). */
  parent: SettingsGroupId;
  /** Route path for `<Seo>` (`/settings/app-lock`). */
  path: string;
  title: string;
  subtitle?: string;
  seoTitle?: string;
  /** False on platforms where the editor can't work (redirects to `parent`). */
  available?: boolean;
  /** Card-heavy editors that lay out their own columns skip the form width cap. */
  wide?: boolean;
  /** Back target when the editor was opened from outside Settings. */
  backTo?: Href;
  children?: ReactNode;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const formMaxWidth = useSettingsFormMaxWidth();
  const parentPath = settingsGroupPath(parent) as Href;

  if (!available) return <Redirect href={parentPath} />;

  return (
    <ScreenLayout
      maxContentWidth={wide ? undefined : formMaxWidth}
      eyebrow={t("settings.title")}
      title={title}
      {...(subtitle ? { subtitle } : {})}
      onBack={() => goBackOrReplace(router, backTo ?? parentPath)}
    >
      <Seo path={path} {...(seoTitle ? { title: seoTitle } : {})} />
      {children}
    </ScreenLayout>
  );
}
