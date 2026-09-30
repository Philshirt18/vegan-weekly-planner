// Weeks are identified by the date of their Monday, written "YYYY-MM-DD" (local time).

const pad = (n) => String(n).padStart(2, '0')
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// The Monday of the week that contains the given date.
export function weekKeyFor(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return toKey(d)
}

export function addWeeks(key, n) {
  const d = fromKey(key)
  d.setDate(d.getDate() + 7 * n)
  return toKey(d)
}

// How many weeks lie between two week keys (positive if b is later than a).
export const weeksBetween = (a, b) => Math.round((fromKey(b) - fromKey(a)) / (7 * 24 * 3600 * 1000))

// You can plan from last week up to 8 weeks ahead.
export const MIN_OFFSET = -1
export const MAX_OFFSET = 8
export const canMove = (key, delta, todayKey) => {
  const next = weeksBetween(todayKey, key) + delta
  return next >= MIN_OFFSET && next <= MAX_OFFSET
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const dayMonth = { format: (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}` }

// "28 Sep – 4 Oct"
export function weekRange(key) {
  const start = fromKey(key)
  const end = fromKey(key)
  end.setDate(end.getDate() + 6)
  return `${dayMonth.format(start)} – ${dayMonth.format(end)}`
}

// "This week", "Next week", "Last week" or "Week of 5 Oct".
export function weekTitle(key, todayKey) {
  const diff = weeksBetween(todayKey, key)
  if (diff === 0) return 'This week'
  if (diff === 1) return 'Next week'
  if (diff === -1) return 'Last week'
  return `Week of ${dayMonth.format(fromKey(key))}`
}

// The same in a sentence: "this week", "next week", "last week" or "that week".
export function weekWords(key, todayKey) {
  const diff = weeksBetween(todayKey, key)
  if (diff === 0) return 'this week'
  if (diff === 1) return 'next week'
  if (diff === -1) return 'last week'
  return 'that week'
}
