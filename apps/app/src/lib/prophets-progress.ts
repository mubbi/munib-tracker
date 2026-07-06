interface BuildProphetsProgressInput {
  lessonsCompleted: number;
  lessonsTotal: number;
}

export interface ProphetsProgressSnapshot {
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonProgress: number;
}

export function buildProphetsProgress({
  lessonsCompleted,
  lessonsTotal,
}: BuildProphetsProgressInput): ProphetsProgressSnapshot {
  return {
    lessonsCompleted,
    lessonsTotal,
    lessonProgress: lessonsTotal > 0 ? lessonsCompleted / lessonsTotal : 0,
  };
}
