import { describe, it, expect } from 'vitest'
import { calculateEase, calculateInterval } from '../shared/utils/sm2'

describe('calculateEase', () => {
  it('matches the classic SM-2 ease deltas for each grade', () => {
    const oldEase = 2.5
    expect(calculateEase(oldEase, 5)).toBeCloseTo(2.6, 5)
    expect(calculateEase(oldEase, 4)).toBeCloseTo(2.5, 5)
    expect(calculateEase(oldEase, 3)).toBeCloseTo(2.36, 5)
    expect(calculateEase(oldEase, 2)).toBeCloseTo(2.18, 5)
    expect(calculateEase(oldEase, 1)).toBeCloseTo(1.96, 5)
    expect(calculateEase(oldEase, 0)).toBeCloseTo(1.7, 5)
  })

  it('never drops ease below the 1.3 floor', () => {
    expect(calculateEase(1.3, 0)).toBe(1.3)
    expect(calculateEase(1.35, 0)).toBe(1.3)
  })
})

describe('calculateInterval', () => {
  it('follows the standard SM-2 progression: 1, 6, then compounding by ease', () => {
    const ease = 2.5
    expect(calculateInterval(0, ease)).toBe(1)
    expect(calculateInterval(1, ease)).toBe(1)
    expect(calculateInterval(2, ease)).toBe(6)
    expect(calculateInterval(3, ease)).toBe(Math.round(6 * ease))
    expect(calculateInterval(4, ease)).toBe(Math.round(6 * ease ** 2))
  })

  it('resets to 1 day when repetition is 0 or negative (e.g. after a failed review)', () => {
    expect(calculateInterval(0, 2.5)).toBe(1)
    expect(calculateInterval(-1, 2.5)).toBe(1)
  })
})
