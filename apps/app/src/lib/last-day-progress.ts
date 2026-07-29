export interface LastDayProgressSnapshot {
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonProgress: number;
}

export function buildLastDayProgress(input: {
  lessonsCompleted: number;
  lessonsTotal: number;
}): LastDayProgressSnapshot {
  const { lessonsCompleted, lessonsTotal } = input;
  const lessonProgress = lessonsTotal > 0 ? lessonsCompleted / lessonsTotal : 0;
  return { lessonsCompleted, lessonsTotal, lessonProgress };
}
