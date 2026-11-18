import { PROPHETS_TOPICS } from "@munib-tracker/shared/content/prophets";

import { DB_KEYS } from "@/db/keys";
import { describeTopicProgressStore } from "@/test-support/topic-progress-store";

import {
  prophetsProgressStore,
  useEnsureProphetsProgressLoaded,
  useProphetsCompletedCount,
  useProphetsProgressActions,
  useProphetsProgressReady,
  useProphetsTopicCompleted,
} from "./prophets-progress-store";

describeTopicProgressStore("prophetsProgressStore", {
  store: prophetsProgressStore,
  storageKey: DB_KEYS.prophetsProgress,
  topicIds: [PROPHETS_TOPICS[0]?.id ?? "", PROPHETS_TOPICS[1]?.id ?? ""],
  useReady: useProphetsProgressReady,
  useTopicCompleted: useProphetsTopicCompleted,
  useCompletedCount: useProphetsCompletedCount,
  useActions: useProphetsProgressActions,
  useEnsureLoaded: useEnsureProphetsProgressLoaded,
});
