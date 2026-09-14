import { beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_DAILY_LIMIT,
  getDailyLimit,
  getDailyPlan,
  getTodayActivity,
  recordDailyReview,
  saveDailyLimit,
} from '../shared/utils/dailySession'

const items = Array.from({ length: 6 }, (_, index) => ({ id: index + 1 }))

beforeEach(() => {
  localStorage.clear()
})

describe('daily limit settings', () => {
  it('uses a default and persists a valid user limit', () => {
    expect(getDailyLimit()).toBe(DEFAULT_DAILY_LIMIT)

    expect(saveDailyLimit(3)).toBe(3)
    expect(getDailyLimit()).toBe(3)
  })

  it('clamps invalid limits to the supported range', () => {
    expect(saveDailyLimit(0)).toBe(1)
    expect(saveDailyLimit(999)).toBe(100)
    expect(saveDailyLimit('not-a-number')).toBe(DEFAULT_DAILY_LIMIT)
  })
})

describe('daily review planning', () => {
  it('caps due items at the daily limit and reports deferred reviews', () => {
    const plan = getDailyPlan(items, new Date('2026-09-14T08:00:00'), 2)

    expect(plan.items.map((item) => item.id)).toEqual([1, 2])
    expect(plan.reviewedToday).toBe(0)
    expect(plan.deferredCount).toBe(4)
  })

  it('does not allow a reload to exceed reviews already completed today', () => {
    const now = new Date('2026-09-14T08:00:00')
    recordDailyReview(1, now)
    recordDailyReview(2, now)

    const plan = getDailyPlan(items, now, 2)

    expect(plan.items).toEqual([])
    expect(plan.reviewedToday).toBe(2)
    expect(plan.limitReached).toBe(true)
  })

  it('counts an item only once and resets activity on a new day', () => {
    const dayOne = new Date('2026-09-14T08:00:00')
    const dayTwo = new Date('2026-09-15T08:00:00')

    recordDailyReview(1, dayOne)
    recordDailyReview(1, dayOne)
    expect(getTodayActivity(dayOne).itemIds).toEqual([1])
    expect(getTodayActivity(dayTwo).itemIds).toEqual([])
  })

  it('returns an empty plan when there is no vocabulary', () => {
    const plan = getDailyPlan([], new Date('2026-09-14T08:00:00'), 10)

    expect(plan.items).toEqual([])
    expect(plan.totalDue).toBe(0)
    expect(plan.hasVocabulary).toBe(false)
  })
})
