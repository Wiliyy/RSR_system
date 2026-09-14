// SM-2 ease factor floor: without it, repeated low grades drive ease to zero/negative,
// which makes calculateInterval shrink to zero or flip sign.
const MIN_EASE = 1.3

export function calculateEase(oldEase, grade) {
  const newEase = oldEase + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  return Math.max(MIN_EASE, newEase)
}

export function calculateInterval(repetition, ease) {
  if (repetition <= 0) return 1
  if (repetition === 1) return 1
  if (repetition === 2) return 6
  return Math.round(6 * Math.pow(ease, repetition - 2))
}
