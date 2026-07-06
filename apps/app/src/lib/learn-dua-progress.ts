interface BuildLearnDuaProgressInput {
  lessonsCompleted: number;
  lessonsTotal: number;
}

export interface LearnDuaProgressSnapshot {
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonProgress: number;
}

export function buildLearnDuaProgress({
  lessonsCompleted,
  lessonsTotal,
}: BuildLearnDuaProgressInput): LearnDuaProgressSnapshot {
  return {
    lessonsCompleted,
    lessonsTotal,
    lessonProgress: lessonsTotal > 0 ? lessonsCompleted / lessonsTotal : 0,
  };
}
