// Algorithme SM-2 pour répétition espacée
export type Grade = 0|1|2|3|4|5;
export function sm2(prevEF: number, prevInterval: number, prevReps: number, grade: Grade) {
  const q = grade;
  let ef = prevEF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;
  let reps = prevReps, interval = 0;
  if (q < 3) { reps = 0; interval = 1; }
  else {
    reps = prevReps + 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(prevInterval * ef);
  }
  return { ef, interval, reps };
}
