import { describe, it, expect } from 'vitest'
import { DISHES } from '../src/data/dishes.js'
import { ALL_DAY_IDS, countStatus, distribute, calciumWarnings, swapSlots } from '../src/lib/planner.js'

const ca = DISHES.filter((d) => d.calciumRich).map((d) => d.id)
const rest = DISHES.filter((d) => !d.calciumRich).map((d) => d.id)
const placed = (plan) => Object.values(plan).flatMap((d) => [d.lunch, d.dinner])

describe('countStatus', () => {
  it('reports an empty selection', () => {
    expect(countStatus(0, ALL_DAY_IDS)).toEqual({ state: 'empty' })
  })
  it('accepts 14 dishes for 7 days', () => {
    expect(countStatus(14, ALL_DAY_IDS)).toEqual({ state: 'ok' })
  })
  it('accepts 10 dishes for 5 days', () => {
    expect(countStatus(10, ['mon', 'tue', 'wed', 'thu', 'fri'])).toEqual({ state: 'ok' })
  })
  it('asks for days when none are chosen', () => {
    expect(countStatus(9, [])).toEqual({ state: 'noDays' })
  })
  it('reports missing dishes for an odd count (9 dishes, 5 days)', () => {
    expect(countStatus(9, ['mon', 'tue', 'wed', 'thu', 'fri'])).toEqual({ state: 'tooFew', missing: 1 })
  })
  it('reports too many dishes for the chosen days', () => {
    expect(countStatus(12, ['mon', 'tue', 'wed', 'thu', 'fri'])).toEqual({ state: 'tooMany', over: 2 })
  })
  it('reports more than 14 dishes as too many', () => {
    expect(countStatus(16, ALL_DAY_IDS)).toEqual({ state: 'tooMany', over: 2 })
  })
})

describe('distribute', () => {
  it('places every selected dish exactly once for 14 of 17', () => {
    const selected = [...ca, ...rest].slice(0, 14)
    const plan = distribute(selected, ALL_DAY_IDS)
    expect(placed(plan).sort()).toEqual([...selected].sort())
  })

  it('puts calcium-rich dishes on different days when possible', () => {
    const selected = [...ca, ...rest.slice(0, 9)] // 5 kalziumreiche + 9 andere = 14
    const plan = distribute(selected, ALL_DAY_IDS)
    expect(calciumWarnings(plan)).toEqual([])
  })

  it('only uses the chosen days, in weekday order', () => {
    const plan = distribute(rest.slice(0, 6), ['wed', 'mon', 'fri'])
    expect(Object.keys(plan)).toEqual(['mon', 'wed', 'fri'])
    expect(placed(plan).every(Boolean)).toBe(true)
  })

  it('cannot avoid a warning when there are more calcium dishes than days', () => {
    const plan = distribute([...ca.slice(0, 4)], ['mon', 'tue'])
    expect(calciumWarnings(plan)).toHaveLength(2)
  })
})

describe('calciumWarnings', () => {
  it('warns only when both meals of a day are calcium-rich', () => {
    const plan = {
      mon: { lunch: ca[0], dinner: ca[1] },
      tue: { lunch: ca[2], dinner: rest[0] },
    }
    expect(calciumWarnings(plan)).toEqual(['mon'])
  })
})

describe('swapSlots', () => {
  it('swaps two slots without changing the original', () => {
    const plan = { mon: { lunch: 'a', dinner: 'b' }, tue: { lunch: 'c', dinner: 'd' } }
    const next = swapSlots(plan, { day: 'mon', meal: 'lunch' }, { day: 'tue', meal: 'dinner' })
    expect(next.mon.lunch).toBe('d')
    expect(next.tue.dinner).toBe('a')
    expect(plan.mon.lunch).toBe('a')
  })
})
