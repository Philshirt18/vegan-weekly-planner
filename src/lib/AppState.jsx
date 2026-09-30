import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { watchAuth, loadUserData, saveMembers, saveWeek } from './firebase.js'
import { EMPTY_WEEK, migrateStored } from './storedData.js'
import { weekKeyFor, weekTitle, weekWords, canMove, addWeeks } from './weeks.js'

// Central state of the app. Personal data lives in Firestore under users/{uid}:
//   members            the family
//   weeks[<Monday>]    for every week: chosen dishes, days, plan, and the two kinds of ticks
// It is saved on every change.
const EMPTY = { members: [], weeks: {} }

const AppStateContext = createContext(null)
const STORAGE_KEY = 'viewedWeek'

function initialWeekKey(todayKey) {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) return saved
  } catch {
    // storage can be blocked; then we simply start with this week
  }
  return todayKey
}

export function AppStateProvider({ children }) {
  const todayKey = useRef(weekKeyFor()).current
  const [user, setUser] = useState(undefined) // undefined = still being checked
  const [data, setDataState] = useState(EMPTY)
  const dataRef = useRef(EMPTY) // always the latest data, so quick successive changes do not overwrite each other
  const [weekKey, setWeekKeyState] = useState(() => initialWeekKey(todayKey))
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')

  const setData = useCallback((next) => {
    dataRef.current = next
    setDataState(next)
  }, [])

  useEffect(() => {
    return watchAuth(async (u) => {
      setSaveError('')
      setLoadError('')
      if (!u) {
        setData(EMPTY)
        setUser(null)
        return
      }
      try {
        setData(migrateStored(await loadUserData(u.uid), todayKey))
      } catch {
        setLoadError('Your data could not be loaded. Please reload the page.')
        setData(EMPTY)
      }
      setUser(u)
    })
  }, [setData, todayKey])

  const remember = (promise) =>
    promise.then(
      () => setSaveError(''),
      () => setSaveError('Saving did not work. Please check your connection.'),
    )

  const updateMembers = (members) => {
    setData({ ...dataRef.current, members })
    if (user) remember(saveMembers(user.uid, members))
  }

  const week = { ...EMPTY_WEEK, ...(data.weeks[weekKey] ?? {}) }

  // Changes the week that is being viewed and saves the whole week.
  // patch is an object, or a function that gets the latest week and returns the changes.
  const updateWeek = (patch) => {
    const current = dataRef.current
    const latest = { ...EMPTY_WEEK, ...(current.weeks[weekKey] ?? {}) }
    const next = { ...latest, ...(typeof patch === 'function' ? patch(latest) : patch) }
    setData({ ...current, weeks: { ...current.weeks, [weekKey]: next } })
    if (user) remember(saveWeek(user.uid, weekKey, next))
  }

  const toggleDish = (id) =>
    // If the selection changes, the previous plan no longer fits and is discarded.
    updateWeek((w) => ({
      selectedDishIds: w.selectedDishIds.includes(id)
        ? w.selectedDishIds.filter((x) => x !== id)
        : [...w.selectedDishIds, id],
      plan: {},
    }))

  const setWeekKey = (key) => {
    setWeekKeyState(key)
    try {
      sessionStorage.setItem(STORAGE_KEY, key)
    } catch {
      // ignore
    }
  }
  const moveWeek = (delta) => {
    if (canMove(weekKey, delta, todayKey)) setWeekKey(addWeeks(weekKey, delta))
  }

  const value = {
    user,
    members: data.members,
    week,
    weekKey,
    todayKey,
    weekTitle: weekTitle(weekKey, todayKey),
    weekWords: weekWords(weekKey, todayKey),
    moveWeek,
    canPrev: canMove(weekKey, -1, todayKey),
    canNext: canMove(weekKey, 1, todayKey),
    goToThisWeek: () => setWeekKey(todayKey),
    updateMembers,
    updateWeek,
    toggleDish,
    selectedDishIds: week.selectedDishIds,
    loadError,
    saveError,
  }
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const value = useContext(AppStateContext)
  if (!value) throw new Error('useAppState must be used inside AppStateProvider')
  return value
}
