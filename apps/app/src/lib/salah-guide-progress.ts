interface BuildSalahGuideProgressInput {
  lessonsCompleted: number;
  lessonsTotal: number;
}

export interface SalahGuideProgressSnapshot {
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonProgress: number;
}

export function buildSalahGuideProgress({
  lessonsCompleted,
  lessonsTotal,
}: BuildSalahGuideProgressInput): SalahGuideProgressSnapshot {
  return {
    lessonsCompleted,
    lessonsTotal,
    lessonProgress: lessonsTotal > 0 ? lessonsCompleted / lessonsTotal : 0,
  };
}
