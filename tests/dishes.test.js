import { describe, it, expect } from 'vitest'
import { DISHES, CATEGORIES } from '../src/data/dishes.js'

describe('dishes', () => {
  it('has exactly 17 dishes with unique ids', () => {
    expect(DISHES).toHaveLength(17)
    expect(new Set(DISHES.map((d) => d.id)).size).toBe(17)
  })

  it('gives every dish a name, ingredients, steps and nutrients', () => {
    for (const d of DISHES) {
      expect(d.name.length).toBeGreaterThan(0)
      expect(d.ingredients.length).toBeGreaterThan(0)
      expect(d.steps.length).toBeGreaterThan(0)
      for (const k of ['protein', 'calcium', 'iron', 'vitaminC']) {
        expect(typeof d.nutrients[k]).toBe('number')
      }
      for (const i of d.ingredients) {
        expect(i.amount).toBeGreaterThan(0)
        expect(CATEGORIES).toContain(i.category)
      }
    }
  })

  it('has protein in every dish', () => {
    for (const d of DISHES) expect(d.nutrients.protein, d.id).toBeGreaterThanOrEqual(15)
  })

  it('never combines calcium-rich and iron-rich in one dish', () => {
    for (const d of DISHES) expect(d.calciumRich && d.ironRich, d.id).toBe(false)
  })

  it('pairs every iron-rich dish with a vitamin C source', () => {
    for (const d of DISHES.filter((x) => x.ironRich)) {
      expect(d.nutrients.vitaminC, d.id).toBeGreaterThanOrEqual(30)
    }
  })

  it('has both calcium-rich and iron-rich dishes so the warning can matter', () => {
    expect(DISHES.filter((d) => d.calciumRich).length).toBeGreaterThanOrEqual(4)
    expect(DISHES.filter((d) => d.ironRich).length).toBeGreaterThanOrEqual(4)
  })
})
