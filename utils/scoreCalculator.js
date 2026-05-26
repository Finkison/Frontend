export function predictScore(accuracyPercent, consistency = 1) {
  return Math.round(Math.max(0, Math.min(700, accuracyPercent * 7 * consistency)));
}
