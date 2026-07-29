interface BuildQuranGuideProgressInput {
  lessonsCompleted: number;
  lessonsTotal: number;
}

export interface QuranGuideProgressSnapshot {
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonProgress: number;
}

export function buildQuranGuideProgress({
  lessonsCompleted,
  lessonsTotal,
}: BuildQuranGuideProgressInput): QuranGuideProgressSnapshot {
  return {
    lessonsCompleted,
    lessonsTotal,
    lessonProgress: lessonsTotal > 0 ? lessonsCompleted / lessonsTotal : 0,
  };
}
