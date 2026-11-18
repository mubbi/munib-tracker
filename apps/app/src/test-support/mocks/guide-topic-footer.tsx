/**
 * Shared `@/components/guide-topic-footer` mock — skips the share-card /
 * lesson-complete plumbing so Learn topic-content tests focus on the article.
 * Renders a `guide-topic-footer` button labelled with the topic id that fires
 * `onToggleComplete` (and reports `completed` via `accessibilityState.checked`).
 *
 *   jest.mock("@/components/guide-topic-footer", () =>
 *     require("@/test-support/mocks/guide-topic-footer").guideTopicFooterMock);
 */
import { Pressable } from "react-native";

function GuideTopicFooter({
  topic,
  completed,
  onToggleComplete,
}: {
  topic?: { id?: string };
  completed?: boolean;
  onToggleComplete?: () => void;
}) {
  return (
    <Pressable
      testID="guide-topic-footer"
      accessibilityLabel={topic?.id}
      accessibilityState={{ checked: Boolean(completed) }}
      onPress={onToggleComplete}
    />
  );
}

export const guideTopicFooterMock = { __esModule: true, GuideTopicFooter };
