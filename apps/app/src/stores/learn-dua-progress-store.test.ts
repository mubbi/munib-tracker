import { LEARN_DUA_TOPICS } from "@munib-tracker/shared/content/learn-dua";

import { DB_KEYS } from "@/db/keys";
import { describeTopicProgressStore } from "@/test-support/topic-progress-store";

import {
  learnDuaProgressStore,
  useEnsureLearnDuaProgressLoaded,
  useLearnDuaCompletedCount,
  useLearnDuaProgressActions,
  useLearnDuaProgressReady,
  useLearnDuaTopicCompleted,
} from "./learn-dua-progress-store";

describeTopicProgressStore("learnDuaProgressStore", {
  store: learnDuaProgressStore,
  storageKey: DB_KEYS.learnDuaProgress,
  topicIds: [LEARN_DUA_TOPICS[0]?.id ?? "", LEARN_DUA_TOPICS[1]?.id ?? ""],
  useReady: useLearnDuaProgressReady,
  useTopicCompleted: useLearnDuaTopicCompleted,
  useCompletedCount: useLearnDuaCompletedCount,
  useActions: useLearnDuaProgressActions,
  useEnsureLoaded: useEnsureLearnDuaProgressLoaded,
});
