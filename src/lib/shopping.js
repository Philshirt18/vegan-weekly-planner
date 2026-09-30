import { getDish, CATEGORIES } from '../data/dishes.js'
import { MEALS } from './planner.js'
import { totalPortions } from './nutrition.js'

export const itemKey = (ingredient) => `${ingredient.name}|${ingredient.unit}`

const fmt = (n) => String(n).replace('.', ',')

// Rundet eine Menge so, wie man sie einkauft, und schreibt sie lesbar auf (zum Beispiel "1,3 kg").
export function formatAmount(amount, unit) {
  switch (unit) {
    case 'g':
    case 'ml': {
      if (amount >= 1000) return `${fmt(Math.ceil(amount / 100) / 10)} ${unit === 'g' ? 'kg' : 'l'}`
      const step = amount < 50 ? 5 : 10
      return `${Math.ceil(amount / step) * step} ${unit}`
    }
    case 'Stück': return `${Math.ceil(amount)} Stück`
    case 'Zehe': return `${Math.ceil(amount)} ${Math.ceil(amount) === 1 ? 'Zehe' : 'Zehen'}`
    case 'Scheibe': return `${Math.ceil(amount)} ${Math.ceil(amount) === 1 ? 'Scheibe' : 'Scheiben'}`
    case 'EL':
    case 'TL': return `${fmt(Math.ceil(amount * 2) / 2)} ${unit}`
    default: return `${fmt(amount)} ${unit}`
  }
}

// Baut die Einkaufsliste: alle Zutaten aller Gerichte im Plan, auf die Familie umgerechnet
// (Erwachsene 1 Portion, Kinder bis 12 Jahre 0,5), gleiche Zutaten addiert, nach Kategorie gruppiert.
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

// Die finale Liste: alles, was man nicht schon zu Hause hat.
export function withoutChecked(groups, checkedKeys) {
  return groups
    .map((g) => ({ ...g, items: g.items.filter((i) => !checkedKeys.includes(i.key)) }))
    .filter((g) => g.items.length > 0)
}
