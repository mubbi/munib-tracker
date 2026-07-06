interface BuildAqeedahProgressInput {
  lessonsCompleted: number;
  lessonsTotal: number;
}

export interface AqeedahProgressSnapshot {
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonProgress: number;
}

export function buildAqeedahProgress({
  lessonsCompleted,
  lessonsTotal,
}: BuildAqeedahProgressInput): AqeedahProgressSnapshot {
  return {
    lessonsCompleted,
    lessonsTotal,
    lessonProgress: lessonsTotal > 0 ? lessonsCompleted / lessonsTotal : 0,
  };
}
