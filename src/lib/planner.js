import { getDish } from '../data/dishes.js'

export const DAYS = [
  { id: 'mon', label: 'Monday', short: 'Mon' },
  { id: 'tue', label: 'Tuesday', short: 'Tue' },
  { id: 'wed', label: 'Wednesday', short: 'Wed' },
  { id: 'thu', label: 'Thursday', short: 'Thu' },
  { id: 'fri', label: 'Friday', short: 'Fri' },
  { id: 'sat', label: 'Saturday', short: 'Sat' },
  { id: 'sun', label: 'Sunday', short: 'Sun' },
]
export const ALL_DAY_IDS = DAYS.map((d) => d.id)
export const MEALS = ['lunch', 'dinner']
export const MEAL_LABEL = { lunch: 'Lunch', dinner: 'Dinner' }
export const MAX_DISHES = 14 // 7 days x lunch and dinner

const isCalciumRich = (id) => Boolean(getDish(id)?.calciumRich)

// Sorts days in week order.
export const sortDays = (dayIds) => ALL_DAY_IDS.filter((id) => dayIds.includes(id))

// How well do the chosen dishes fit the chosen days?
//  empty: nothing chosen · tooMany: too many for the week or the days · tooFew: dishes missing
//  noDays: no days chosen · ok: fits exactly
export function countStatus(selectedCount, days) {
  if (selectedCount === 0) return { state: 'empty' }
  if (selectedCount > MAX_DISHES) return { state: 'tooMany', over: selectedCount - MAX_DISHES }
  if (days.length === 0) return { state: 'noDays' }
  const diff = selectedCount - days.length * 2
  if (diff === 0) return { state: 'ok' }
  return diff < 0 ? { state: 'tooFew', missing: -diff } : { state: 'tooMany', over: diff }
}

// Spreads the chosen dishes over lunch and dinner of the chosen days.
// Calcium-rich dishes go on different days where possible.
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

// Days on which lunch and dinner are both calcium-rich.
export function calciumWarnings(plan, isCa = isCalciumRich) {
  return sortDays(Object.keys(plan)).filter((d) => {
    const { lunch, dinner } = plan[d]
    return lunch && dinner && isCa(lunch) && isCa(dinner)
  })
}

// Swaps the dishes of two slots (a slot = { day, meal }).
export function swapSlots(plan, a, b) {
  const next = Object.fromEntries(Object.entries(plan).map(([d, v]) => [d, { ...v }]))
  const tmp = next[a.day][a.meal]
  next[a.day][a.meal] = next[b.day][b.meal]
  next[b.day][b.meal] = tmp
  return next
}

export const dayLabel = (id) => DAYS.find((d) => d.id === id)?.label ?? id
