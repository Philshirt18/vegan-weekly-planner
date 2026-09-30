import { describe, it, expect } from 'vitest'
import { buildShoppingList, withoutChecked, formatAmount } from '../src/lib/shopping.js'
import { CATEGORIES } from '../src/data/dishes.js'

const dishes = {
  a: { id: 'a', ingredients: [
    { name: 'Onion', amount: 0.5, unit: 'pc', category: 'Vegetables' },
    { name: 'Rice', amount: 80, unit: 'g', category: 'Grains & pasta' },
  ] },
  b: { id: 'b', ingredients: [
    { name: 'Onion', amount: 0.5, unit: 'pc', category: 'Vegetables' },
    { name: 'Rice', amount: 70, unit: 'g', category: 'Grains & pasta' },
    { name: 'Tofu (plain)', amount: 150, unit: 'g', category: 'Chilled' },
  ] },
}
const byId = (id) => dishes[id]
const plan = { mon: { lunch: 'a', dinner: 'b' } }
const twoAdultsAndChild = [{ age: 34 }, { age: 36 }, { age: 5 }] // 2.5 portions
const flat = (groups) => Object.fromEntries(groups.flatMap((g) => g.items.map((i) => [i.name, i])))

describe('buildShoppingList', () => {
  it('adds up the same ingredient from several dishes', () => {
    const items = flat(buildShoppingList(plan, [{ age: 30 }], byId))
    expect(items['Onion'].amount).toBe(1)
    expect(items['Rice'].amount).toBe(150)
  })

  it('scales quantities to the family (a child up to 12 counts half)', () => {
    const items = flat(buildShoppingList(plan, twoAdultsAndChild, byId))
    expect(items['Rice'].amount).toBe(375) // 150 g x 2.5
    expect(items['Tofu (plain)'].amount).toBe(375) // 150 g x 2.5
    expect(items['Onion'].label).toBe('3 pcs') // 2.5 rounded up
  })

  it('groups by category in the app order', () => {
    const groups = buildShoppingList(plan, [{ age: 30 }], byId)
    expect(groups.map((g) => g.category)).toEqual(['Vegetables', 'Grains & pasta', 'Chilled'])
    const order = groups.map((g) => CATEGORIES.indexOf(g.category))
    expect(order).toEqual([...order].sort((x, y) => x - y))
  })

  it('does not merge the same name with a different unit', () => {
    const local = { c: { ingredients: [{ name: 'X', amount: 1, unit: 'tbsp', category: 'Vegetables' }, { name: 'X', amount: 20, unit: 'g', category: 'Vegetables' }] } }
    const groups = buildShoppingList({ mon: { lunch: 'c', dinner: null } }, [{ age: 30 }], (id) => local[id])
    expect(groups[0].items).toHaveLength(2)
  })

  it('is empty for an empty plan', () => {
    expect(buildShoppingList({}, [{ age: 30 }], byId)).toEqual([])
  })
})

describe('withoutChecked', () => {
  it('removes items the family already has and drops empty categories', () => {
    const groups = buildShoppingList(plan, [{ age: 30 }], byId)
    const result = withoutChecked(groups, ['Onion|pc', 'Tofu (plain)|g'])
    expect(result.map((g) => g.category)).toEqual(['Grains & pasta'])
  })

  it('returns an empty list when everything is checked', () => {
    const groups = buildShoppingList(plan, [{ age: 30 }], byId)
    const all = groups.flatMap((g) => g.items.map((i) => i.key))
    expect(withoutChecked(groups, all)).toEqual([])
  })
})

describe('formatAmount', () => {
  it('rounds grams up and switches to kg', () => {
    expect(formatAmount(237, 'g')).toBe('240 g')
    expect(formatAmount(1250, 'g')).toBe('1.3 kg')
    expect(formatAmount(42, 'g')).toBe('45 g')
  })
  it('rounds pieces up to whole ones', () => {
    expect(formatAmount(1.25, 'pc')).toBe('2 pcs')
    expect(formatAmount(1, 'clove')).toBe('1 clove')
    expect(formatAmount(2.5, 'clove')).toBe('3 cloves')
  })
  it('rounds spoons up to half spoons', () => {
    expect(formatAmount(2.5, 'tsp')).toBe('2.5 tsp')
    expect(formatAmount(2.6, 'tbsp')).toBe('3 tbsp')
  })
  it('uses litres for large liquid amounts', () => {
    expect(formatAmount(1500, 'ml')).toBe('1.5 l')
  })
})
