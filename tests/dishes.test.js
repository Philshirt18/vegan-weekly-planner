import { describe, it, expect } from 'vitest'
import { DISHES, CATEGORIES } from '../src/data/dishes.js'
import { INGREDIENTS } from '../src/data/ingredients.js'
import { computeNutrients, classify, ingredientGrams, CALCIUM_RICH_MG } from '../src/lib/dishNutrients.js'

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
        expect(INGREDIENTS[i.name], `nutrition data for ${i.name}`).toBeDefined()
      }
    }
  })

  it('shows nutrients that really come from the ingredients', () => {
    for (const d of DISHES) expect(d.nutrients, d.id).toEqual(computeNutrients(d.ingredients))
  })

  it('has protein in every dish', () => {
    for (const d of DISHES) expect(d.nutrients.protein, d.id).toBeGreaterThanOrEqual(15)
  })

  it('never labels a dish calcium-rich and iron-rich at the same time', () => {
    for (const d of DISHES) expect(d.calciumRich && d.ironRich, d.id).toBe(false)
  })

  it('keeps iron-rich dishes under the calcium threshold', () => {
    for (const d of DISHES.filter((x) => x.ironRich)) {
      expect(d.nutrients.calcium, d.id).toBeLessThan(CALCIUM_RICH_MG)
    }
  })

  it('pairs every iron-rich dish with a vitamin C source', () => {
    for (const d of DISHES.filter((x) => x.ironRich)) {
      expect(d.nutrients.vitaminC, d.id).toBeGreaterThanOrEqual(30)
    }
  })

  it('has few enough calcium-rich dishes that the planner can avoid same-day pairs', () => {
    const count = DISHES.filter((d) => d.calciumRich).length
    expect(count).toBeGreaterThanOrEqual(4)
    expect(count).toBeLessThanOrEqual(6)
    expect(DISHES.filter((d) => d.ironRich).length).toBeGreaterThanOrEqual(6)
  })
})

describe('computeNutrients', () => {
  it('computes from amounts: 100 g red lentils', () => {
    const n = computeNutrients([{ name: 'Red lentils', amount: 100, unit: 'g' }])
    expect(n.protein).toBe(24)
    expect(n.iron).toBe(7.5)
  })

  it('converts pieces and spoons to grams', () => {
    expect(ingredientGrams({ name: 'Carrot', amount: 2, unit: 'pc' })).toBe(160)
    expect(ingredientGrams({ name: 'Tahini', amount: 2, unit: 'tbsp' })).toBe(30)
  })

  it('reduces vitamin C for cooking', () => {
    const n = computeNutrients([{ name: 'Bell pepper', amount: 100, unit: 'g' }])
    expect(n.vitaminC).toBe(85) // 120 mg * 0.7 = 84, rounded to 5
  })

  it('labels calcium-rich dishes and excludes iron-rich from them', () => {
    expect(classify({ calcium: 400, iron: 9 })).toEqual({ calciumRich: true, ironRich: false })
    expect(classify({ calcium: 200, iron: 9 })).toEqual({ calciumRich: false, ironRich: true })
    expect(classify({ calcium: 200, iron: 3 })).toEqual({ calciumRich: false, ironRich: false })
  })
})
