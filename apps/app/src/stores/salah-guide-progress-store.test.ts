import { SALAH_GUIDE_TOPICS } from "@munib-tracker/shared/content/salah-guide";

import { DB_KEYS } from "@/db/keys";
import { describeTopicProgressStore } from "@/test-support/topic-progress-store";

import {
  salahGuideProgressStore,
  useEnsureSalahGuideProgressLoaded,
  useSalahGuideCompletedCount,
  useSalahGuideProgressActions,
  useSalahGuideProgressReady,
  useSalahGuideTopicCompleted,
} from "./salah-guide-progress-store";

describeTopicProgressStore("salahGuideProgressStore", {
  store: salahGuideProgressStore,
  storageKey: DB_KEYS.salahGuideProgress,
  topicIds: [SALAH_GUIDE_TOPICS[0]?.id ?? "", SALAH_GUIDE_TOPICS[1]?.id ?? ""],
  useReady: useSalahGuideProgressReady,
  useTopicCompleted: useSalahGuideTopicCompleted,
  useCompletedCount: useSalahGuideCompletedCount,
  useActions: useSalahGuideProgressActions,
  useEnsureLoaded: useEnsureSalahGuideProgressLoaded,
});
