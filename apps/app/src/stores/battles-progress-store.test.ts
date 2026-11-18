import { BATTLES_TOPICS } from "@munib-tracker/shared/content/battles";

import { DB_KEYS } from "@/db/keys";
import { describeTopicProgressStore } from "@/test-support/topic-progress-store";

import {
  battlesProgressStore,
  useBattlesCompletedCount,
  useBattlesProgressActions,
  useBattlesProgressReady,
  useBattlesTopicCompleted,
  useEnsureBattlesProgressLoaded,
} from "./battles-progress-store";

describeTopicProgressStore("battlesProgressStore", {
  store: battlesProgressStore,
  storageKey: DB_KEYS.battlesProgress,
  topicIds: [BATTLES_TOPICS[0]?.id ?? "", BATTLES_TOPICS[1]?.id ?? ""],
  useReady: useBattlesProgressReady,
  useTopicCompleted: useBattlesTopicCompleted,
  useCompletedCount: useBattlesCompletedCount,
  useActions: useBattlesProgressActions,
  useEnsureLoaded: useEnsureBattlesProgressLoaded,
});
