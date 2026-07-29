interface BuildBattlesProgressInput {
  lessonsCompleted: number;
  lessonsTotal: number;
}

export interface BattlesProgressSnapshot {
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonProgress: number;
}

export function buildBattlesProgress({
  lessonsCompleted,
  lessonsTotal,
}: BuildBattlesProgressInput): BattlesProgressSnapshot {
  return {
    lessonsCompleted,
    lessonsTotal,
    lessonProgress: lessonsTotal > 0 ? lessonsCompleted / lessonsTotal : 0,
  };
}
