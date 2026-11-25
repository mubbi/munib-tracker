import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahNavRow } from "@/components/jannah/primitives";
import { LearnGrid, LearnHubScreen, type LearnHubSection } from "@/components/learn-guide";
import { FocusHighlight } from "@/components/ui/focus-highlight";
import { Spacing } from "@/constants/theme";
import { useScreenFocus } from "@/hooks/use-screen-focus";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import { getHajjGuideSectionOrder, getHajjGuideTopicsBySection } from "@/lib/hajj-guide";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";

const TOPIC_ICON: AppIcon = { ios: "text.book.closed", android: "article", web: "article" };

const SECTION_ICONS: Record<string, AppIcon> = {
  virtues: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  obligation: { ios: "building.columns.fill", android: "mosque", web: "mosque" },
  types: { ios: "square.stack.3d.up.fill", android: "layers", web: "layers" },
  ihram: { ios: "person.fill", android: "person", web: "person" },
  umrah: { ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" },
  hajj: { ios: "map.fill", android: "map", web: "map" },
  rulings: { ios: "list.bullet.clipboard.fill", android: "fact_check", web: "fact_check" },
  prep: { ios: "suitcase.fill", android: "luggage", web: "luggage" },
};

export default function HajjScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  // `?focus=<topicId>` deep links scroll to and highlight that topic.
  const { scrollRef, register, onScroll, isFocused } = useScreenFocus();
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topicsBySection = useMemo(
    () => getHajjGuideTopicsBySection(),
    [i18n.language, overlayVersion],
  );

  const sections = useMemo<LearnHubSection[]>(
    () =>
      getHajjGuideSectionOrder().flatMap((section): LearnHubSection[] => {
        const topics = topicsBySection[section];
        if (!topics?.length) return [];
        return [
          {
            id: String(section),
            title: t(`hajj.section.${section}`),
            icon: SECTION_ICONS[section],
            children: (
              <LearnGrid maxColumns={2} gap={Spacing.two} passthrough>
                {topics.map((topic) => (
                  <FocusHighlight
                    key={topic.id}
                    ref={register(topic.id)}
                    active={isFocused(topic.id)}
                  >
                    <JannahNavRow
                      icon={TOPIC_ICON}
                      title={topic.title}
                      subtitle={topic.summary}
                      // TV: land the D-pad on the deep-linked topic.
                      preferredFocus={isFocused(topic.id)}
                      onPress={() =>
                        router.push({
                          pathname: "/hajj/[topic]",
                          params: { topic: topic.id },
                        } as unknown as Href)
                      }
                    />
                  </FocusHighlight>
                ))}
              </LearnGrid>
            ),
          },
        ];
      }),
    [topicsBySection, t, router, register, isFocused],
  );

  return (
    <LearnHubScreen
      ns="hajj"
      basePath="/hajj"
      sections={sections}
      tools={[
        {
          id: "hajj-checklist",
          icon: { ios: "map.fill", android: "map", web: "map" },
          title: t("hajj.hajjChecklistTitle"),
          subtitle: t("hajj.hajjChecklistHint"),
          href: "/hajj/checklist" as Href,
        },
        {
          id: "umrah-checklist",
          icon: { ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" },
          title: t("hajj.umrahChecklistTitle"),
          subtitle: t("hajj.umrahChecklistHint"),
          href: "/umrah/checklist" as Href,
        },
      ]}
      quiz
      scrollRef={scrollRef}
      onScroll={onScroll}
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/hajj");
