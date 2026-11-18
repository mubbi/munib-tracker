import { AQEDAH_TOPICS } from "@munib-tracker/shared/content/aqeedah";

import { DB_KEYS } from "@/db/keys";
import { describeTopicProgressStore } from "@/test-support/topic-progress-store";

import {
  aqeedahProgressStore,
  useAqeedahCompletedCount,
  useAqeedahProgressActions,
  useAqeedahProgressReady,
  useAqeedahTopicCompleted,
  useEnsureAqeedahProgressLoaded,
} from "./aqeedah-progress-store";

describeTopicProgressStore("aqeedahProgressStore", {
  store: aqeedahProgressStore,
  storageKey: DB_KEYS.aqeedahProgress,
  topicIds: [AQEDAH_TOPICS[0]?.id ?? "", AQEDAH_TOPICS[1]?.id ?? ""],
  useReady: useAqeedahProgressReady,
  useTopicCompleted: useAqeedahTopicCompleted,
  useCompletedCount: useAqeedahCompletedCount,
  useActions: useAqeedahProgressActions,
  useEnsureLoaded: useEnsureAqeedahProgressLoaded,
});
