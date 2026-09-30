import { describe, it, expect } from 'vitest'
import { buildShoppingList, withoutChecked, formatAmount } from '../src/lib/shopping.js'
import { CATEGORIES } from '../src/data/dishes.js'

const dishes = {
  a: { id: 'a', ingredients: [
    { name: 'Zwiebel', amount: 0.5, unit: 'Stück', category: 'Gemüse' },
    { name: 'Reis', amount: 80, unit: 'g', category: 'Getreide & Nudeln' },
  ] },
  b: { id: 'b', ingredients: [
    { name: 'Zwiebel', amount: 0.5, unit: 'Stück', category: 'Gemüse' },
    { name: 'Reis', amount: 70, unit: 'g', category: 'Getreide & Nudeln' },
    { name: 'Tofu natur', amount: 150, unit: 'g', category: 'Gekühltes' },
  ] },
}
const byId = (id) => dishes[id]
const plan = { mon: { lunch: 'a', dinner: 'b' } }
const twoAdultsAndChild = [{ age: 34 }, { age: 36 }, { age: 5 }] // 2,5 Portionen
const flat = (groups) => Object.fromEntries(groups.flatMap((g) => g.items.map((i) => [i.name, i])))

describe('buildShoppingList', () => {
  it('adds up the same ingredient from several dishes', () => {
    const items = flat(buildShoppingList(plan, [{ age: 30 }], byId))
    expect(items['Zwiebel'].amount).toBe(1)
    expect(items['Reis'].amount).toBe(150)
  })

  it('scales quantities to the family (a child up to 12 counts half)', () => {
    const items = flat(buildShoppingList(plan, twoAdultsAndChild, byId))
    expect(items['Reis'].amount).toBe(375) // 150 g x 2,5
    expect(items['Tofu natur'].amount).toBe(375) // 150 g x 2,5
    expect(items['Zwiebel'].label).toBe('3 Stück') // 2,5 aufgerundet
  })

  it('groups by category in the app order', () => {
    const groups = buildShoppingList(plan, [{ age: 30 }], byId)
    expect(groups.map((g) => g.category)).toEqual(['Gemüse', 'Getreide & Nudeln', 'Gekühltes'])
    const order = groups.map((g) => CATEGORIES.indexOf(g.category))
    expect(order).toEqual([...order].sort((x, y) => x - y))
  })

  it('does not merge the same name with a different unit', () => {
    const local = { c: { ingredients: [{ name: 'X', amount: 1, unit: 'EL', category: 'Gemüse' }, { name: 'X', amount: 20, unit: 'g', category: 'Gemüse' }] } }
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
    const result = withoutChecked(groups, ['Zwiebel|Stück', 'Tofu natur|g'])
    expect(result.map((g) => g.category)).toEqual(['Getreide & Nudeln'])
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
    expect(formatAmount(1250, 'g')).toBe('1,3 kg')
    expect(formatAmount(42, 'g')).toBe('45 g')
  })
  it('rounds pieces up to whole ones', () => {
    expect(formatAmount(1.25, 'Stück')).toBe('2 Stück')
    expect(formatAmount(1, 'Zehe')).toBe('1 Zehe')
    expect(formatAmount(2.5, 'Zehe')).toBe('3 Zehen')
  })
  it('rounds spoons up to half spoons', () => {
    expect(formatAmount(2.5, 'TL')).toBe('2,5 TL')
    expect(formatAmount(2.6, 'EL')).toBe('3 EL')
  })
  it('uses litres for large liquid amounts', () => {
    expect(formatAmount(1500, 'ml')).toBe('1,5 l')
  })
})
