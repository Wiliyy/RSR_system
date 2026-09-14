import { getItem, setItem } from './storage'
import { calculateEase, calculateInterval } from './sm2'

const STORAGE_KEY = 'rsr_progress'
const DEFAULT_EASE = 2.5
// binary quiz result -> SM-2 grade (0-5); "weak" stays below 3 so SM-2 resets repetition
const GRADE_BY_RESULT = { good: 5, weak: 2 }

export function updateStorage(itemId, result) {
  const store = getItem(STORAGE_KEY, {})
  const prev = store[itemId] ?? { repetition: 0, ease: DEFAULT_EASE }
  const grade = GRADE_BY_RESULT[result]

  const ease = calculateEase(prev.ease, grade)
  const repetition = grade >= 3 ? prev.repetition + 1 : 0
  const interval = calculateInterval(repetition, ease)

  const entry = {
    itemId,
    repetition,
    ease,
    interval,
    lastReview: new Date().toISOString(),
    rating: result,
  }

  store[itemId] = entry
  setItem(STORAGE_KEY, store)
  return entry
}

export function getProgress(itemId) {
  const store = getItem(STORAGE_KEY, {})
  return store[itemId] ?? null
}

const DAY_MS = 24 * 60 * 60 * 1000

// no entry yet = never reviewed = due; otherwise due once its SM-2 interval has elapsed
export function isDue(entry, now = Date.now()) {
  if (!entry) return true
  return now >= new Date(entry.lastReview).getTime() + entry.interval * DAY_MS
}

// indices (into items) of items that are due for review, given each item's `id`
export function getDueIndices(items, now = Date.now()) {
  return items
    .map((item, index) => (isDue(getProgress(item.id), now) ? index : -1))
    .filter((index) => index !== -1)
}

// 3 consecutive correct reviews is the standard SM-2 "graduated" point
const MEMORIZED_REPETITION_THRESHOLD = 3

export function isMemorized(entry) {
  return Boolean(entry && entry.repetition >= MEMORIZED_REPETITION_THRESHOLD)
}
