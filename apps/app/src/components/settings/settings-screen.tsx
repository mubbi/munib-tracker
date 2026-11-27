import { type Href, Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { type ReactNode, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { ScrollViewInstance } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";
import { goBackOrReplace } from "@/lib/navigation";
import {
  getSettingsGroup,
  getSettingsSubgroup,
  isGroupAvailable,
  subgroupOfSection,
} from "@/lib/settings/groups";
import { getPlatformCtx } from "@/lib/settings/platform";
import { getSetting } from "@/lib/settings/registry";
import {
  type SettingsGroupId,
  settingsGroupPath,
  settingsSubgroupPath,
} from "@/lib/settings/routes";

import { SettingsGroupBody } from "./settings-group-body";
import { useSettingsFormMaxWidth, useSettingsMasterDetail } from "./settings-layout";
import { SettingsListDetail } from "./settings-list-detail";

/**
 * A settings group route (§4.5.5): ScreenLayout + form max width + Back to the
 * hub + availability gate (TV / web never land on an empty state — they bounce
 * to the hub) + `?focus=<settingId>` scroll-and-pulse.
 *
 * With `subgroup` it is one sub-screen of a split group (Back → the group).
 * A group screen asked to focus a row that lives on a sub-screen forwards the
 * focus there, so every `settingHref(id)` keeps landing on the right row.
 *
 * Tablets / wide web (D-UX11) render the route as list–detail: the hub list
 * with this group selected beside its body. The route, `?focus=` and Back are
 * the phone's; the hub header stays so switching groups doesn't jump the page.
 */
export function SettingsScreen({ group, subgroup }: { group: SettingsGroupId; subgroup?: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ focus?: string }>();
  const formMaxWidth = useSettingsFormMaxWidth();
  const masterDetail = useSettingsMasterDetail();
  const meta = getSettingsGroup(group);
  const sub = subgroup ? getSettingsSubgroup(group, subgroup) : null;
  const ctx = useMemo(getPlatformCtx, []);
  const scrollRef = useRef<ScrollViewInstance | null>(null);

  const focus = typeof params.focus === "string" ? params.focus : null;
  const focusDef = focus ? getSetting(focus) : undefined;
  const focusSub = focusDef?.group === group ? subgroupOfSection(group, focusDef.section) : null;
  const focusHere = focusDef?.group === group && (focusSub?.id ?? null) === (sub?.id ?? null);
  const focusId = focus && focusHere ? focus : null;
  const { register, onScroll } = useScrollToActive(scrollRef, focusId);

  if (!isGroupAvailable(meta, ctx)) return <Redirect href="/settings" />;
  const groupPath = settingsGroupPath(group);
  if (subgroup && !sub) return <Redirect href={groupPath as Href} />;
  if (focus && focusSub && focusSub.id !== sub?.id) {
    const target = `${settingsSubgroupPath(group, focusSub.id)}?focus=${encodeURIComponent(focus)}`;
    return <Redirect href={target as Href} />;
  }

  const onBack = () => goBackOrReplace(router, (sub ? groupPath : "/settings") as Href);
  const seoPath = sub ? settingsSubgroupPath(group, sub.id) : groupPath;

  if (masterDetail) {
    return (
      <ScreenLayout
        eyebrow={t("settings.eyebrow")}
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
        onBack={onBack}
        scrollRef={scrollRef}
        onScroll={onScroll}
      >
        <Seo path={seoPath} />
        <SettingsListDetail
          from="group"
          group={group}
          subgroup={sub?.id ?? null}
          focusId={focusId}
          register={register}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      maxContentWidth={formMaxWidth}
      eyebrow={sub ? t(meta.titleKey) : t("settings.title")}
      title={t(sub?.titleKey ?? meta.titleKey)}
      subtitle={t(sub?.subtitleKey ?? meta.subtitleKey)}
      onBack={onBack}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path={seoPath} />
      <SettingsGroupBody
        group={group}
        subgroup={sub?.id ?? null}
        focusId={focusId}
        register={register}
      />
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
