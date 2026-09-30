// Ingredient amounts for cooking: scaled to the chosen number of adult portions
// and rounded the way you measure them while cooking (unlike the shopping list,
// which rounds up).

const FRACTIONS = { 0.25: '¼', 0.5: '½', 0.75: '¾' }
export function formatPortions(n) {
  return String(n)
}

// Number with a fraction, for example 1.5 → "1 ½"
function withFraction(amount) {
  const q = Math.max(0.25, Math.round(amount * 4) / 4)
  const whole = Math.floor(q)
  const frac = FRACTIONS[q - whole]
  if (!frac) return String(whole)
  return whole === 0 ? frac : `${whole} ${frac}`
}

export function cookAmount(ingredient, portions) {
  const amount = ingredient.amount * portions
  const { unit } = ingredient
  if (unit === 'g' || unit === 'ml') {
    if (amount >= 1000) return `${Math.round(amount / 100) / 10} ${unit === 'g' ? 'kg' : 'l'}`
    return `${Math.max(5, Math.round(amount / 5) * 5)} ${unit}`
  }
  const q = Math.max(0.25, Math.round(amount * 4) / 4)
  const text = withFraction(amount)
  if (unit === 'pc') return text // "1 ¼ Onion" reads better than "1 ¼ pc Onion"
  if (unit === 'clove') return `${text} ${q === 1 ? 'clove' : 'cloves'}`
  if (unit === 'slice') return `${text} ${q === 1 ? 'slice' : 'slices'}`
  return `${text} ${unit}`
}
