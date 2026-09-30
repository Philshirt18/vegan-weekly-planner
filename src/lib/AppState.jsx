import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { watchAuth, loadUserData, saveUserData } from './firebase.js'

// Zentraler Zustand der App. Persönliche Daten liegen in Firestore unter users/{uid}
// und werden bei jeder Änderung gespeichert.
const EMPTY = {
  members: [],
  selectedDishIds: [],
  days: [],
  plan: {},
  checkedIngredients: [],
}

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = wird noch geprüft
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
        setData({ ...EMPTY, ...(stored || {}) })
      } catch {
        setLoadError('Die Daten konnten nicht geladen werden. Bitte lade die Seite neu.')
        setData(EMPTY)
      }
      setUser(u)
    })
  }, [])

  // Ändert Daten sofort auf dem Bildschirm und speichert sie danach in Firestore.
  const update = useCallback(
    (patch) => {
      setData((d) => ({ ...d, ...patch }))
      if (!user) return
      saveUserData(user.uid, patch).then(
        () => setSaveError(''),
        () => setSaveError('Speichern hat nicht geklappt. Bitte prüfe deine Verbindung.'),
      )
    },
    [user],
  )

  const toggleDish = (id) =>
    update({
      selectedDishIds: data.selectedDishIds.includes(id)
        ? data.selectedDishIds.filter((x) => x !== id)
        : [...data.selectedDishIds, id],
    })

  const value = { user, data, update, toggleDish, selectedDishIds: data.selectedDishIds, loadError, saveError }
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const value = useContext(AppStateContext)
  if (!value) throw new Error('useAppState muss innerhalb von AppStateProvider genutzt werden')
  return value
}
