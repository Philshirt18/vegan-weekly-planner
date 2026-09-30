import { INGREDIENTS } from '../data/ingredients.js'

// Beim Kochen geht ein Teil des Vitamin C verloren. Grober Näherungswert.
export const VITAMIN_C_RETENTION = 0.7

// Schwellen für die Einstufung eines Gerichts (etwa 30 % des Tagesbedarfs einer erwachsenen Person).
export const CALCIUM_RICH_MG = 300
export const IRON_RICH_MG = 5
export const VITAMIN_C_MIN_FOR_IRON_MG = 30

export function ingredientGrams(ingredient) {
  const { name, amount, unit } = ingredient
  if (unit === 'g' || unit === 'ml') return amount
  const perUnit = INGREDIENTS[name]?.unitGrams?.[unit]
  if (perUnit === undefined) throw new Error(`Kein Gewicht für "${name}" in Einheit "${unit}"`)
  return amount * perUnit
}

// Nährwerte einer Erwachsenenportion, berechnet aus den Zutaten.
export function computeNutrients(ingredients) {
  const total = { protein: 0, calcium: 0, iron: 0, vitaminC: 0 }
  for (const ing of ingredients) {
    const data = INGREDIENTS[ing.name]
    if (!data) throw new Error(`Keine Nährwerte für "${ing.name}"`)
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

// Kalziumreich: ab 300 mg Kalzium. Eisenreich: Eisen ab 5 mg UND unter 300 mg Kalzium
// (ab etwa 300 mg Kalzium in einer Mahlzeit sinkt die Eisenaufnahme merklich).
// Ein Gericht ist deshalb nie beides.
export function classify(nutrients) {
  const calciumRich = nutrients.calcium >= CALCIUM_RICH_MG
  const ironRich = !calciumRich && nutrients.iron >= IRON_RICH_MG
  return { calciumRich, ironRich }
}
