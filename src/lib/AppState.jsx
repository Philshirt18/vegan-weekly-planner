import { createContext, useContext, useState } from 'react'

// Zentraler Zustand der App. In diesem Schritt lebt er nur im Speicher der Seite;
// mit dem Login (Schritt 2) wird er in Firestore gespeichert.
const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [selectedDishIds, setSelectedDishIds] = useState([])

  const toggleDish = (id) =>
    setSelectedDishIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

  return (
    <AppStateContext.Provider value={{ selectedDishIds, toggleDish }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const value = useContext(AppStateContext)
  if (!value) throw new Error('useAppState muss innerhalb von AppStateProvider genutzt werden')
  return value
}
