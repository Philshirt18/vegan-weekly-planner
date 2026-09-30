import { describe, it, expect } from 'vitest'
import { getTargets, portionFactor, totalPortions } from '../src/lib/nutrition.js'

describe('getTargets', () => {
  it('calculates protein from weight for an adult (0.8 g/kg)', () => {
    expect(getTargets({ age: 35, sex: 'male', weightKg: 75 }).protein).toBe(60)
  })

  it('adapts values for a 5-year-old child', () => {
    const t = getTargets({ age: 5, sex: 'female', weightKg: 18 })
    expect(t.protein).toBe(16) // 0.9 g/kg
    expect(t.calcium).toBe(750)
    expect(t.iron).toBe(7)
  })

  it('gives adult women a higher iron target than men', () => {
    const f = getTargets({ age: 35, sex: 'female', weightKg: 65 })
    const m = getTargets({ age: 35, sex: 'male', weightKg: 65 })
    expect(f.iron).toBeGreaterThan(m.iron)
  })

  it('raises protein and iron in pregnancy and breastfeeding', () => {
    const base = getTargets({ age: 32, sex: 'female', weightKg: 65 })
    const preg = getTargets({ age: 32, sex: 'female', weightKg: 65, status: 'pregnant' })
    const bf = getTargets({ age: 32, sex: 'female', weightKg: 65, status: 'breastfeeding' })
    expect(preg.protein).toBeGreaterThan(base.protein)
    expect(bf.protein).toBeGreaterThan(preg.protein)
    expect(preg.iron).toBe(27)
    expect(bf.iron).toBe(16)
  })

  it('uses the higher iron value when sex is diverse', () => {
    expect(getTargets({ age: 30, sex: 'diverse', weightKg: 70 }).iron).toBe(16)
  })
})

describe('portions', () => {
  it('counts children up to 12 as half a portion', () => {
    expect(portionFactor({ age: 12 })).toBe(0.5)
    expect(portionFactor({ age: 13 })).toBe(1)
  })

  it('sums a family of two adults and a 5-year-old to 2.5 portions', () => {
    expect(totalPortions([{ age: 34 }, { age: 36 }, { age: 5 }])).toBe(2.5)
  })
})
