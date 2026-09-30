// Zutatenmengen fürs Kochen: umgerechnet auf die gewünschte Zahl an Erwachsenenportionen
// und so gerundet, wie man sie beim Kochen abmisst (im Unterschied zur Einkaufsliste,
// die aufrundet).

const FRACTIONS = { 0.25: '¼', 0.5: '½', 0.75: '¾' }
const comma = (n) => String(n).replace('.', ',')

export function formatPortions(n) {
  return comma(n)
}

// Zahl mit Bruch, zum Beispiel 1,5 → "1 ½"
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
    if (amount >= 1000) return `${comma(Math.round(amount / 100) / 10)} ${unit === 'g' ? 'kg' : 'l'}`
    return `${Math.max(5, Math.round(amount / 5) * 5)} ${unit}`
  }
  const q = Math.max(0.25, Math.round(amount * 4) / 4)
  const text = withFraction(amount)
  if (unit === 'Zehe') return `${text} ${q === 1 ? 'Zehe' : 'Zehen'}`
  if (unit === 'Scheibe') return `${text} ${q === 1 ? 'Scheibe' : 'Scheiben'}`
  return `${text} ${unit}`
}
