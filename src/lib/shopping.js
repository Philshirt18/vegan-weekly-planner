import { getDish, CATEGORIES } from '../data/dishes.js'
import { MEALS } from './planner.js'
import { totalPortions } from './nutrition.js'

export const itemKey = (ingredient) => `${ingredient.name}|${ingredient.unit}`

// Rounds an amount the way you buy it and writes it readably (for example "1.3 kg").
export function formatAmount(amount, unit) {
  switch (unit) {
    case 'g':
    case 'ml': {
      if (amount >= 1000) return `${Math.ceil(amount / 100) / 10} ${unit === 'g' ? 'kg' : 'l'}`
      const step = amount < 50 ? 5 : 10
      return `${Math.ceil(amount / step) * step} ${unit}`
    }
    case 'pc': return `${Math.ceil(amount)} ${Math.ceil(amount) === 1 ? 'pc' : 'pcs'}`
    case 'clove': return `${Math.ceil(amount)} ${Math.ceil(amount) === 1 ? 'clove' : 'cloves'}`
    case 'slice': return `${Math.ceil(amount)} ${Math.ceil(amount) === 1 ? 'slice' : 'slices'}`
    case 'tbsp':
    case 'tsp': return `${Math.ceil(amount * 2) / 2} ${unit}`
    default: return `${amount} ${unit}`
  }
}

// Builds the shopping list: all ingredients of all dishes in the plan, scaled to the family
// (adults 1 portion, children up to 12 years 0.5), identical ingredients added up, grouped by category.
export function buildShoppingList(plan, members, dishById = getDish) {
  const portions = totalPortions(members) || 1
  const totals = new Map()

  for (const day of Object.values(plan)) {
    for (const meal of MEALS) {
      const dish = day[meal] ? dishById(day[meal]) : null
      if (!dish) continue
      for (const ing of dish.ingredients) {
        const key = itemKey(ing)
        const item = totals.get(key) ?? { key, name: ing.name, unit: ing.unit, category: ing.category, amount: 0 }
        item.amount += ing.amount * portions
        totals.set(key, item)
      }
    }
  }

  return CATEGORIES.map((category) => ({
    category,
    items: [...totals.values()]
      .filter((i) => i.category === category)
      .sort((a, b) => a.name.localeCompare(b.name, 'de'))
      .map((i) => ({ ...i, label: formatAmount(i.amount, i.unit) })),
  })).filter((group) => group.items.length > 0)
}

// The final list: everything you do not already have at home.
export function withoutChecked(groups, checkedKeys) {
  return groups
    .map((g) => ({ ...g, items: g.items.filter((i) => !checkedKeys.includes(i.key)) }))
    .filter((g) => g.items.length > 0)
}
