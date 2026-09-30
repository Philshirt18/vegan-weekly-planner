import { getDish } from '../data/dishes.js'

export const DAYS = [
  { id: 'mon', label: 'Montag', short: 'Mo' },
  { id: 'tue', label: 'Dienstag', short: 'Di' },
  { id: 'wed', label: 'Mittwoch', short: 'Mi' },
  { id: 'thu', label: 'Donnerstag', short: 'Do' },
  { id: 'fri', label: 'Freitag', short: 'Fr' },
  { id: 'sat', label: 'Samstag', short: 'Sa' },
  { id: 'sun', label: 'Sonntag', short: 'So' },
]
export const ALL_DAY_IDS = DAYS.map((d) => d.id)
export const MEALS = ['lunch', 'dinner']
export const MEAL_LABEL = { lunch: 'Mittagessen', dinner: 'Abendessen' }
export const MAX_DISHES = 14 // 7 Tage x Mittag und Abend

const isCalciumRich = (id) => Boolean(getDish(id)?.calciumRich)

// Sortiert Tage in Wochenreihenfolge.
export const sortDays = (dayIds) => ALL_DAY_IDS.filter((id) => dayIds.includes(id))

// Wie gut passen die gewählten Gerichte zu den gewählten Tagen?
//  empty: nichts gewählt · tooMany: zu viele für die Woche oder die Tage · tooFew: es fehlen Gerichte
//  noDays: keine Tage gewählt · ok: passt genau
export function countStatus(selectedCount, days) {
  if (selectedCount === 0) return { state: 'empty' }
  if (selectedCount > MAX_DISHES) return { state: 'tooMany', over: selectedCount - MAX_DISHES }
  if (days.length === 0) return { state: 'noDays' }
  const diff = selectedCount - days.length * 2
  if (diff === 0) return { state: 'ok' }
  return diff < 0 ? { state: 'tooFew', missing: -diff } : { state: 'tooMany', over: diff }
}

// Verteilt die gewählten Gerichte auf Mittag und Abend der gewählten Tage.
// Kalziumreiche Gerichte kommen möglichst auf verschiedene Tage.
export function distribute(selectedIds, days, isCa = isCalciumRich) {
  const dayIds = sortDays(days)
  const plan = Object.fromEntries(dayIds.map((d) => [d, { lunch: null, dinner: null }]))
  const caPerDay = Object.fromEntries(dayIds.map((d) => [d, 0]))
  const freeSlot = (d) => MEALS.find((m) => plan[d][m] === null)

  for (const id of selectedIds.filter(isCa)) {
    const candidates = dayIds.filter((d) => freeSlot(d))
    if (candidates.length === 0) break
    const day = candidates.reduce((best, d) => (caPerDay[d] < caPerDay[best] ? d : best))
    plan[day][freeSlot(day)] = id
    caPerDay[day] += 1
  }
  for (const id of selectedIds.filter((x) => !isCa(x))) {
    const day = dayIds.find((d) => freeSlot(d))
    if (!day) break
    plan[day][freeSlot(day)] = id
  }
  return plan
}

// Tage, an denen Mittag- und Abendessen beide kalziumreich sind.
export function calciumWarnings(plan, isCa = isCalciumRich) {
  return sortDays(Object.keys(plan)).filter((d) => {
    const { lunch, dinner } = plan[d]
    return lunch && dinner && isCa(lunch) && isCa(dinner)
  })
}

// Tauscht die Gerichte zweier Plätze (ein Platz = { day, meal }).
export function swapSlots(plan, a, b) {
  const next = Object.fromEntries(Object.entries(plan).map(([d, v]) => [d, { ...v }]))
  const tmp = next[a.day][a.meal]
  next[a.day][a.meal] = next[b.day][b.meal]
  next[b.day][b.meal] = tmp
  return next
}

export const dayLabel = (id) => DAYS.find((d) => d.id === id)?.label ?? id
