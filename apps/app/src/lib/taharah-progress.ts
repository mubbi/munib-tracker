interface BuildTaharahProgressInput {
  lessonsCompleted: number;
  lessonsTotal: number;
}

export interface TaharahProgressSnapshot {
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonProgress: number;
}

export function buildTaharahProgress({
  lessonsCompleted,
  lessonsTotal,
}: BuildTaharahProgressInput): TaharahProgressSnapshot {
  return {
    lessonsCompleted,
    lessonsTotal,
    lessonProgress: lessonsTotal > 0 ? lessonsCompleted / lessonsTotal : 0,
  };
}
