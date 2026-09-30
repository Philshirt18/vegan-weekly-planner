import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { watchAuth, loadUserData, saveUserData } from './firebase.js'
import { getDish } from '../data/dishes.js'

// Central state of the app. Personal data lives in Firestore under users/{uid}
// and is saved on every change.
const EMPTY = {
  members: [],
  selectedDishIds: [],
  days: [],
  plan: {},
  checkedIngredients: [],
}

// Drops saved dish ids that no longer exist (for example after dishes were renamed),
// and discards a saved plan that refers to them.
function cleanStored(stored) {
  const selectedDishIds = (stored.selectedDishIds ?? []).filter((id) => getDish(id))
  const planIds = Object.values(stored.plan ?? {}).flatMap((d) => [d.lunch, d.dinner]).filter(Boolean)
  const planOk = planIds.every((id) => getDish(id))
  return { ...stored, selectedDishIds, plan: planOk ? stored.plan : {} }
}

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = still being checked
  const [data, setData] = useState(EMPTY)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')

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
        const stored = await loadUserData(u.uid)
        setData({ ...EMPTY, ...cleanStored(stored || {}) })
      } catch {
        setLoadError('Your data could not be loaded. Please reload the page.')
        setData(EMPTY)
      }
      setUser(u)
    })
  }, [])

  // Changes data on screen immediately and then saves it to Firestore.
  const update = useCallback(
    (patch) => {
      setData((d) => ({ ...d, ...patch }))
      if (!user) return
      saveUserData(user.uid, patch).then(
        () => setSaveError(''),
        () => setSaveError('Saving did not work. Please check your connection.'),
      )
    },
    [user],
  )

  const toggleDish = (id) =>
    // If the selection changes, the previous week plan no longer fits and is discarded.
    update({
      selectedDishIds: data.selectedDishIds.includes(id)
        ? data.selectedDishIds.filter((x) => x !== id)
        : [...data.selectedDishIds, id],
      plan: {},
    })

  const value = { user, data, update, toggleDish, selectedDishIds: data.selectedDishIds, loadError, saveError }
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const value = useContext(AppStateContext)
  if (!value) throw new Error('useAppState must be used inside AppStateProvider')
  return value
}
