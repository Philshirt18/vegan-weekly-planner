import { INGREDIENTS } from '../data/ingredients.js'

// Some vitamin C is lost when cooking. Rough approximation.
export const VITAMIN_C_RETENTION = 0.7

// Thresholds for classifying a dish (about 30 % of an adult's daily need).
export const CALCIUM_RICH_MG = 300
export const IRON_RICH_MG = 5
export const VITAMIN_C_MIN_FOR_IRON_MG = 30

export function ingredientGrams(ingredient) {
  const { name, amount, unit } = ingredient
  if (unit === 'g' || unit === 'ml') return amount
  const perUnit = INGREDIENTS[name]?.unitGrams?.[unit]
  if (perUnit === undefined) throw new Error(`No weight for "${name}" in unit "${unit}"`)
  return amount * perUnit
}

// Nutrition of one adult portion, computed from the ingredients.
export function computeNutrients(ingredients) {
  const total = { protein: 0, calcium: 0, iron: 0, vitaminC: 0 }
  for (const ing of ingredients) {
    const data = INGREDIENTS[ing.name]
    if (!data) throw new Error(`No nutrition data for "${ing.name}"`)
    const grams = ingredientGrams(ing)
    for (const key of Object.keys(total)) total[key] += (data[key] * grams) / 100
  }
  total.vitaminC *= VITAMIN_C_RETENTION
  return {
    protein: Math.round(total.protein),
    calcium: Math.round(total.calcium / 10) * 10,
    iron: Math.round(total.iron * 10) / 10,
    vitaminC: Math.round(total.vitaminC / 5) * 5,
  }
}

// Calcium-rich: from 300 mg calcium. Iron-rich: iron from 5 mg AND under 300 mg calcium
// (from about 300 mg calcium in one meal, iron absorption drops noticeably).
// A dish is therefore never both.
export function classify(nutrients) {
  const calciumRich = nutrients.calcium >= CALCIUM_RICH_MG
  const ironRich = !calciumRich && nutrients.iron >= IRON_RICH_MG
  return { calciumRich, ironRich }
}
