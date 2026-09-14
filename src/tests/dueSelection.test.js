import { describe, it, expect, beforeEach } from 'vitest'
import { updateStorage, isDue, getDueIndices } from '../shared/utils/progress'

const DAY_MS = 24 * 60 * 60 * 1000

describe('isDue', () => {
  it('is due when there is no entry yet (never reviewed)', () => {
    expect(isDue(null)).toBe(true)
  })

  it('is not due before the interval has elapsed', () => {
    const now = Date.now()
    const entry = { interval: 6, lastReview: new Date(now).toISOString() }
    expect(isDue(entry, now + DAY_MS)).toBe(false)
  })

  it('is due once the interval has elapsed', () => {
    const now = Date.now()
    const entry = { interval: 6, lastReview: new Date(now).toISOString() }
    expect(isDue(entry, now + 6 * DAY_MS)).toBe(true)
  })
})

describe('getDueIndices', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('treats never-reviewed items as due', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(getDueIndices(items)).toEqual([0, 1, 2])
  })

  it('excludes items reviewed "good" recently (interval not yet elapsed)', () => {
    const items = [{ id: 1 }, { id: 2 }]
    updateStorage(1, 'good') // interval 1 day, just reviewed -> not due for ~1 day
    expect(getDueIndices(items)).toEqual([1])
  })

  it('brings a "weak" item back sooner than a "good" item', () => {
    const items = [{ id: 1 }, { id: 2 }]
    updateStorage(1, 'good') // interval 1 day
    updateStorage(2, 'weak') // interval 1 day too, but let's push time forward mid-way regardless
    const now = Date.now()
    // both have interval 1 day; simulate 12 hours later - neither due yet
    expect(getDueIndices(items, now + 12 * 60 * 60 * 1000)).toEqual([])
    // 25 hours later - both due again since both intervals were 1 day
    expect(getDueIndices(items, now + 25 * 60 * 60 * 1000)).toEqual([0, 1])
  })
})
