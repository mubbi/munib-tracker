import { TAHARAH_TOPICS } from "@munib-tracker/shared/content/taharah";

import { DB_KEYS } from "@/db/keys";
import { describeTopicProgressStore } from "@/test-support/topic-progress-store";

import {
  taharahProgressStore,
  useEnsureTaharahProgressLoaded,
  useTaharahCompletedCount,
  useTaharahProgressActions,
  useTaharahProgressReady,
  useTaharahTopicCompleted,
} from "./taharah-progress-store";

describeTopicProgressStore("taharahProgressStore", {
  store: taharahProgressStore,
  storageKey: DB_KEYS.taharahProgress,
  topicIds: [TAHARAH_TOPICS[0]?.id ?? "", TAHARAH_TOPICS[1]?.id ?? ""],
  useReady: useTaharahProgressReady,
  useTopicCompleted: useTaharahTopicCompleted,
  useCompletedCount: useTaharahCompletedCount,
  useActions: useTaharahProgressActions,
  useEnsureLoaded: useEnsureTaharahProgressLoaded,
});
