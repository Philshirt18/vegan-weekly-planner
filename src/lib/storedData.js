import { getDish } from '../data/dishes.js'

export const EMPTY_WEEK = {
  selectedDishIds: [],
  days: [],
  plan: {},
  checkedIngredients: [], // ticked in the preview: already at home
  boughtIngredients: [], // ticked in the final list: in the shopping cart
}

// Drops saved dish ids that no longer exist and a plan that refers to them.
export function cleanWeek(week = {}) {
  const selectedDishIds = (week.selectedDishIds ?? []).filter((id) => getDish(id))
  const planIds = Object.values(week.plan ?? {}).flatMap((d) => [d.lunch, d.dinner]).filter(Boolean)
  const planOk = planIds.every((id) => getDish(id))
  return { ...EMPTY_WEEK, ...week, selectedDishIds, plan: planOk ? (week.plan ?? {}) : {} }
}

// Turns what is stored in Firestore into { members, weeks }.
// Older entries kept one single plan at the top level; that plan becomes the current week.
export function migrateStored(stored, thisWeekKey) {
  const s = stored ?? {}
  let weeks = s.weeks
  if (!weeks) {
    const legacy = {}
    for (const field of Object.keys(EMPTY_WEEK)) if (s[field] !== undefined) legacy[field] = s[field]
    weeks = Object.keys(legacy).length > 0 ? { [thisWeekKey]: legacy } : {}
  }
  return {
    members: s.members ?? [],
    weeks: Object.fromEntries(Object.entries(weeks).map(([key, week]) => [key, cleanWeek(week)])),
  }
}
