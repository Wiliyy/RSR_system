import { describe, it, expect, beforeEach } from 'vitest'
import { updateStorage, getProgress } from '../shared/utils/progress'

describe('updateStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts a new item at repetition 1, interval 1 on a "good" result', () => {
    const entry = updateStorage(42, 'good')
    expect(entry.itemId).toBe(42)
    expect(entry.repetition).toBe(1)
    expect(entry.interval).toBe(1)
    expect(entry.ease).toBeCloseTo(2.6, 5)
    expect(entry.rating).toBe('good')
  })

  it('grows repetition and interval across consecutive "good" results', () => {
    updateStorage(1, 'good')
    updateStorage(1, 'good')
    const third = updateStorage(1, 'good')
    expect(third.repetition).toBe(3)
    expect(third.interval).toBe(Math.round(6 * third.ease))
  })

  it('resets repetition to 0 and interval to 1 on a "weak" result', () => {
    updateStorage(1, 'good')
    updateStorage(1, 'good')
    const failed = updateStorage(1, 'weak')
    expect(failed.repetition).toBe(0)
    expect(failed.interval).toBe(1)
    expect(failed.rating).toBe('weak')
  })

  it('persists entries so getProgress can read them back', () => {
    updateStorage(7, 'good')
    const progress = getProgress(7)
    expect(progress).not.toBeNull()
    expect(progress.itemId).toBe(7)
  })

  it('returns null from getProgress for an item never reviewed', () => {
    expect(getProgress(999)).toBeNull()
  })

  it('tracks separate entries per itemId', () => {
    updateStorage(1, 'good')
    updateStorage(2, 'weak')
    expect(getProgress(1).rating).toBe('good')
    expect(getProgress(2).rating).toBe('weak')
  })
})
