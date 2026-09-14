import { describe, it, expect } from 'vitest'
import { PopQustionFromArray, PopOptionsFromArray } from '../shared/utils/Qustion'

describe('question generation fix', () => {
  it('never mutates the pool, always includes the answer among 4 unique options', () => {
    const pool = Array.from({ length: 10 }, (_, i) => ({ id: i + 100 }))

    for (let i = 0; i < 5000; i++) {
      const before = pool.length
      const qId = PopQustionFromArray(pool)
      expect(pool.length).toBe(before)
      expect(qId).toBeGreaterThanOrEqual(0)
      expect(qId).toBeLessThan(pool.length)

      const options = PopOptionsFromArray(pool, qId)
      expect(options.length).toBe(4)
      expect(new Set(options).size).toBe(4)
      expect(options).toContain(qId)
      options.forEach((o) => {
        expect(o).toBeGreaterThanOrEqual(0)
        expect(o).toBeLessThan(pool.length)
      })
    }
  })

  it('uses every available item when the JSON file has fewer than four words', () => {
    const pool = [{ id: 1 }, { id: 2 }]

    const options = PopOptionsFromArray(pool, 0)

    expect(options).toHaveLength(2)
    expect(new Set(options)).toEqual(new Set([0, 1]))
  })
})
